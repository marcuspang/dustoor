'use client'

import { Auction } from '@/components/tabs/Auction'
import { HowItWorks } from '@/components/tabs/HowItWorks'
import { ManageTokens } from '@/components/tabs/ManageTokens'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQueryState } from 'nuqs'

export function HomeTabs() {
  const [activeTab, setActiveTab] = useQueryState('tab', {
    defaultValue: 'how-it-works'
  })
  return (
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
  )
}
