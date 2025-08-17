'use client'

import { useState } from 'react'
import { useQueryState } from 'nuqs'
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent
} from 'wagmi'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Loader2, Settings, Gavel, Eye, Plus, ShoppingCart } from 'lucide-react'
import { parseEther, formatEther, isAddress } from 'viem'
import { dustMarketplaceAbi } from '@/lib/generated'
import {
  MARKETPLACE_ADDRESS,
  MOCK_ARB_USDT_ADDRESS,
  MOCK_ARB_USDC_ADDRESS,
  MOCK_ARB_LINK_ADDRESS,
  RECENT_BLOCK
} from '@/app/constants'
import { CreateOrderNew } from './CreateOrderNew'

const MOCK_TOKENS = [
  { address: MOCK_ARB_USDT_ADDRESS, symbol: 'USDT', name: 'USD Tether' },
  { address: MOCK_ARB_USDC_ADDRESS, symbol: 'USDC', name: 'USD Coin' },
  { address: MOCK_ARB_LINK_ADDRESS, symbol: 'LINK', name: 'Chainlink Token' }
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
      args: [oftAddress as `0x${string}`, isTrusted]
    })
  }

  const addMockToken = (tokenAddress: string) => {
    writeContract({
      address: MARKETPLACE_ADDRESS as `0x${string}`,
      abi: dustMarketplaceAbi,
      functionName: 'setTrustedOFT',
      args: [tokenAddress as `0x${string}`, true]
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
              <div
                key={token.address}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <Badge variant="secondary" className="mr-2">
                    {token.symbol}
                  </Badge>
                  <span className="text-sm">{token.name}</span>
                  <p className="text-xs text-muted-foreground">
                    {token.address}
                  </p>
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
            <AlertDescription>Transaction submitted: {hash}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

function OrderList() {
  const [orderIds] = useState(getStoredOrderIds())
  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [bidAmount, setBidAmount] = useState('')
  const [listedOrders, setListedOrders] = useState<any[]>([])
  const [filledOrders, setFilledOrders] = useState<Set<string>>(new Set())
  const [orderBids, setOrderBids] = useState<Map<string, any[]>>(new Map())

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  // Read order data for selected order
  const { data: orderData } = useReadContract({
    address: MARKETPLACE_ADDRESS as `0x${string}`,
    abi: dustMarketplaceAbi,
    functionName: 'marketOrders',
    args: [selectedOrderId as `0x${string}`],
    query: {
      enabled: !!selectedOrderId
    }
  })

  useWatchContractEvent({
    address: MARKETPLACE_ADDRESS as `0x${string}`,
    abi: dustMarketplaceAbi,
    eventName: 'OrderListed',
    onLogs(logs) {
      const newOrders = logs.map((log) => ({
        orderId: log.args.orderId,
        seller: log.args.seller,
        minPrice: log.args.minPrice,
        blockNumber: log.blockNumber,
        transactionHash: log.transactionHash,
        status: 'active'
      }))
      setListedOrders((prev) => [...prev, ...newOrders])
    },
    fromBlock: BigInt(RECENT_BLOCK)
  })

  useWatchContractEvent({
    address: MARKETPLACE_ADDRESS as `0x${string}`,
    abi: dustMarketplaceAbi,
    eventName: 'BidPlaced',
    onLogs(logs) {
      logs.forEach((log) => {
        const orderId = log.args.orderId as string
        const bid = {
          bidder: log.args.bidder,
          amount: log.args.amount,
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash
        }
        setOrderBids((prev) => {
          const newMap = new Map(prev)
          const existingBids = newMap.get(orderId) || []
          newMap.set(orderId, [...existingBids, bid])
          return newMap
        })
      })
    },
    fromBlock: BigInt(RECENT_BLOCK)
  })

  // Watch for InstantBuyExecuted events
  useWatchContractEvent({
    address: MARKETPLACE_ADDRESS as `0x${string}`,
    abi: dustMarketplaceAbi,
    eventName: 'InstantBuyExecuted',
    onLogs(logs) {
      logs.forEach((log) => {
        const orderId = log.args.orderId as string
        setFilledOrders((prev) => new Set([...prev, orderId]))
        setListedOrders((prev) =>
          prev.map((order) =>
            order.orderId === orderId
              ? {
                  ...order,
                  status: 'filled',
                  buyer: log.args.buyer,
                  price: log.args.price
                }
              : order
          )
        )
      })
    },
    fromBlock: BigInt(RECENT_BLOCK)
  })

  useWatchContractEvent({
    address: MARKETPLACE_ADDRESS as `0x${string}`,
    abi: dustMarketplaceAbi,
    eventName: 'OrderFilled',
    onLogs(logs) {
      logs.forEach((log) => {
        const orderId = log.args.orderId as string
        setFilledOrders((prev) => new Set([...prev, orderId]))
        setListedOrders((prev) =>
          prev.map((order) =>
            order.orderId === orderId
              ? {
                  ...order,
                  status: 'filled',
                  winner: log.args.winner,
                  winningPrice: log.args.price
                }
              : order
          )
        )
      })
    },
    fromBlock: BigInt(RECENT_BLOCK)
  })

  const handleInstantBuy = (orderId: string) => {
    writeContract({
      address: MARKETPLACE_ADDRESS as `0x${string}`,
      abi: dustMarketplaceAbi,
      functionName: 'instantBuy',
      args: [orderId as `0x${string}`],
      value: parseEther('0.01') // Mock payment
    })
  }

  const handlePlaceBid = () => {
    if (!selectedOrderId || !bidAmount) return

    writeContract({
      address: MARKETPLACE_ADDRESS as `0x${string}`,
      abi: dustMarketplaceAbi,
      functionName: 'placeBid',
      args: [selectedOrderId as `0x${string}`, parseEther(bidAmount)]
    })
  }

  const handleFinalizeAuction = (orderId: string) => {
    writeContract({
      address: MARKETPLACE_ADDRESS as `0x${string}`,
      abi: dustMarketplaceAbi,
      functionName: 'finalizeAuction',
      args: [orderId as `0x${string}`],
      value: parseEther('0.01') // Mock payment
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
              Create orders using the form above or by sending OFT tokens with
              compose messages
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
          <div className="flex items-center justify-between">
            <h4 className="font-medium">
              Real-Time Market Orders (from Events)
            </h4>
            <Badge variant="outline">{listedOrders.length} orders found</Badge>
          </div>

          {listedOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No orders found in recent blocks
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Orders will appear here when created via OFT compose messages
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {listedOrders.slice(0, 10).map((order) => {
                const bids = orderBids.get(order.orderId) || []
                const latestBid = bids[bids.length - 1]
                const isFilled = order.status === 'filled'

                return (
                  <div key={order.orderId} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant={isFilled ? 'destructive' : 'secondary'}
                          >
                            {isFilled ? 'Filled' : 'Active'}
                          </Badge>
                          <span className="font-mono text-xs text-muted-foreground">
                            {order.orderId?.slice(0, 10)}...
                          </span>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm">
                            <strong>Seller:</strong> {order.seller?.slice(0, 6)}
                            ...{order.seller?.slice(-4)}
                          </p>
                          <p className="text-sm">
                            <strong>Min Price:</strong>{' '}
                            {order.minPrice ? formatEther(order.minPrice) : '0'}{' '}
                            USDC
                          </p>
                          {latestBid && (
                            <p className="text-sm text-green-600">
                              <strong>Latest Bid:</strong>{' '}
                              {formatEther(latestBid.amount)} USDC by{' '}
                              {latestBid.bidder?.slice(0, 6)}...
                            </p>
                          )}
                          {isFilled && order.buyer && (
                            <p className="text-sm text-blue-600">
                              <strong>Sold to:</strong>{' '}
                              {order.buyer?.slice(0, 6)}... for{' '}
                              {order.price ? formatEther(order.price) : '0'}{' '}
                              USDC
                            </p>
                          )}
                          {isFilled && order.winner && (
                            <p className="text-sm text-blue-600">
                              <strong>Won by:</strong>{' '}
                              {order.winner?.slice(0, 6)}... for{' '}
                              {order.winningPrice
                                ? formatEther(order.winningPrice)
                                : '0'}{' '}
                              USDC
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Block: {order.blockNumber?.toString()} • Tx:{' '}
                            {order.transactionHash?.slice(0, 10)}...
                          </p>
                        </div>
                      </div>

                      {!isFilled && (
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedOrderId(order.orderId)}
                          >
                            <Gavel className="w-4 h-4 mr-1" />
                            Bid
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleInstantBuy(order.orderId)}
                            disabled={isPending || isConfirming}
                          >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Buy
                          </Button>
                        </div>
                      )}
                    </div>

                    {selectedOrderId === order.orderId && !isFilled && (
                      <div className="mt-4 p-3 bg-muted rounded-md">
                        <div className="space-y-2">
                          {bids.length > 0 && (
                            <div className="text-sm">
                              <p className="font-medium mb-1">Bid History:</p>
                              {bids.slice(-3).map((bid, idx) => (
                                <p
                                  key={idx}
                                  className="text-xs text-muted-foreground"
                                >
                                  {formatEther(bid.amount)} USDC by{' '}
                                  {bid.bidder?.slice(0, 6)}...
                                </p>
                              ))}
                            </div>
                          )}
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
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {hash && (
          <Alert>
            <AlertDescription>Transaction submitted: {hash}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

export function Auction() {
  const { isConnected } = useAccount()
  const [auctionTab, setAuctionTab] = useQueryState('auctionTab', {
    defaultValue: 'orders'
  })

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Please connect your wallet to access marketplace features
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={auctionTab} onValueChange={setAuctionTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="create">Create Order</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6">
          <OrderList />
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <CreateOrderNew />
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <ManageMarketplace />
        </TabsContent>
      </Tabs>
    </div>
  )
}
