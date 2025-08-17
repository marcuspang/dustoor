'use client'

import { useState } from 'react'
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt
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
import { Loader2, Plus, Coins, Send, Users } from 'lucide-react'
import { parseEther, formatEther, isAddress, type Address } from 'viem'
import { mockOftAbi } from '@/lib/generated'
import {
  MOCK_ARB_USDT_ADDRESS,
  MOCK_ARB_USDC_ADDRESS,
  MOCK_ARB_LINK_ADDRESS
} from '@/app/constants'
import Link from 'next/link'

const MOCK_TOKENS = [
  { address: MOCK_ARB_USDT_ADDRESS, symbol: 'USDT', name: 'USD Tether' },
  { address: MOCK_ARB_USDC_ADDRESS, symbol: 'USDC', name: 'USD Coin' },
  { address: MOCK_ARB_LINK_ADDRESS, symbol: 'LINK', name: 'Chainlink Token' }
]

function TokenBalance({
  tokenAddress,
  userAddress
}: {
  tokenAddress: string
  userAddress: string
}) {
  const { data: balance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: mockOftAbi,
    functionName: 'balanceOf',
    args: [userAddress as `0x${string}`]
  })

  const { data: symbol } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: mockOftAbi,
    functionName: 'symbol'
  })

  return (
    <div className="text-sm">
      Balance: {balance ? formatEther(balance) : '0'} {symbol}
    </div>
  )
}

