# Cross-Chain Dust Aggregator

A cross-chain dust aggregator that allows users to bundle small token amounts ("dust") across multiple chains and sell them efficiently through an intent-based marketplace.

## How It Works

1. **Dust Detection**: Users connect their wallets to scan for small token balances (<$50) across multiple chains
2. **Cross-Chain Aggregation**: Using LayerZero OFT (Omnichain Fungible Tokens), dust tokens are transferred with compose messages to create unified auctions
3. **Marketplace Settlement**: Orders are automatically created on the marketplace chain (Arbitrum Sepolia) when tokens arrive
4. **Solver Network**: Market makers can fill orders with USDC, providing competitive pricing
5. **Cross-Chain Settlement**: Proceeds are delivered to users on their preferred chain using Circle CCTP for USDC transfers

## Architecture

The system uses a single `DustMarketplace` contract that implements LayerZero's `IOAppComposer` interface. When OFT tokens arrive with compose messages, auctions are automatically created. Solvers can fill orders, and proceeds are settled either locally or cross-chain via CCTP.

## Technology Stack

### Smart Contracts
- **LayerZero V2**: Cross-chain messaging and OFT token transfers
- **LayerZero Compose**: Automatic auction creation from token transfers
- **Circle CCTP**: Cross-chain USDC settlement
- **Solidity**: Smart contract development

### Frontend
- **Next.js 14**: React framework with App Router
- **Dynamic**: Wallet authentication and connection
- **Viem + Wagmi**: Ethereum interaction
- **Tailwind CSS + Shadcn/ui**: UI components

### Supported Chains (Testnet)
- **Arbitrum Sepolia**: Marketplace hub
- **Ethereum Sepolia**: Primary dust source
- **Optimism Sepolia**: Additional dust source
- **Base Sepolia**: Additional dust source

## Key Features

- **One-Click Aggregation**: Bundle dust from multiple chains in a single transaction
- **Intent-Based Pricing**: Choose between instant fills or auction-based discovery
- **Cross-Chain Settlement**: Receive USDC on any supported chain
- **Gas Optimization**: Efficient batching and L2-focused design
- **Solver Network**: Independent, competitive market making for best prices
