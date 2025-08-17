'use client'

import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '../config'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

const environmentId = process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID!
if (!environmentId) {
  throw new Error('NEXT_PUBLIC_DYNAMIC_ENV_ID is not set')
}

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId,
        walletConnectors: [EthereumWalletConnectors]
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <NuqsAdapter>{children}</NuqsAdapter>
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  )
}