function MintTokens({
  selectedToken,
  setSelectedToken
}: {
  selectedToken: string
  setSelectedToken: (token: string) => void
}) {
  const [batchRecipients, setBatchRecipients] = useState('')
  const [batchAmounts, setBatchAmounts] = useState('')

  const { address, chain } = useAccount()
  const [recipient, setRecipient] = useState(address)
  const [amount, setAmount] = useState('1.0')
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  const handleMint = () => {
    if (!recipient || !amount || !isAddress(recipient)) return

    writeContract({
      address: selectedToken as `0x${string}`,
      abi: mockOftAbi,
      functionName: 'mint',
      args: [recipient as `0x${string}`, parseEther(amount)]
    })
  }

  const handleBatchMint = () => {
    const recipients = batchRecipients
      .split('\n')
      .filter((addr) => addr.trim() && isAddress(addr.trim()))
    const amounts = batchAmounts
      .split('\n')
      .filter((amt) => amt.trim())
      .map((amt) => parseEther(amt.trim()))

    if (recipients.length !== amounts.length || recipients.length === 0) {
      alert('Recipients and amounts must have the same number of entries')
      return
    }

    writeContract({
      address: selectedToken as `0x${string}`,
      abi: mockOftAbi,
      functionName: 'batchMint',
      args: [recipients as `0x${string}`[], amounts]
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="w-5 h-5" />
          Mint Tokens
        </CardTitle>
        <CardDescription>
          Mint mock OFT tokens for testing purposes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single Mint</TabsTrigger>
            <TabsTrigger value="batch">Batch Mint</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token-select">Select Token</Label>
              <select
                id="token-select"
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
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
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value as Address)}
              />
              {address && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRecipient(address)}
                >
                  Use My Address
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (ETH units)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="1.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <Button
              onClick={handleMint}
              disabled={isPending || isConfirming || !recipient || !amount}
              className="w-full"
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isPending ? 'Minting...' : 'Confirming...'}
                </>
              ) : (
                'Mint Tokens'
              )}
            </Button>
          </TabsContent>

          <TabsContent value="batch" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token-select-batch">Select Token</Label>
              <select
                id="token-select-batch"
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {MOCK_TOKENS.map((token) => (
                  <option key={token.address} value={token.address}>
                    {token.symbol} - {token.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batch-recipients">
                  Recipients (one per line)
                </Label>
                <textarea
                  id="batch-recipients"
                  className="w-full p-2 border rounded-md h-32 text-sm font-mono"
                  placeholder="0x123...&#10;0x456...&#10;0x789..."
                  value={batchRecipients}
                  onChange={(e) => setBatchRecipients(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="batch-amounts">Amounts (one per line)</Label>
                <textarea
                  id="batch-amounts"
                  className="w-full p-2 border rounded-md h-32 text-sm font-mono"
                  placeholder="1.0&#10;2.5&#10;0.75"
                  value={batchAmounts}
                  onChange={(e) => setBatchAmounts(e.target.value)}
                />
              </div>
            </div>

            <Button
              onClick={handleBatchMint}
              disabled={
                isPending || isConfirming || !batchRecipients || !batchAmounts
              }
              className="w-full"
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isPending ? 'Batch Minting...' : 'Confirming...'}
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  Batch Mint Tokens
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>

        {hash && (
          <Alert className="mt-4">
            <AlertDescription className="break-all">
              Transaction submitted:{' '}
              <Link
                href={`${chain?.blockExplorers?.default.url}/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {hash}
              </Link>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

function TokenList({
  onTokenClick
}: {
  onTokenClick: (tokenAddress: string) => void
}) {
  const { address } = useAccount()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Mock Tokens</CardTitle>
        <CardDescription>
          OFT tokens available for testing on Arbitrum Sepolia
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {MOCK_TOKENS.map((token) => (
            <div
              key={token.address}
              className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onTokenClick(token.address)}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{token.symbol}</Badge>
                    <span className="font-medium">{token.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {token.address}
                  </p>
                </div>
              </div>

              {address && (
                <TokenBalance
                  tokenAddress={token.address}
                  userAddress={address}
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function CrossChainSend() {
  const [selectedToken, setSelectedToken] = useState(MOCK_TOKENS[0].address)
  const [destinationEid, setDestinationEid] = useState('40161') // Sepolia
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [composeMsg, setComposeMsg] = useState('')

  const { address } = useAccount()
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  const handleSend = () => {
    if (!recipient || !amount || !isAddress(recipient)) return

    // Create send parameters for OFT
    const sendParam = {
      dstEid: parseInt(destinationEid),
      to: `0x${'0'.repeat(24)}${recipient.slice(2)}`, // Convert address to bytes32
      amountLD: parseEther(amount),
      minAmountLD: parseEther((parseFloat(amount) * 0.95).toString()), // 5% slippage
      extraOptions: '0x',
      composeMsg: (composeMsg as `0x${string}`) || '0x',
      oftCmd: '0x'
    } as const

    const fee = {
      nativeFee: parseEther('0.01'), // Estimate 0.01 ETH for fees
      lzTokenFee: BigInt(0)
    }

    writeContract({
      address: selectedToken as `0x${string}`,
      abi: mockOftAbi,
      functionName: 'send',
      args: [sendParam, fee, address as `0x${string}`],
      value: parseEther('0.01')
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5" />
          Cross-Chain Send
        </CardTitle>
        <CardDescription>
          Test OFT cross-chain transfers with compose messages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="send-token">Select Token</Label>
          <select
            id="send-token"
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
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
          <Label htmlFor="destination-eid">Destination Chain</Label>
          <select
            id="destination-eid"
            value={destinationEid}
            onChange={(e) => setDestinationEid(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="40161">Ethereum Sepolia (40161)</option>
            <option value="40231">Arbitrum Sepolia (40231)</option>
            <option value="40245">Base Sepolia (40245)</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="send-recipient">Recipient Address</Label>
          <Input
            id="send-recipient"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          {address && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRecipient(address)}
            >
              Use My Address
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="send-amount">Amount</Label>
          <Input
            id="send-amount"
            type="number"
            placeholder="1.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="compose-msg">Compose Message (hex, optional)</Label>
          <Input
            id="compose-msg"
            placeholder="0x..."
            value={composeMsg}
            onChange={(e) => setComposeMsg(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            For marketplace integration, this would contain auction parameters
          </p>
        </div>

        <Button
          onClick={handleSend}
          disabled={isPending || isConfirming || !recipient || !amount}
          className="w-full"
        >
          {isPending || isConfirming ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isPending ? 'Sending...' : 'Confirming...'}
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Cross-Chain
            </>
          )}
        </Button>

        {hash && (
          <Alert className="mt-4">
            <AlertDescription>Transaction submitted: {hash}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

export function ManageTokens() {
  const { isConnected } = useAccount()
  const [selectedToken, setSelectedToken] = useState(MOCK_TOKENS[0].address)

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Please connect your wallet to manage tokens
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MintTokens
          selectedToken={selectedToken}
          setSelectedToken={setSelectedToken}
        />
        <TokenList onTokenClick={setSelectedToken} />
      </div>

      <Separator />

      <CrossChainSend />
    </div>
  )
}
