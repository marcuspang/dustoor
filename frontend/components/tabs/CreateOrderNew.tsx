'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, ShoppingCart, Trash2 } from 'lucide-react'
import { parseEther, formatEther, keccak256, encodePacked, encodeAbiParameters, parseAbiParameters } from 'viem'
import { mockOftAbi, useReadMockOftQuoteSend } from '@/lib/generated'
import { MARKETPLACE_ADDRESS, MOCK_ARB_USDT_ADDRESS, MOCK_ARB_USDC_ADDRESS, MOCK_ARB_LINK_ADDRESS } from '@/app/constants'
import Link from 'next/link'

const MOCK_TOKENS = [
  { address: MOCK_ARB_USDT_ADDRESS, symbol: 'USDT', name: 'USD Tether' },
  { address: MOCK_ARB_USDC_ADDRESS, symbol: 'USDC', name: 'USD Coin' },
  { address: MOCK_ARB_LINK_ADDRESS, symbol: 'LINK', name: 'Chainlink Token' },
]

interface TokenSelection {
  address: string
  symbol: string
  name: string
  amount: string
}

// Local storage helpers
const getStoredOrderIds = (): string[] => {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem('dustMarketplace_orderIds')
  return stored ? JSON.parse(stored) : []
}

const addOrderId = (orderId: string) => {
  if (typeof window === 'undefined') return
  const existing = getStoredOrderIds()
  if (!existing.includes(orderId)) {
    const updated = [...existing, orderId]
    localStorage.setItem('dustMarketplace_orderIds', JSON.stringify(updated))
  }
}

