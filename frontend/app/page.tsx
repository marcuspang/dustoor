'use client'

import { DynamicWidget } from '@dynamic-labs/sdk-react-core'
import { useAccount } from 'wagmi'
import { useQueryState } from 'nuqs'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { HowItWorks } from '@/components/tabs/HowItWorks'
import { ManageTokens } from '@/components/tabs/ManageTokens'
import { Auction } from '@/components/tabs/Auction'

function AccountInfo() {
  const { address, isConnected, chain } = useAccount()

  if (!isConnected) return null

  return (
    <Card className="mb-6 w-full">
      <CardHeader>
        <CardTitle>Account Status</CardTitle>
        <CardDescription>
          <div className="space-y-1 text-sm">
            <p>Connected: {isConnected ? 'true' : 'false'}</p>
            <p>Address: {address}</p>
            <p>Network: {chain?.name} (ID: {chain?.id})</p>
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

export default function Home() {
  const [activeTab, setActiveTab] = useQueryState('tab', {
    defaultValue: 'how-it-works'
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header with wallet connection */}
        <div className="flex flex-col items-center gap-6 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">Cross-Chain Dust Aggregator</h1>
            <p className="text-xl text-muted-foreground mt-2">
              Test LayerZero V2 Compose & Marketplace Functionality
            </p>
          </div>

          {/* Dynamic Wallet Widget */}
          <DynamicWidget />

          {/* Account Info */}
          <AccountInfo />
        </div>

        {/* Main Tabs Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
            <TabsTrigger value="manage-tokens">Manage Mock Tokens</TabsTrigger>
            <TabsTrigger value="auction">Auction</TabsTrigger>
          </TabsList>

          <TabsContent value="how-it-works" className="mt-6">
            <HowItWorks />
          </TabsContent>

          <TabsContent value="manage-tokens" className="mt-6">
            <ManageTokens />
          </TabsContent>

          <TabsContent value="auction" className="mt-6">
            <Auction />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}