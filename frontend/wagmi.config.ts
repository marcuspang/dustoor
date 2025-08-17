import { defineConfig } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'
import { DustMarketplaceAbi } from '@/abi/DustMarketplace'
import { MockOFTAbi } from '@/abi/MockOFT'

export default defineConfig({
  out: 'lib/generated.ts',
  contracts: [
    {
      name: 'DustMarketplace',
      abi: DustMarketplaceAbi.abi
    },
    {
      name: 'MockOFT',
      abi: MockOFTAbi.abi
    }
  ],
  plugins: [react()]
})