export function CreateOrderNew() {
  const [selectedTokens, setSelectedTokens] = useState<TokenSelection[]>([])
  const [minPrice, setMinPrice] = useState('')
  const [deadline, setDeadline] = useState('24')
  const [isAuction, setIsAuction] = useState(false)
  const [destinationEid, setDestinationEid] = useState('40231') // Arbitrum Sepolia

  const { address, chain, chainId } = useAccount()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  // Add token to selection
  const addToken = (token: typeof MOCK_TOKENS[0]) => {
    if (selectedTokens.find(t => t.address === token.address)) return
    setSelectedTokens(prev => [...prev, { ...token, amount: '1.0' }])
  }

  // Remove token from selection
  const removeToken = (address: string) => {
    setSelectedTokens(prev => prev.filter(t => t.address !== address))
  }

  // Update token amount
  const updateTokenAmount = (address: string, amount: string) => {
    setSelectedTokens(prev =>
      prev.map(t => t.address === address ? { ...t, amount } : t)
    )
  }

  const generateComposeMessage = () => {
    const deadlineTimestamp = Math.floor(Date.now() / 1000) + (parseInt(deadline) * 3600) // hours to seconds

    // Encode compose message for the marketplace contract
    // The marketplace expects: (uint256 minPrice, uint256 deadline, bool isAuction, uint32 destinationEid)
    return encodeAbiParameters(
      parseAbiParameters('uint256, uint256, bool, uint32'),
      [
        parseEther(minPrice || '0'),
        BigInt(deadlineTimestamp),
        isAuction,
        parseInt(destinationEid),
      ]
    )
  }

  // Calculate total estimated value
  const getTotalValue = () => {
    return selectedTokens.reduce((total, token) => {
      return total + parseFloat(token.amount || '0')
    }, 0)
  }

  // Get fee quote for the OFT send operation
  const quoteSendQuery = useReadMockOftQuoteSend({
    address: selectedTokens[0]?.address as `0x${string}`,
    account: address,
    chainId,
    args: selectedTokens.length > 0 && minPrice && deadline && selectedTokens[0]?.amount ? [
      {
        dstEid: parseInt(destinationEid),
        to: MARKETPLACE_ADDRESS,
        amountLD: parseEther(selectedTokens[0].amount),
        minAmountLD: parseEther(((parseFloat(selectedTokens[0].amount) * 0.95)).toString()),
        extraOptions: '0x' as `0x${string}`,
        composeMsg: generateComposeMessage(),
        oftCmd: '0x' as `0x${string}`
      },
      false // payInLzToken
    ] : undefined,
    query: {
      enabled: selectedTokens.length > 0 &&
              !!minPrice &&
              !!deadline &&
              parseFloat(selectedTokens[0]?.amount || '0') > 0
    }
  })

  const handleCreateOrder = async () => {
    if (selectedTokens.length === 0 || !minPrice || !deadline || !quoteSendQuery.data) return

    try {
      // For now, we'll send from the first selected token as the primary OFT
      // In a real implementation, you might aggregate all tokens first
      const primaryToken = selectedTokens[0]
      const deadlineTimestamp = Math.floor(Date.now() / 1000) + (parseInt(deadline) * 3600)

      const composeMsg = generateComposeMessage()

      // Create execution options for compose messages (lzReceive + lzCompose)
      // Based on OFT guide: need gas for both token transfer and compose execution
      // Starting with empty options to test basic functionality
      const extraOptions = '0x' as `0x${string}`

      // Create send parameters for OFT
      const sendParam = {
        dstEid: parseInt(destinationEid),
        to: MARKETPLACE_ADDRESS as `0x${string}`, // Marketplace contract address as bytes32
        amountLD: parseEther(primaryToken.amount),
        minAmountLD: parseEther((parseFloat(primaryToken.amount) * 0.95).toString()), // 5% slippage
        extraOptions: extraOptions, // Execution options for compose
        composeMsg: composeMsg,
        oftCmd: '0x' as `0x${string}`
      }

      // Use quoted fees from the contract
      const fee = {
        nativeFee: quoteSendQuery.data.nativeFee,
        lzTokenFee: quoteSendQuery.data.lzTokenFee
      }

      // Execute the OFT send with compose message
      writeContract({
        address: primaryToken.address as `0x${string}`,
        abi: mockOftAbi,
        functionName: 'send',
        args: [sendParam, fee, address as `0x${string}`],
        value: fee.nativeFee // Pay the native fee
      })

      // Store order details locally for tracking
      const orderDetails = {
        tokens: selectedTokens,
        minPrice,
        deadline: deadlineTimestamp,
        isAuction,
        destinationEid,
        composeMsg,
        timestamp: Date.now()
      }

      // Add to local storage for tracking
      const orderId = keccak256(encodePacked(['string'], [JSON.stringify(orderDetails)]))
      addOrderId(orderId)

    } catch (error) {
      console.error('Error creating order:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Create Market Order with OFT Compose
        </CardTitle>
        <CardDescription>
          Select multiple tokens and create orders via LayerZero compose messages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Token Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Select Tokens to Include</Label>
            <Badge variant="outline">{selectedTokens.length} tokens selected</Badge>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {MOCK_TOKENS.map((token) => {
              const isSelected = selectedTokens.find(t => t.address === token.address)
              return (
                <div key={token.address} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    checked={!!isSelected}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        addToken(token)
                      } else {
                        removeToken(token.address)
                      }
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{token.symbol}</Badge>
                      <span className="font-medium">{token.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{token.address}</p>
                  </div>
                  {isSelected && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={isSelected.amount}
                        onChange={(e) => updateTokenAmount(token.address, e.target.value)}
                        className="w-24"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeToken(token.address)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {selectedTokens.length > 0 && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Selected Tokens Summary:</p>
              <div className="space-y-1">
                {selectedTokens.map((token) => (
                  <p key={token.address} className="text-xs">
                    {token.amount} {token.symbol} ({token.name})
                  </p>
                ))}
                <p className="text-sm font-medium">
                  Total Value: ~{getTotalValue().toFixed(2)} tokens
                </p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Order Parameters */}
        <div className="space-y-4">
          <Label>Order Configuration</Label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-price">Minimum Price (USDC)</Label>
              <Input
                id="min-price"
                type="number"
                placeholder="100.0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline (hours from now)</Label>
              <Input
                id="deadline"
                type="number"
                placeholder="24"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination-chain">Settlement Chain (for USDC proceeds)</Label>
            <select
              id="destination-chain"
              value={destinationEid}
              onChange={(e) => setDestinationEid(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="40161">Ethereum Sepolia (40161)</option>
              <option value="40231">Arbitrum Sepolia (40231)</option>
              <option value="40245">Base Sepolia (40245)</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="auction-toggle"
              checked={isAuction}
              onCheckedChange={setIsAuction}
            />
            <Label htmlFor="auction-toggle">
              {isAuction ? 'Auction Order (accept bids)' : 'Instant Buy Order (fixed price)'}
            </Label>
          </div>
        </div>

        <Separator />

        {/* Fee Estimation */}
        {quoteSendQuery.data && (
          <div className="space-y-2">
            <Label>Transaction Fee Estimate</Label>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">
                Native Fee: {formatEther(quoteSendQuery.data.nativeFee)} ETH
              </p>
              {quoteSendQuery.data.lzTokenFee > BigInt(0) && (
                <p className="text-sm">
                  LZ Token Fee: {formatEther(quoteSendQuery.data.lzTokenFee)} LZ
                </p>
              )}
            </div>
          </div>
        )}

        {/* Query Status Debug */}
        {quoteSendQuery.isError && (
          <Alert>
            <AlertDescription>
              Error fetching fees: {quoteSendQuery.error?.message || 'Unknown error'}
            </AlertDescription>
          </Alert>
        )}

        {quoteSendQuery.isPending && selectedTokens.length > 0 && minPrice && deadline && selectedTokens[0]?.amount && (
          <Alert>
            <AlertDescription>
              Fetching transaction fees...
            </AlertDescription>
          </Alert>
        )}

        {/* Compose Message Preview */}
        {selectedTokens.length > 0 && minPrice && deadline && (
          <div className="space-y-2">
            <Label>LayerZero Compose Message Preview</Label>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs font-mono break-all">
                {generateComposeMessage()}
              </p>
              <div className="mt-2 text-xs text-muted-foreground">
                <p>Parameters encoded: recipient={address?.slice(0,6)}...{address?.slice(-4)}, minPrice={minPrice} USDC, deadline={deadline}h, isAuction={isAuction ? 'true' : 'false'}, destinationEid={destinationEid}, additionalTokens={selectedTokens.length - 1}</p>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={handleCreateOrder}
          disabled={isPending || isConfirming || selectedTokens.length === 0 || !minPrice || !deadline || !quoteSendQuery.data || quoteSendQuery.isPending}
          className="w-full"
        >
          {isPending || isConfirming ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isPending ? 'Sending OFT...' : 'Confirming...'}
            </>
          ) : (
            `Send ${selectedTokens.length > 0 ? selectedTokens[0].symbol : ''} with Compose Message`
          )}
        </Button>

        {hash && (
          <Alert>
            <AlertDescription className="break-all">
              Order creation transaction: <Link href={`${chain?.blockExplorers?.default.url}/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{hash}</Link>
            </AlertDescription>
          </Alert>
        )}

        <Alert>
          <AlertDescription>
            <strong>How it works:</strong> The first selected token will be sent to the marketplace with a LayerZero compose message containing auction parameters. The marketplace will automatically create an order when it receives the tokens and compose data.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}