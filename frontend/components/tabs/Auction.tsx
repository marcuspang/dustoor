'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Loader2, Settings, ShoppingCart, Gavel, Eye, Plus, Check, X } from 'lucide-react'
import { parseEther, formatEther, isAddress, keccak256, encodePacked } from 'viem'
import { dustMarketplaceAbi } from '@/lib/generated'
import { MARKETPLACE_ADDRESS, MOCK_ARB_USDT_ADDRESS, MOCK_ARB_USDC_ADDRESS, MOCK_ARB_LINK_ADDRESS } from '@/app/constants'

const MOCK_TOKENS = [
  { address: MOCK_ARB_USDT_ADDRESS, symbol: 'USDT', name: 'USD Tether' },
  { address: MOCK_ARB_USDC_ADDRESS, symbol: 'USDC', name: 'USD Coin' },
  { address: MOCK_ARB_LINK_ADDRESS, symbol: 'LINK', name: 'Chainlink Token' },
]

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

function ManageMarketplace() {
  const [oftAddress, setOftAddress] = useState('')
  const [isTrusted, setIsTrusted] = useState(true)

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  const handleSetTrustedOFT = () => {
    if (!oftAddress || !isAddress(oftAddress)) return

    writeContract({
      address: MARKETPLACE_ADDRESS as `0x${string}`,
      abi: dustMarketplaceAbi,
      functionName: 'setTrustedOFT',
      args: [oftAddress as `0x${string}`, isTrusted],
    })
  }

  const addMockToken = (tokenAddress: string) => {
    writeContract({
      address: MARKETPLACE_ADDRESS as `0x${string}`,
      abi: dustMarketplaceAbi,
      functionName: 'setTrustedOFT',
      args: [tokenAddress as `0x${string}`, true],
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Manage Marketplace
        </CardTitle>
        <CardDescription>
          Configure trusted OFT tokens and marketplace settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium">Add/Remove Trusted OFT</h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="oft-address">OFT Token Address</Label>
              <Input
                id="oft-address"
                placeholder="0x..."
                value={oftAddress}
                onChange={(e) => setOftAddress(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="trusted-toggle"
                checked={isTrusted}
                onCheckedChange={setIsTrusted}
              />
              <Label htmlFor="trusted-toggle">
                {isTrusted ? 'Add as trusted' : 'Remove from trusted'}
              </Label>
            </div>

            <Button 
              onClick={handleSetTrustedOFT} 
              disabled={isPending || isConfirming || !oftAddress}
              className="w-full"
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isPending ? 'Setting...' : 'Confirming...'}
                </>
              ) : (
                `${isTrusted ? 'Add' : 'Remove'} Trusted OFT`
              )}
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium">Quick Add Mock Tokens</h4>
          <div className="space-y-2">
            {MOCK_TOKENS.map((token) => (
              <div key={token.address} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Badge variant="secondary" className="mr-2">{token.symbol}</Badge>
                  <span className="text-sm">{token.name}</span>
                  <p className="text-xs text-muted-foreground">{token.address}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => addMockToken(token.address)}
                  disabled={isPending || isConfirming}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            ))}
          </div>
        </div>

        {hash && (
          <Alert>
            <AlertDescription>
              Transaction submitted: {hash}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

function CreateOrder() {
  const [tokenAddress, setTokenAddress] = useState(MOCK_TOKENS[0].address)
  const [amount, setAmount] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [deadline, setDeadline] = useState('')
  const [isAuction, setIsAuction] = useState(false)
  const [destinationEid, setDestinationEid] = useState('40231') // Arbitrum Sepolia

  const { address } = useAccount()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  const handleCreateOrder = () => {
    if (!amount || !minPrice || !deadline) return

    // Create a mock order ID for demonstration
    const mockOrderId = keccak256(
      encodePacked(
        ['address', 'uint256', 'uint256'],
        [address as `0x${string}`, BigInt(Date.now()), parseEther(amount)]
      )
    )

    // Add to local storage for tracking
    addOrderId(mockOrderId)

    // Note: In a real implementation, you'd create the order through the OFT send with compose
    alert(`Mock order created with ID: ${mockOrderId}\nIn practice, this would be done via OFT send with compose message.`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Create Market Order
        </CardTitle>
        <CardDescription>
          Create new auction or instant buy orders (via OFT compose)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="order-token">Token</Label>
          <select
            id="order-token"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            {MOCK_TOKENS.map((token) => (
              <option key={token.address} value={token.address}>
                {token.symbol} - {token.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="order-amount">Token Amount</Label>
          <Input
            id="order-amount"
            type="number"
            placeholder="1.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

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

        <div className="space-y-2">
          <Label htmlFor="destination-chain">Settlement Chain</Label>
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
            {isAuction ? 'Auction Order' : 'Instant Buy Order'}
          </Label>
        </div>

        <Button 
          onClick={handleCreateOrder} 
          disabled={isPending || isConfirming || !amount || !minPrice || !deadline}
          className="w-full"
        >
          {isPending || isConfirming ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            `Create ${isAuction ? 'Auction' : 'Instant Buy'} Order`
          )}
        </Button>

        <Alert>
          <AlertDescription>
            <strong>Note:</strong> In practice, orders are created by sending OFT tokens with compose messages containing these parameters.
            This form demonstrates the UI - the actual creation would use the "Manage Mock Tokens" → "Cross-Chain Send" functionality.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

function OrderList() {
  const [orderIds] = useState(getStoredOrderIds())
  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [bidAmount, setBidAmount] = useState('')

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  // Read order data (mock implementation)
  const { data: orderData } = useReadContract({
    address: MARKETPLACE_ADDRESS as `0x${string}`,
    abi: dustMarketplaceAbi,
    functionName: 'marketOrders',
    args: [selectedOrderId as `0x${string}`],
    enabled: !!selectedOrderId,
  })

  const handleInstantBuy = (orderId: string) => {
    writeContract({
      address: MARKETPLACE_ADDRESS as `0x${string}`,
      abi: dustMarketplaceAbi,
      functionName: 'instantBuy',
      args: [orderId as `0x${string}`],
      value: parseEther('0.01'), // Mock payment
    })
  }

  const handlePlaceBid = () => {
    if (!selectedOrderId || !bidAmount) return

    writeContract({
      address: MARKETPLACE_ADDRESS as `0x${string}`,
      abi: dustMarketplaceAbi,
      functionName: 'placeBid',
      args: [selectedOrderId as `0x${string}`, parseEther(bidAmount)],
    })
  }

  const handleFinalizeAuction = (orderId: string) => {
    writeContract({
      address: MARKETPLACE_ADDRESS as `0x${string}`,
      abi: dustMarketplaceAbi,
      functionName: 'finalizeAuction',
      args: [orderId as `0x${string}`],
      value: parseEther('0.01'), // Mock payment
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Market Orders
        </CardTitle>
        <CardDescription>
          View and interact with existing market orders
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {orderIds.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No orders created yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create orders using the form above or by sending OFT tokens with compose messages
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="font-medium">Your Created Orders</h4>
            <div className="space-y-3">
              {orderIds.map((orderId) => (
                <div key={orderId} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-mono text-sm">{orderId}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">Mock Order</Badge>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedOrderId(orderId)}
                      >
                        <Gavel className="w-4 h-4 mr-1" />
                        Bid
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleInstantBuy(orderId)}
                        disabled={isPending || isConfirming}
                      >
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Buy
                      </Button>
                    </div>
                  </div>
                  
                  {selectedOrderId === orderId && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Bid amount (USDC)"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                        />
                        <Button
                          onClick={handlePlaceBid}
                          disabled={isPending || isConfirming || !bidAmount}
                        >
                          {isPending || isConfirming ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Place Bid'
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium">Mock Real-Time Orders</h4>
          <div className="space-y-3">
            {/* Mock orders for demonstration */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">USDT</Badge>
                    <span className="font-medium">1000 USDT</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Min: 950 USDC • Deadline: 2h</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Auction</Badge>
                  <Button size="sm" variant="outline">
                    <Gavel className="w-4 h-4 mr-1" />
                    Bid
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">LINK</Badge>
                    <span className="font-medium">50 LINK</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Price: 850 USDC • Instant Buy</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Instant</Badge>
                  <Button size="sm">
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {hash && (
          <Alert>
            <AlertDescription>
              Transaction submitted: {hash}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

export function Auction() {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Please connect your wallet to access marketplace features</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="create">Create Order</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6">
          <OrderList />
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <CreateOrder />
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <ManageMarketplace />
        </TabsContent>
      </Tabs>
    </div>
  )
}