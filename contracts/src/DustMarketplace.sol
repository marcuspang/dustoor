// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {OApp, Origin} from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import {IOAppComposer} from "@layerzerolabs/oapp-evm/contracts/oapp/interfaces/IOAppComposer.sol";
import {OFTComposeMsgCodec} from "@layerzerolabs/oft-evm/contracts/libs/OFTComposeMsgCodec.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {MessagingFee} from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpointV2.sol";
import {OptionsBuilder} from "@layerzerolabs/oapp-evm/contracts/oapp/libs/OptionsBuilder.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ITokenMessenger} from "./interfaces/ITokenMessenger.sol";
import {CCTPConfig} from "./CCTPConfig.sol";

contract DustMarketplace is OApp, IOAppComposer {
    using SafeERC20 for IERC20;
    using OptionsBuilder for bytes;

    struct MarketOrder {
        bytes32 orderId;
        uint32 sourceEid;
        address seller;
        DustDeposit[] deposits;
        uint256 minPrice;
        uint256 deadline;
        bool isAuction;
        bool isFilled;
        address winner;
        uint256 winningBid;
        uint32 destinationEid;
    }

    struct DustDeposit {
        address token;
        uint256 amount;
        uint256 minPrice;
    }

    struct Bid {
        address bidder;
        uint256 amount;
        uint256 timestamp;
    }

    // State
    mapping(bytes32 => MarketOrder) public marketOrders;
    mapping(bytes32 => Bid[]) public orderBids;
    mapping(address => bool) public trustedOFTs; // Trusted OFT addresses

    address public settlementToken; // USDC
    uint256 public protocolFee = 100; // 1% = 100 basis points
    address public feeRecipient;
    ITokenMessenger public tokenMessenger;
    uint32 public currentDomain;
    CCTPConfig public cctpConfig;

    // Events
    event OrderListed(bytes32 indexed orderId, address seller, uint256 minPrice);
    event BidPlaced(bytes32 indexed orderId, address bidder, uint256 amount);
    event OrderFilled(bytes32 indexed orderId, address winner, uint256 price);
    event InstantBuyExecuted(bytes32 indexed orderId, address buyer, uint256 price);

    constructor(
        address _endpoint,
        address _owner,
        address _settlementToken,
        address _tokenMessenger,
        uint32 _currentDomain
    ) OApp(_endpoint, _owner) Ownable(_owner) {
        settlementToken = _settlementToken;
        feeRecipient = _owner;
        tokenMessenger = ITokenMessenger(_tokenMessenger);
        currentDomain = _currentDomain;
        cctpConfig = new CCTPConfig();
    }

    // Receive order from source chain
    function _lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata _message,
        address _executor,
        bytes calldata _extraData
    ) internal override {
        // Decode message
        (
            bytes32 orderId,
            address seller,
            DustDeposit[] memory deposits,
            uint256 minPrice,
            uint256 deadline,
            bool isAuction
        ) = abi.decode(_message, (bytes32, address, DustDeposit[], uint256, uint256, bool));

        marketOrders[orderId] = MarketOrder({
            orderId: orderId,
            sourceEid: _origin.srcEid,
            seller: seller,
            deposits: deposits,
            minPrice: minPrice,
            deadline: deadline,
            isAuction: isAuction,
            isFilled: false,
            winner: address(0),
            winningBid: 0,
            destinationEid: _origin.srcEid
        });

        emit OrderListed(orderId, seller, minPrice);
    }

    // Receive OFT tokens with compose message to create auction
    function lzCompose(
        address _oApp,
        bytes32 _guid,
        bytes calldata _message,
        address _executor,
        bytes calldata _extraData
    ) external payable override {
        require(msg.sender == address(endpoint), "DustMarketplace: unauthorized sender");
        require(trustedOFTs[_oApp], "DustMarketplace: untrusted OFT");

        // Decode the full composed message context
        uint64 nonce = OFTComposeMsgCodec.nonce(_message);
        uint32 srcEid = OFTComposeMsgCodec.srcEid(_message);
        uint256 amountLD = OFTComposeMsgCodec.amountLD(_message);

        // Get original sender (who initiated the OFT transfer)
        bytes32 composeFromBytes = OFTComposeMsgCodec.composeFrom(_message);
        address originalSender = OFTComposeMsgCodec.bytes32ToAddress(composeFromBytes);

        // Decode custom compose message with auction parameters
        bytes memory composeMsg = OFTComposeMsgCodec.composeMsg(_message);
        (uint256 minPrice, uint256 deadline, bool isAuction, uint32 destinationEid) =
            abi.decode(composeMsg, (uint256, uint256, bool, uint32));

        // Create unique order ID
        bytes32 orderId = keccak256(abi.encodePacked(block.chainid, address(this), originalSender, nonce));

        // Create dust deposit representing the OFT tokens received
        DustDeposit[] memory deposits = new DustDeposit[](1);
        deposits[0] = DustDeposit({
            token: _oApp, // The OFT token address
            amount: amountLD,
            minPrice: minPrice
        });

        // Create market order for OFT tokens
        marketOrders[orderId] = MarketOrder({
            orderId: orderId,
            sourceEid: srcEid,
            seller: originalSender,
            deposits: deposits,
            minPrice: minPrice,
            deadline: deadline,
            isAuction: isAuction,
            isFilled: false,
            winner: address(0),
            winningBid: 0,
            destinationEid: destinationEid
        });

        emit OrderListed(orderId, originalSender, minPrice);
    }

    // Instant buy (non-auction, for demo purposes)
    function instantBuy(bytes32 orderId) external payable {
        MarketOrder storage order = marketOrders[orderId];
        require(!order.isAuction, "Order is auction");
        require(!order.isFilled, "Already filled");
        require(block.timestamp <= order.deadline, "Order expired");

        uint256 totalPrice = order.minPrice;
        uint256 protocolCut = (totalPrice * protocolFee) / 10000;
        uint256 sellerAmount = totalPrice - protocolCut;

        // Transfer USDC from buyer
        IERC20(settlementToken).safeTransferFrom(msg.sender, address(this), totalPrice);

        // Take protocol fee
        if (protocolCut > 0) {
            IERC20(settlementToken).safeTransfer(feeRecipient, protocolCut);
        }

        // Mark as filled
        order.isFilled = true;
        order.winner = msg.sender;
        order.winningBid = totalPrice;

        // Send settlement to destination chain
        _sendSettlement(order, msg.sender, sellerAmount);

        emit InstantBuyExecuted(orderId, msg.sender, totalPrice);
    }

    // Place bid (auction)
    function placeBid(bytes32 orderId, uint256 bidAmount) external {
        MarketOrder storage order = marketOrders[orderId];
        require(order.isAuction, "Not an auction");
        require(!order.isFilled, "Already filled");
        require(block.timestamp <= order.deadline, "Auction ended");
        require(bidAmount >= order.minPrice, "Below minimum");

        // Check if bid is highest
        Bid[] storage bids = orderBids[orderId];
        if (bids.length > 0) {
            require(bidAmount > bids[bids.length - 1].amount, "Bid too low");
        }

        // Add bid
        bids.push(Bid({bidder: msg.sender, amount: bidAmount, timestamp: block.timestamp}));

        emit BidPlaced(orderId, msg.sender, bidAmount);
    }

    // Finalize auction
    function finalizeAuction(bytes32 orderId) external payable {
        MarketOrder storage order = marketOrders[orderId];
        require(order.isAuction, "Not an auction");
        require(!order.isFilled, "Already filled");
        require(block.timestamp > order.deadline, "Auction not ended");

        Bid[] storage bids = orderBids[orderId];
        require(bids.length > 0, "No bids");

        // Get winning bid
        Bid memory winningBid = bids[bids.length - 1];

        uint256 protocolCut = (winningBid.amount * protocolFee) / 10000;
        uint256 sellerAmount = winningBid.amount - protocolCut;

        // Transfer USDC from winner
        IERC20(settlementToken).safeTransferFrom(winningBid.bidder, address(this), winningBid.amount);

        // Take protocol fee
        if (protocolCut > 0) {
            IERC20(settlementToken).safeTransfer(feeRecipient, protocolCut);
        }

        // Mark as filled
        order.isFilled = true;
        order.winner = winningBid.bidder;
        order.winningBid = winningBid.amount;

        // Send settlement to destination chain
        _sendSettlement(order, winningBid.bidder, sellerAmount);

        emit OrderFilled(orderId, winningBid.bidder, winningBid.amount);
    }

    // Send settlement with flexible destination (same chain or cross-chain via CCTP)
    function _sendSettlement(MarketOrder memory order, address solver, uint256 amount) internal {
        // Transfer dust tokens to solver (tokens are already on marketplace chain from OFT compose)
        for (uint256 i = 0; i < order.deposits.length; i++) {
            IERC20(order.deposits[i].token).safeTransfer(solver, order.deposits[i].amount);
        }

        // Handle USDC settlement based on destination
        if (order.destinationEid == currentDomain) {
            // Same chain settlement - direct USDC transfer
            IERC20(settlementToken).safeTransfer(order.seller, amount);
        } else {
            // Cross-chain settlement via CCTP
            require(cctpConfig.isChainSupported(order.destinationEid), "Unsupported destination chain");
            uint32 destinationDomain = cctpConfig.getCCTPDomain(order.destinationEid);

            // Check if marketplace has enough USDC for settlement
            uint256 marketplaceBalance = IERC20(settlementToken).balanceOf(address(this));
            require(marketplaceBalance >= amount, "Insufficient USDC for settlement");

            // Approve USDC for burning
            IERC20(settlementToken).approve(address(tokenMessenger), amount);

            // Use CCTP to burn USDC on marketplace chain and mint on destination chain
            bytes32 mintRecipient = bytes32(uint256(uint160(order.seller)));
            bytes32 destinationCaller = bytes32(0); // No specific destination caller needed

            // Use depositForBurn for simple cross-chain USDC transfer
            tokenMessenger.depositForBurn(
                amount,
                destinationDomain,
                mintRecipient,
                settlementToken,
                destinationCaller,
                0, // maxFee - 0 for standard transfer
                1000 // minFinalityThreshold - 1000 for confirmed transfer
            );
        }
    }

    // Admin functions
    function setTrustedOFT(address oft, bool trusted) external onlyOwner {
        trustedOFTs[oft] = trusted;
    }

    function setTokenMessenger(address _tokenMessenger) external onlyOwner {
        tokenMessenger = ITokenMessenger(_tokenMessenger);
    }

    function setCCTPConfig(address _cctpConfig) external onlyOwner {
        cctpConfig = CCTPConfig(_cctpConfig);
    }

    function _createOptions(uint32 _dstEid) internal pure returns (bytes memory) {
        uint128 gas = 300000;
        return OptionsBuilder.newOptions().addExecutorLzReceiveOption(gas, 0);
    }
}
