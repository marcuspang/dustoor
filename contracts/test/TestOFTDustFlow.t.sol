// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Test.sol";
import "../src/DustMarketplace.sol";
import "../src/CCTPConfig.sol";
import "../test/mocks/MockOFT.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Origin} from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import {OFTComposeMsgCodec} from "@layerzerolabs/oft-evm/contracts/libs/OFTComposeMsgCodec.sol";
import {ILayerZeroEndpointV2} from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpointV2.sol";

contract TestOFTDustFlowTest is Test {
    uint32 constant SEPOLIA_EID = 40161;
    uint32 constant ARB_SEPOLIA_EID = 40231;
    uint32 constant OP_SEPOLIA_EID = 40232;
    uint32 constant BASE_SEPOLIA_EID = 40245;

    // LayerZero Endpoint addresses (Testnet)
    address constant SEPOLIA_ENDPOINT = 0x6EDCE65403992e310A62460808c4b910D972f10f;
    address constant ARB_SEPOLIA_ENDPOINT = 0x6EDCE65403992e310A62460808c4b910D972f10f;

    // CCTP v2 Testnet Addresses
    address constant TOKEN_MESSENGER_V2 = 0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA;

    // CCTP Domain IDs
    uint32 constant ETHEREUM_SEPOLIA_DOMAIN = 0;
    uint32 constant ARBITRUM_SEPOLIA_DOMAIN = 3;

    // Fork URLs
    string constant ARB_SEPOLIA_RPC_URL = "https://arbitrum-sepolia.drpc.org";
    uint256 arbSepoliaFork;

    // Test actors
    address user;
    address solver;
    uint256 userKey;
    uint256 solverKey = 0x2;

    // Contracts
    DustMarketplace marketplace;
    CCTPConfig cctpConfig;
    MockOFT mockUSDT;
    MockOFT mockUSDC;
    MockOFT mockLINK;
    IERC20 settlementUSDC; // Real USDC for settlement

    function setUp() public {
        // Create and select fork
        arbSepoliaFork = vm.createSelectFork(ARB_SEPOLIA_RPC_URL);

        // Set up test addresses - use real account with USDC
        userKey = vm.envUint("PRIVATE_KEY");
        user = vm.addr(userKey);
        solver = vm.addr(solverKey);

        console.log("Using user address:", user);
        console.log("User USDC balance:", IERC20(0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d).balanceOf(user));

        // Deploy CCTP config
        cctpConfig = new CCTPConfig();

        // Deploy marketplace on Arbitrum Sepolia - now the only contract needed
        marketplace = new DustMarketplace(
            ARB_SEPOLIA_ENDPOINT,
            address(this), // owner
            0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d, // USDC on Arb Sepolia
            TOKEN_MESSENGER_V2,
            ARBITRUM_SEPOLIA_DOMAIN
        );

        // Set up settlement USDC
        settlementUSDC = IERC20(0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d);

        // Deploy mock OFT tokens for testing
        mockUSDT = new MockOFT("Mock USDT", "mUSDT", 6, SEPOLIA_ENDPOINT, address(this));
        mockUSDC = new MockOFT("Mock USDC", "mUSDC", 6, SEPOLIA_ENDPOINT, address(this));
        mockLINK = new MockOFT("Mock LINK", "mLINK", 18, SEPOLIA_ENDPOINT, address(this));

        // Set up OFT peers - all OFTs point to marketplace as destination
        mockUSDT.setPeer(ARB_SEPOLIA_EID, bytes32(uint256(uint160(address(marketplace)))));
        mockUSDC.setPeer(ARB_SEPOLIA_EID, bytes32(uint256(uint160(address(marketplace)))));
        mockLINK.setPeer(ARB_SEPOLIA_EID, bytes32(uint256(uint160(address(marketplace)))));

        // Configure trusted OFTs in marketplace
        marketplace.setTrustedOFT(address(mockUSDT), true);
        marketplace.setTrustedOFT(address(mockUSDC), true);
        marketplace.setTrustedOFT(address(mockLINK), true);

        // Debug: Verify CCTP config is working correctly
        console.log("CCTP domain for SEPOLIA_EID:", marketplace.cctpConfig().getCCTPDomain(SEPOLIA_EID));
        console.log("ETHEREUM_SEPOLIA_DOMAIN constant:", ETHEREUM_SEPOLIA_DOMAIN);
        console.log("Is SEPOLIA_EID supported:", marketplace.cctpConfig().isChainSupported(SEPOLIA_EID));

        // Mint tokens to user for testing
        mockUSDT.mint(user, 100 * 10 ** 6); // 100 USDT
        mockUSDC.mint(user, 100 * 10 ** 6); // 100 USDC
        mockLINK.mint(user, 10 * 10 ** 18); // 10 LINK

        console.log("Mock OFT token balances for user:");
        console.log("USDT:", mockUSDT.balanceOf(user));
        console.log("USDC:", mockUSDC.balanceOf(user));
        console.log("LINK:", mockLINK.balanceOf(user));

        // Give solver some USDC for filling orders
        deal(address(settlementUSDC), solver, 1000 * 10 ** 6); // 1000 USDC to solver

        // Give accounts ETH for gas
        vm.deal(user, 10 ether);
        vm.deal(solver, 10 ether);
    }

    function testOFTComposeFlowSameChain() public {
        // Test OFT compose flow with same-chain settlement (destinationEid == currentDomain)
        uint256 dustAmount = 5 * 10 ** 6; // 5 USDT
        uint256 minPrice = 5 * 10 ** 6; // $5 minimum
        uint256 deadline = block.timestamp + 1 hours;
        bool isAuction = false;
        uint32 destinationEid = ARBITRUM_SEPOLIA_DOMAIN; // Same chain settlement

        // Step 1: User sends OFT tokens with compose message
        vm.startPrank(user);

        // Prepare compose message with auction parameters
        bytes memory composeMsg = abi.encode(minPrice, deadline, isAuction, destinationEid);

        // Simulate OFT compose message data (what would be created by OFT send)
        uint64 nonce = 1;
        bytes memory oftComposeMessage = abi.encodePacked(
            nonce,                              // nonce (8 bytes)
            uint32(SEPOLIA_EID),               // srcEid (4 bytes)
            dustAmount,                        // amountLD (32 bytes)
            bytes32(uint256(uint160(user))),   // composeFrom (32 bytes)
            composeMsg                         // composeMsg
        );

        // Transfer dust tokens to marketplace (simulating OFT receive)
        mockUSDT.transfer(address(marketplace), dustAmount);

        // Simulate lzCompose call from LayerZero endpoint
        vm.stopPrank();
        vm.prank(ARB_SEPOLIA_ENDPOINT);
        marketplace.lzCompose(
            address(mockUSDT),  // _oApp (OFT address)
            keccak256("test_guid"),  // _guid
            oftComposeMessage,  // _message
            address(this),      // _executor
            ""                  // _extraData
        );

        // Verify order was created
        bytes32 orderId = keccak256(abi.encodePacked(block.chainid, address(marketplace), user, nonce));

        // Note: deposits array is not included in automatic getter, so we get 10 fields instead of 11
        (
            bytes32 returnedOrderId,
            uint32 sourceEid,
            address seller,
            uint256 orderMinPrice,
            uint256 _deadline,
            bool orderIsAuction,
            bool isFilled,
            address winner,
            uint256 winningBid,
            uint32 orderDestinationEid
        ) = marketplace.marketOrders(orderId);

        assertEq(returnedOrderId, orderId, "Order ID should match");
        assertEq(sourceEid, SEPOLIA_EID, "Source EID should match");
        assertEq(seller, user, "Seller should match user");
        assertEq(orderMinPrice, minPrice, "Min price should match");
        assertEq(orderIsAuction, isAuction, "Auction flag should match");
        assertEq(isFilled, false, "Order should not be filled yet");
        assertEq(orderDestinationEid, destinationEid, "Destination EID should match");

        console.log("OFT compose message created order successfully");

        // Step 2: Solver fills order with same-chain settlement
        vm.startPrank(solver);

        uint256 orderPrice = minPrice;
        settlementUSDC.approve(address(marketplace), orderPrice);

        uint256 userBalanceBefore = settlementUSDC.balanceOf(user);
        uint256 solverOftBalanceBefore = mockUSDT.balanceOf(solver);

        // Fill order - should settle on same chain (direct transfer)
        marketplace.instantBuy(orderId);

        // Verify settlement
        uint256 protocolFee = (orderPrice * marketplace.protocolFee()) / 10000;
        uint256 expectedUserAmount = orderPrice - protocolFee;

        assertEq(settlementUSDC.balanceOf(user), userBalanceBefore + expectedUserAmount, "User should receive USDC");
        assertEq(mockUSDT.balanceOf(solver), solverOftBalanceBefore + dustAmount, "Solver should receive OFT tokens");

        vm.stopPrank();

        console.log("Same-chain settlement completed successfully");
        console.log("User received USDC:", expectedUserAmount);
        console.log("Solver received OFT tokens:", dustAmount);
    }

    function testOFTComposeFlowCrossChain() public {
        // Test OFT compose flow with cross-chain settlement (destinationEid != currentDomain)
        uint256 dustAmount = 10 * 10 ** 6; // 10 USDT
        uint256 minPrice = 10 * 10 ** 6; // $10 minimum
        uint256 deadline = block.timestamp + 1 hours;
        bool isAuction = false;
        uint32 destinationEid = SEPOLIA_EID; // Cross-chain settlement to Sepolia (use EID, not domain)

        // Step 1: User sends OFT tokens with compose message
        vm.startPrank(user);

        // Prepare compose message with auction parameters
        bytes memory composeMsg = abi.encode(minPrice, deadline, isAuction, destinationEid);

        // Simulate OFT compose message data
        uint64 nonce = 2;
        bytes memory oftComposeMessage = abi.encodePacked(
            nonce,
            uint32(SEPOLIA_EID),
            dustAmount,
            bytes32(uint256(uint160(user))),
            composeMsg
        );

        // Transfer dust tokens to marketplace (simulating OFT receive)
        mockUSDT.transfer(address(marketplace), dustAmount);

        // Simulate lzCompose call
        vm.stopPrank();
        vm.prank(ARB_SEPOLIA_ENDPOINT);
        marketplace.lzCompose(
            address(mockUSDT),
            keccak256("test_guid_2"),
            oftComposeMessage,
            address(this),
            ""
        );

        // Verify order was created
        bytes32 orderId = keccak256(abi.encodePacked(block.chainid, address(marketplace), user, nonce));
        (,,,,,,,,,uint32 orderDestinationEid) = marketplace.marketOrders(orderId);

        assertEq(orderDestinationEid, destinationEid, "Destination EID should be Sepolia");

        console.log("Cross-chain OFT order created successfully");

        // Step 2: Solver fills order with cross-chain settlement
        vm.startPrank(solver);

        uint256 orderPrice = minPrice;
        settlementUSDC.approve(address(marketplace), orderPrice);

        uint256 marketplaceBalanceBefore = settlementUSDC.balanceOf(address(marketplace));
        uint256 solverOftBalanceBefore = mockUSDT.balanceOf(solver);

        // Fill order - should transfer OFT tokens even if CCTP fails
        try marketplace.instantBuy(orderId) {
            console.log("Cross-chain settlement initiated successfully");
        } catch Error(string memory reason) {
            console.log("Cross-chain settlement failed (expected in test environment):", reason);
            // This is expected since CCTP won't actually deliver cross-chain in tests
            // But OFT tokens should still have been transferred to solver
        }

        // Verify that OFT tokens were transferred to solver (should happen regardless of CCTP failure)
        assertEq(mockUSDT.balanceOf(solver), solverOftBalanceBefore + dustAmount, "Solver should receive OFT tokens");

        vm.stopPrank();

        console.log("Cross-chain OFT test completed");
        console.log("Solver received OFT tokens:", dustAmount);
    }

    function testMultipleOFTCompose() public {
        // Test multiple OFT tokens in sequence
        uint256 usdtAmount = 3 * 10 ** 6;
        uint256 usdcAmount = 2 * 10 ** 6;
        uint256 linkAmount = 0.1 * 10 ** 18;

        // Send USDT
        _sendOFTWithCompose(mockUSDT, usdtAmount, 3 * 10 ** 6, 1);

        // Send USDC
        _sendOFTWithCompose(mockUSDC, usdcAmount, 2 * 10 ** 6, 2);

        // Send LINK
        _sendOFTWithCompose(mockLINK, linkAmount, 1.5 * 10 ** 6, 3); // ~$1.5 for 0.1 LINK

        console.log("Multiple OFT compose messages sent successfully");
        console.log("Created 3 separate orders for different OFT tokens");
    }

    function _sendOFTWithCompose(MockOFT oft, uint256 amount, uint256 minPrice, uint64 nonce) internal {
        vm.startPrank(user);

        bytes memory composeMsg = abi.encode(
            minPrice,
            block.timestamp + 1 hours,
            false, // instant buy
            ARBITRUM_SEPOLIA_DOMAIN // same chain settlement
        );

        bytes memory oftComposeMessage = abi.encodePacked(
            nonce,
            uint32(SEPOLIA_EID),
            amount,
            bytes32(uint256(uint160(user))),
            composeMsg
        );

        // Transfer tokens and simulate compose
        oft.transfer(address(marketplace), amount);

        vm.stopPrank();
        vm.prank(ARB_SEPOLIA_ENDPOINT);
        marketplace.lzCompose(
            address(oft),
            keccak256(abi.encodePacked("guid_", nonce)),
            oftComposeMessage,
            address(this),
            ""
        );

        // Verify order was created
        bytes32 orderId = keccak256(abi.encodePacked(block.chainid, address(marketplace), user, nonce));
        (,,,,,,bool isFilled,,,) = marketplace.marketOrders(orderId);

        assertEq(isFilled, false, "Order should not be filled");
    }

    function testMockOFTFunctionality() public {
        // Test that mock OFTs work correctly
        assertEq(mockUSDT.name(), "Mock USDT");
        assertEq(mockUSDT.symbol(), "mUSDT");
        assertEq(mockUSDT.decimals(), 6);
        assertEq(mockUSDT.balanceOf(user), 100 * 10 ** 6);

        assertEq(mockUSDC.name(), "Mock USDC");
        assertEq(mockUSDC.symbol(), "mUSDC");
        assertEq(mockUSDC.decimals(), 6);
        assertEq(mockUSDC.balanceOf(user), 100 * 10 ** 6);

        assertEq(mockLINK.name(), "Mock LINK");
        assertEq(mockLINK.symbol(), "mLINK");
        assertEq(mockLINK.decimals(), 18);
        assertEq(mockLINK.balanceOf(user), 10 * 10 ** 18);
    }

    function testCCTPConfigIntegration() public {
        // Test that CCTPConfig works correctly
        assertEq(marketplace.cctpConfig().getCCTPDomain(SEPOLIA_EID), ETHEREUM_SEPOLIA_DOMAIN);
        assertEq(marketplace.cctpConfig().getCCTPDomain(ARB_SEPOLIA_EID), ARBITRUM_SEPOLIA_DOMAIN);

        assertTrue(marketplace.cctpConfig().isChainSupported(SEPOLIA_EID));
        assertTrue(marketplace.cctpConfig().isChainSupported(ARB_SEPOLIA_EID));

        // Test unsupported chain
        assertFalse(marketplace.cctpConfig().isChainSupported(99999));

        console.log("CCTP Config integration test passed");
    }

    function testTrustedOFTManagement() public {
        // Test setting trusted OFTs
        address newOFT = address(0x123);

        // Should fail from non-owner
        vm.prank(user);
        vm.expectRevert();
        marketplace.setTrustedOFT(newOFT, true);

        // Should work from owner
        marketplace.setTrustedOFT(newOFT, true);
        assertTrue(marketplace.trustedOFTs(newOFT));

        // Should be able to remove trust
        marketplace.setTrustedOFT(newOFT, false);
        assertFalse(marketplace.trustedOFTs(newOFT));

        console.log("Trusted OFT management test passed");
    }
}