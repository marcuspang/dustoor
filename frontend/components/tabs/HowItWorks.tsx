import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowDown, ArrowRight, Coins, Network, Zap } from 'lucide-react'

export function HowItWorks() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            Cross-Chain Dust Aggregator Overview
          </CardTitle>
          <CardDescription>
            A LayerZero V2 powered solution for aggregating small token amounts across multiple chains
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This application demonstrates how to use LayerZero's Omnichain Fungible Tokens (OFT) and Compose
            functionality to aggregate "dust" tokens across multiple chains and sell them efficiently through
            an intent-based marketplace.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Coins className="w-5 h-5" />
              What is Dust?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              "Dust" refers to small token amounts (typically &lt; $50) scattered across different blockchain
              networks. These small amounts are often not worth the gas fees to move individually.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5" />
              OFT Technology
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Omnichain Fungible Tokens (OFT) enable seamless token transfers across chains using
              LayerZero's messaging protocol, with built-in compose functionality for complex operations.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How the System Works</CardTitle>
          <CardDescription>Step-by-step process flow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <Badge variant="outline" className="mt-1">1</Badge>
              <div className="flex-1">
                <h4 className="font-medium">OFT Token Transfer with Compose Message</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  User sends OFT tokens from source chain to marketplace with embedded compose message
                  containing auction parameters (minimum price, deadline, auction type, destination chain).
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowDown   className="w-4 h-4 text-muted-foreground" />
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <Badge variant="outline" className="mt-1">2</Badge>
              <div className="flex-1">
                <h4 className="font-medium">LayerZero Message Delivery</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  LayerZero endpoint delivers the tokens and calls lzCompose() on the DustMarketplace contract,
                  automatically creating an auction from the compose message data.
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowDown className="w-4 h-4 text-muted-foreground" />
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <Badge variant="outline" className="mt-1">3</Badge>
              <div className="flex-1">
                <h4 className="font-medium">Order Execution</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Solvers can either execute instant buys or place bids on auction orders. Winning solver
                  receives the dust tokens that are already on the marketplace chain.
                </p>
              </div>
            </div>

            <div className="flex justify-center">
                  <ArrowDown className="w-4 h-4 text-muted-foreground" />
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-4">
              <Badge variant="outline" className="mt-1">4</Badge>
              <div className="flex-1">
                <h4 className="font-medium">Cross-Chain Settlement</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  USDC proceeds are sent to the original seller either directly (same chain) or via
                  Cross-Chain Transfer Protocol (CCTP) for cross-chain settlement.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Supported Testnet Chains</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Badge variant="secondary">Ethereum Sepolia</Badge>
              <p className="text-xs text-muted-foreground">EID: 40161 - Source chain for dust collection</p>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary">Arbitrum Sepolia</Badge>
              <p className="text-xs text-muted-foreground">EID: 40231 - Marketplace hub with USDC liquidity</p>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary">Base Sepolia</Badge>
              <p className="text-xs text-muted-foreground">EID: 40245 - Source chain for dust collection</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Badge variant="outline" className="w-2 h-2 rounded-full p-0" />
              <span>Aggregate small amounts across multiple chains in a single transaction</span>
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="outline" className="w-2 h-2 rounded-full p-0" />
              <span>Automatic auction creation via LayerZero compose messages</span>
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="outline" className="w-2 h-2 rounded-full p-0" />
              <span>Flexible settlement on user's preferred chain</span>
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="outline" className="w-2 h-2 rounded-full p-0" />
              <span>Gas-optimized for Layer 2 networks</span>
            </li>
            <li className="flex items-center gap-2">
              <Badge variant="outline" className="w-2 h-2 rounded-full p-0" />
              <span>Intent-based marketplace for better price discovery</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}