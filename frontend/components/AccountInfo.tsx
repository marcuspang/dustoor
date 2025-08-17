'use client'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useAccount } from 'wagmi'

export function AccountInfo() {
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
            <p>
              Network: {chain?.name} (ID: {chain?.id})
            </p>
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
