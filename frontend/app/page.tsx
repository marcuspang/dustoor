import { AccountInfo } from '@/components/AccountInfo'
import { HomeTabs } from '@/components/tabs/HomeTabs'
import { DynamicWidget } from '@dynamic-labs/sdk-react-core'
import { Suspense } from 'react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header with wallet connection */}
        <div className="flex flex-col items-center gap-6 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Cross-Chain Dust Aggregator
            </h1>
            <p className="text-xl text-muted-foreground mt-2">
              Test LayerZero V2 Compose & Marketplace Functionality
            </p>
          </div>

          {/* Dynamic Wallet Widget */}
          <DynamicWidget />

          {/* Account Info */}
          <AccountInfo />
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <HomeTabs />
        </Suspense>
      </div>
    </div>
  )
}
