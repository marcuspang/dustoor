// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import "../src/DustMarketplace.sol";
import "../src/CCTPConfig.sol";
import "../test/mocks/MockOFT.sol";

contract DeployOFTDustMarketplace is Script {
    // LayerZero Endpoint addresses (Testnet)
    address constant SEPOLIA_ENDPOINT = 0x6EDCE65403992e310A62460808c4b910D972f10f;
    address constant ARB_SEPOLIA_ENDPOINT = 0x6EDCE65403992e310A62460808c4b910D972f10f;
    address constant OP_SEPOLIA_ENDPOINT = 0x6EDCE65403992e310A62460808c4b910D972f10f;
    address constant BASE_SEPOLIA_ENDPOINT = 0x6EDCE65403992e310A62460808c4b910D972f10f;

    // Endpoint IDs
    uint32 constant SEPOLIA_EID = 40161;
    uint32 constant ARB_SEPOLIA_EID = 40231;
    uint32 constant OP_SEPOLIA_EID = 40232;
    uint32 constant BASE_SEPOLIA_EID = 40245;

    // CCTP v2 Testnet Addresses
    address constant TOKEN_MESSENGER_V2 = 0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA;

    // CCTP Domain IDs
    uint32 constant ETHEREUM_SEPOLIA_DOMAIN = 0;
    uint32 constant ARBITRUM_SEPOLIA_DOMAIN = 3;
    uint32 constant OP_SEPOLIA_DOMAIN = 2;
    uint32 constant BASE_SEPOLIA_DOMAIN = 6;

    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        vm.startBroadcast(deployerKey);

        console.log("Deploying OFT-based Dust Marketplace...");
        console.log("Deployer address:", deployer);

        // Deploy DustMarketplace on Arbitrum Sepolia (the only contract needed!)
        DustMarketplace marketplace = new DustMarketplace(
            ARB_SEPOLIA_ENDPOINT,
            deployer,
            0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d, // USDC on Arb Sepolia
            TOKEN_MESSENGER_V2,
            ARBITRUM_SEPOLIA_DOMAIN
        );

        console.log("=== DEPLOYMENT SUCCESSFUL ===");
        console.log("DustMarketplace deployed at:", address(marketplace));
        console.log("Settlement Token (USDC):", marketplace.settlementToken());
        console.log("Current Domain:", marketplace.currentDomain());

        // Configure trusted OFT tokens (update addresses with real OFT deployments)
        console.log("\\n=== CONFIGURING TRUSTED OFTS ===");

        MockOFT mockUSDT = new MockOFT("Mock USDT", "mUSDT", 6, SEPOLIA_ENDPOINT, deployer);
        MockOFT mockUSDC = new MockOFT("Mock USDC", "mUSDC", 6, SEPOLIA_ENDPOINT, deployer);
        MockOFT mockLINK = new MockOFT("Mock LINK", "mLINK", 6, SEPOLIA_ENDPOINT, deployer);

        console.log("Mock OFT token addresses:");
        console.log("USDT:", address(mockUSDT));
        console.log("USDC:", address(mockUSDC));
        console.log("LINK:", address(mockLINK));

        marketplace.setTrustedOFT(address(mockUSDT), true);
        marketplace.setTrustedOFT(address(mockUSDC), true);
        marketplace.setTrustedOFT(address(mockLINK), true);

        mockUSDT.setPeer(ARB_SEPOLIA_EID, bytes32(uint256(uint160(address(marketplace)))));
        mockUSDC.setPeer(ARB_SEPOLIA_EID, bytes32(uint256(uint160(address(marketplace)))));
        mockLINK.setPeer(ARB_SEPOLIA_EID, bytes32(uint256(uint160(address(marketplace)))));

        vm.stopBroadcast();
    }
}
