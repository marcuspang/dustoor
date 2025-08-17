# Cross-Chain Dust Aggregator Testing Interface

A comprehensive testing interface for the LayerZero V2 powered cross-chain dust aggregator marketplace.

## Features

### 🔗 Wallet Connection
- Dynamic Labs wallet integration with multi-chain support
- Real-time account status display
- Support for Ethereum Sepolia, Arbitrum Sepolia, and Base Sepolia

### 📚 How It Works Tab
- Educational content about cross-chain dust aggregation
- Step-by-step process flow explanation
- LayerZero V2 and OFT technology overview
- Supported testnet chains information

### 🪙 Manage Mock Tokens Tab
- **Token Minting**: Single and batch minting of mock OFT tokens
- **Token List**: View available mock tokens with real-time balances
- **Cross-Chain Send**: Test OFT transfers with compose messages
- **Mock Tokens Available**:
  - USDT (USD Tether)
  - USDC (USD Coin) 
  - LINK (Chainlink Token)

### 🏪 Auction/Marketplace Tab
- **Manage Marketplace**: Add/remove trusted OFT tokens
- **Create Orders**: Mock order creation interface (demonstrates UI flow)
- **Order Management**: View and interact with market orders
- **Trading Features**:
  - Place bids on auction orders
  - Execute instant buy orders
  - Finalize completed auctions
  - Local storage for order tracking

## Setup

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Dynamic Labs environment ID to `.env.local`:
   ```
   NEXT_PUBLIC_DYNAMIC_ENV_ID=your_dynamic_environment_id_here
   ```

3. **Get Dynamic Labs Environment ID**
   - Visit [Dynamic Labs Dashboard](https://app.dynamic.xyz/)
   - Create a new project or use existing one
   - Copy the Environment ID from your project settings

4. **Run Development Server**
   ```bash
   pnpm dev
   ```

## Contract Addresses

- **Marketplace**: `0xD0c0d3D827ACb98ae1d230af29CE7D6f47cfCC86`
- **Mock USDT**: `0xFF49a329513491083044D070859eC7BCF7BD0109`
- **Mock USDC**: `0x976cdf7AdAd3E312a1307BD2f12B77c7c41A5bd9`
- **Mock LINK**: `0x782422446da0085C7d6887C5E6105bD9EA66d469`

## Network Configuration

The app supports these testnet chains:
- **Ethereum Sepolia** (EID: 40161)
- **Arbitrum Sepolia** (EID: 40231) - Primary marketplace hub
- **Base Sepolia** (EID: 40245)

## Usage Flow

### Testing Token Management
1. Connect your wallet using Dynamic Labs widget
2. Navigate to "Manage Mock Tokens" tab
3. Mint tokens to your address for testing
4. View token balances in real-time
5. Test cross-chain sends with compose messages

### Testing Marketplace Features
1. Go to "Auction" tab
2. **Manage**: Add mock tokens as trusted OFTs
3. **Create Order**: Use the form to understand order parameters
4. **Orders**: View and interact with market orders
5. Place bids or execute instant buys

### Understanding the System
1. Read the "How It Works" tab for comprehensive overview
2. Understand the LayerZero V2 compose message flow
3. Learn about cross-chain settlement via CCTP

## Mock Data Notes

- Order creation is simulated for demonstration purposes
- Real implementation would use OFT `send()` with compose messages
- Local storage tracks user-created order IDs
- Sample orders are provided for interaction testing

## Key Components

```
components/
├── tabs/
│   ├── HowItWorks.tsx        # Educational content
│   ├── ManageTokens.tsx      # Token minting and management
│   └── Auction.tsx           # Marketplace interactions
└── ui/                       # Shadcn/ui components
```

## Testing Checklist

- [ ] Wallet connection works across all supported chains
- [ ] Token minting (single and batch) functions properly
- [ ] Cross-chain send simulation executes
- [ ] Marketplace management (trusted OFTs) works
- [ ] Order creation UI captures all parameters
- [ ] Bidding and instant buy interactions function
- [ ] Local storage persists order IDs
- [ ] Real-time balance updates display correctly

## Architecture Notes

This interface demonstrates the complete user flow for the cross-chain dust aggregator:

1. **Token Preparation**: Mint and manage OFT tokens across chains
2. **Order Creation**: Send OFT tokens with compose messages (auction parameters)
3. **Market Interaction**: Solvers bid on or instantly buy aggregated dust
4. **Settlement**: USDC proceeds sent to original seller's preferred chain

The actual order creation happens via LayerZero OFT compose messages, not through the UI form directly. The form shows what parameters would be encoded in the compose message.