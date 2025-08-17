import {
  createUseReadContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
  createUseWriteContract
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DustMarketplace
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const dustMarketplaceAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_endpoint', internalType: 'address', type: 'address' },
      { name: '_owner', internalType: 'address', type: 'address' },
      { name: '_settlementToken', internalType: 'address', type: 'address' },
      { name: '_tokenMessenger', internalType: 'address', type: 'address' },
      { name: '_currentDomain', internalType: 'uint32', type: 'uint32' }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'origin',
        internalType: 'struct Origin',
        type: 'tuple',
        components: [
          { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
          { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' }
        ]
      }
    ],
    name: 'allowInitializePath',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'cctpConfig',
    outputs: [
      { name: '', internalType: 'contract CCTPConfig', type: 'address' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'currentDomain',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'endpoint',
    outputs: [
      {
        name: '',
        internalType: 'contract ILayerZeroEndpointV2',
        type: 'address'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'feeRecipient',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'orderId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'finalizeAuction',
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [{ name: 'orderId', internalType: 'bytes32', type: 'bytes32' }],
    name: 'instantBuy',
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [
      {
        name: '',
        internalType: 'struct Origin',
        type: 'tuple',
        components: [
          { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
          { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' }
        ]
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
      { name: '_sender', internalType: 'address', type: 'address' }
    ],
    name: 'isComposeMsgSender',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_oApp', internalType: 'address', type: 'address' },
      { name: '_guid', internalType: 'bytes32', type: 'bytes32' },
      { name: '_message', internalType: 'bytes', type: 'bytes' },
      { name: '_executor', internalType: 'address', type: 'address' },
      { name: '_extraData', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'lzCompose',
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_origin',
        internalType: 'struct Origin',
        type: 'tuple',
        components: [
          { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
          { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' }
        ]
      },
      { name: '_guid', internalType: 'bytes32', type: 'bytes32' },
      { name: '_message', internalType: 'bytes', type: 'bytes' },
      { name: '_executor', internalType: 'address', type: 'address' },
      { name: '_extraData', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'lzReceive',
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'marketOrders',
    outputs: [
      { name: 'orderId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'sourceEid', internalType: 'uint32', type: 'uint32' },
      { name: 'seller', internalType: 'address', type: 'address' },
      { name: 'minPrice', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'isAuction', internalType: 'bool', type: 'bool' },
      { name: 'isFilled', internalType: 'bool', type: 'bool' },
      { name: 'winner', internalType: 'address', type: 'address' },
      { name: 'winningBid', internalType: 'uint256', type: 'uint256' },
      { name: 'destinationEid', internalType: 'uint32', type: 'uint32' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint32', type: 'uint32' },
      { name: '', internalType: 'bytes32', type: 'bytes32' }
    ],
    name: 'nextNonce',
    outputs: [{ name: 'nonce', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'oAppVersion',
    outputs: [
      { name: 'senderVersion', internalType: 'uint64', type: 'uint64' },
      { name: 'receiverVersion', internalType: 'uint64', type: 'uint64' }
    ],
    stateMutability: 'pure'
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      { name: '', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'orderBids',
    outputs: [
      { name: 'bidder', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'timestamp', internalType: 'uint256', type: 'uint256' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'eid', internalType: 'uint32', type: 'uint32' }],
    name: 'peers',
    outputs: [{ name: 'peer', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'orderId', internalType: 'bytes32', type: 'bytes32' },
      { name: 'bidAmount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'placeBid',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'protocolFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_cctpConfig', internalType: 'address', type: 'address' }],
    name: 'setCCTPConfig',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_delegate', internalType: 'address', type: 'address' }],
    name: 'setDelegate',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_eid', internalType: 'uint32', type: 'uint32' },
      { name: '_peer', internalType: 'bytes32', type: 'bytes32' }
    ],
    name: 'setPeer',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokenMessenger', internalType: 'address', type: 'address' }
    ],
    name: 'setTokenMessenger',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'oft', internalType: 'address', type: 'address' },
      { name: 'trusted', internalType: 'bool', type: 'bool' }
    ],
    name: 'setTrustedOFT',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'settlementToken',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'tokenMessenger',
    outputs: [
      { name: '', internalType: 'contract ITokenMessenger', type: 'address' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'trustedOFTs',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'orderId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true
      },
      {
        name: 'bidder',
        internalType: 'address',
        type: 'address',
        indexed: false
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'BidPlaced'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'orderId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true
      },
      {
        name: 'buyer',
        internalType: 'address',
        type: 'address',
        indexed: false
      },
      {
        name: 'price',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'InstantBuyExecuted'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'orderId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true
      },
      {
        name: 'winner',
        internalType: 'address',
        type: 'address',
        indexed: false
      },
      {
        name: 'price',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'OrderFilled'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'orderId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true
      },
      {
        name: 'seller',
        internalType: 'address',
        type: 'address',
        indexed: false
      },
      {
        name: 'minPrice',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'OrderListed'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true
      }
    ],
    name: 'OwnershipTransferred'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'eid', internalType: 'uint32', type: 'uint32', indexed: false },
      {
        name: 'peer',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false
      }
    ],
    name: 'PeerSet'
  },
  { type: 'error', inputs: [], name: 'InvalidDelegate' },
  { type: 'error', inputs: [], name: 'InvalidEndpointCall' },
  { type: 'error', inputs: [], name: 'LzTokenUnavailable' },
  {
    type: 'error',
    inputs: [{ name: 'eid', internalType: 'uint32', type: 'uint32' }],
    name: 'NoPeer'
  },
  {
    type: 'error',
    inputs: [{ name: 'msgValue', internalType: 'uint256', type: 'uint256' }],
    name: 'NotEnoughNative'
  },
  {
    type: 'error',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'OnlyEndpoint'
  },
  {
    type: 'error',
    inputs: [
      { name: 'eid', internalType: 'uint32', type: 'uint32' },
      { name: 'sender', internalType: 'bytes32', type: 'bytes32' }
    ],
    name: 'OnlyPeer'
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner'
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount'
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MockOFT
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mockOftAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_symbol', internalType: 'string', type: 'string' },
      { name: 'decimals_', internalType: 'uint8', type: 'uint8' },
      { name: '_lzEndpoint', internalType: 'address', type: 'address' },
      { name: '_delegate', internalType: 'address', type: 'address' }
    ],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'SEND',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'SEND_AND_CALL',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'origin',
        internalType: 'struct Origin',
        type: 'tuple',
        components: [
          { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
          { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' }
        ]
      }
    ],
    name: 'allowInitializePath',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'approvalRequired',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure'
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'recipients', internalType: 'address[]', type: 'address[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' }
    ],
    name: 'batchMint',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_eid', internalType: 'uint32', type: 'uint32' },
      { name: '_msgType', internalType: 'uint16', type: 'uint16' },
      { name: '_extraOptions', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'combineOptions',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimalConversionRate',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'endpoint',
    outputs: [
      {
        name: '',
        internalType: 'contract ILayerZeroEndpointV2',
        type: 'address'
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'eid', internalType: 'uint32', type: 'uint32' },
      { name: 'msgType', internalType: 'uint16', type: 'uint16' }
    ],
    name: 'enforcedOptions',
    outputs: [{ name: 'enforcedOption', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      {
        name: '',
        internalType: 'struct Origin',
        type: 'tuple',
        components: [
          { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
          { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' }
        ]
      },
      { name: '', internalType: 'bytes', type: 'bytes' },
      { name: '_sender', internalType: 'address', type: 'address' }
    ],
    name: 'isComposeMsgSender',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_eid', internalType: 'uint32', type: 'uint32' },
      { name: '_peer', internalType: 'bytes32', type: 'bytes32' }
    ],
    name: 'isPeer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_origin',
        internalType: 'struct Origin',
        type: 'tuple',
        components: [
          { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
          { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' }
        ]
      },
      { name: '_guid', internalType: 'bytes32', type: 'bytes32' },
      { name: '_message', internalType: 'bytes', type: 'bytes' },
      { name: '_executor', internalType: 'address', type: 'address' },
      { name: '_extraData', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'lzReceive',
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_packets',
        internalType: 'struct InboundPacket[]',
        type: 'tuple[]',
        components: [
          {
            name: 'origin',
            internalType: 'struct Origin',
            type: 'tuple',
            components: [
              { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
              { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
              { name: 'nonce', internalType: 'uint64', type: 'uint64' }
            ]
          },
          { name: 'dstEid', internalType: 'uint32', type: 'uint32' },
          { name: 'receiver', internalType: 'address', type: 'address' },
          { name: 'guid', internalType: 'bytes32', type: 'bytes32' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'executor', internalType: 'address', type: 'address' },
          { name: 'message', internalType: 'bytes', type: 'bytes' },
          { name: 'extraData', internalType: 'bytes', type: 'bytes' }
        ]
      }
    ],
    name: 'lzReceiveAndRevert',
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_origin',
        internalType: 'struct Origin',
        type: 'tuple',
        components: [
          { name: 'srcEid', internalType: 'uint32', type: 'uint32' },
          { name: 'sender', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' }
        ]
      },
      { name: '_guid', internalType: 'bytes32', type: 'bytes32' },
      { name: '_message', internalType: 'bytes', type: 'bytes' },
      { name: '_executor', internalType: 'address', type: 'address' },
      { name: '_extraData', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'lzReceiveSimulate',
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'msgInspector',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint32', type: 'uint32' },
      { name: '', internalType: 'bytes32', type: 'bytes32' }
    ],
    name: 'nextNonce',
    outputs: [{ name: 'nonce', internalType: 'uint64', type: 'uint64' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'oApp',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'oAppVersion',
    outputs: [
      { name: 'senderVersion', internalType: 'uint64', type: 'uint64' },
      { name: 'receiverVersion', internalType: 'uint64', type: 'uint64' }
    ],
    stateMutability: 'pure'
  },
  {
    type: 'function',
    inputs: [],
    name: 'oftVersion',
    outputs: [
      { name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' },
      { name: 'version', internalType: 'uint64', type: 'uint64' }
    ],
    stateMutability: 'pure'
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'eid', internalType: 'uint32', type: 'uint32' }],
    name: 'peers',
    outputs: [{ name: 'peer', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'preCrime',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_sendParam',
        internalType: 'struct SendParam',
        type: 'tuple',
        components: [
          { name: 'dstEid', internalType: 'uint32', type: 'uint32' },
          { name: 'to', internalType: 'bytes32', type: 'bytes32' },
          { name: 'amountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'extraOptions', internalType: 'bytes', type: 'bytes' },
          { name: 'composeMsg', internalType: 'bytes', type: 'bytes' },
          { name: 'oftCmd', internalType: 'bytes', type: 'bytes' }
        ]
      }
    ],
    name: 'quoteOFT',
    outputs: [
      {
        name: 'oftLimit',
        internalType: 'struct OFTLimit',
        type: 'tuple',
        components: [
          { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'maxAmountLD', internalType: 'uint256', type: 'uint256' }
        ]
      },
      {
        name: 'oftFeeDetails',
        internalType: 'struct OFTFeeDetail[]',
        type: 'tuple[]',
        components: [
          { name: 'feeAmountLD', internalType: 'int256', type: 'int256' },
          { name: 'description', internalType: 'string', type: 'string' }
        ]
      },
      {
        name: 'oftReceipt',
        internalType: 'struct OFTReceipt',
        type: 'tuple',
        components: [
          { name: 'amountSentLD', internalType: 'uint256', type: 'uint256' },
          {
            name: 'amountReceivedLD',
            internalType: 'uint256',
            type: 'uint256'
          }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_sendParam',
        internalType: 'struct SendParam',
        type: 'tuple',
        components: [
          { name: 'dstEid', internalType: 'uint32', type: 'uint32' },
          { name: 'to', internalType: 'bytes32', type: 'bytes32' },
          { name: 'amountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'extraOptions', internalType: 'bytes', type: 'bytes' },
          { name: 'composeMsg', internalType: 'bytes', type: 'bytes' },
          { name: 'oftCmd', internalType: 'bytes', type: 'bytes' }
        ]
      },
      { name: '_payInLzToken', internalType: 'bool', type: 'bool' }
    ],
    name: 'quoteSend',
    outputs: [
      {
        name: 'msgFee',
        internalType: 'struct MessagingFee',
        type: 'tuple',
        components: [
          { name: 'nativeFee', internalType: 'uint256', type: 'uint256' },
          { name: 'lzTokenFee', internalType: 'uint256', type: 'uint256' }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_sendParam',
        internalType: 'struct SendParam',
        type: 'tuple',
        components: [
          { name: 'dstEid', internalType: 'uint32', type: 'uint32' },
          { name: 'to', internalType: 'bytes32', type: 'bytes32' },
          { name: 'amountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' },
          { name: 'extraOptions', internalType: 'bytes', type: 'bytes' },
          { name: 'composeMsg', internalType: 'bytes', type: 'bytes' },
          { name: 'oftCmd', internalType: 'bytes', type: 'bytes' }
        ]
      },
      {
        name: '_fee',
        internalType: 'struct MessagingFee',
        type: 'tuple',
        components: [
          { name: 'nativeFee', internalType: 'uint256', type: 'uint256' },
          { name: 'lzTokenFee', internalType: 'uint256', type: 'uint256' }
        ]
      },
      { name: '_refundAddress', internalType: 'address', type: 'address' }
    ],
    name: 'send',
    outputs: [
      {
        name: 'msgReceipt',
        internalType: 'struct MessagingReceipt',
        type: 'tuple',
        components: [
          { name: 'guid', internalType: 'bytes32', type: 'bytes32' },
          { name: 'nonce', internalType: 'uint64', type: 'uint64' },
          {
            name: 'fee',
            internalType: 'struct MessagingFee',
            type: 'tuple',
            components: [
              { name: 'nativeFee', internalType: 'uint256', type: 'uint256' },
              { name: 'lzTokenFee', internalType: 'uint256', type: 'uint256' }
            ]
          }
        ]
      },
      {
        name: 'oftReceipt',
        internalType: 'struct OFTReceipt',
        type: 'tuple',
        components: [
          { name: 'amountSentLD', internalType: 'uint256', type: 'uint256' },
          {
            name: 'amountReceivedLD',
            internalType: 'uint256',
            type: 'uint256'
          }
        ]
      }
    ],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [{ name: '_delegate', internalType: 'address', type: 'address' }],
    name: 'setDelegate',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_enforcedOptions',
        internalType: 'struct EnforcedOptionParam[]',
        type: 'tuple[]',
        components: [
          { name: 'eid', internalType: 'uint32', type: 'uint32' },
          { name: 'msgType', internalType: 'uint16', type: 'uint16' },
          { name: 'options', internalType: 'bytes', type: 'bytes' }
        ]
      }
    ],
    name: 'setEnforcedOptions',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_msgInspector', internalType: 'address', type: 'address' }
    ],
    name: 'setMsgInspector',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_eid', internalType: 'uint32', type: 'uint32' },
      { name: '_peer', internalType: 'bytes32', type: 'bytes32' }
    ],
    name: 'setPeer',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_preCrime', internalType: 'address', type: 'address' }],
    name: 'setPreCrime',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'sharedDecimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'token',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Approval'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_enforcedOptions',
        internalType: 'struct EnforcedOptionParam[]',
        type: 'tuple[]',
        components: [
          { name: 'eid', internalType: 'uint32', type: 'uint32' },
          { name: 'msgType', internalType: 'uint16', type: 'uint16' },
          { name: 'options', internalType: 'bytes', type: 'bytes' }
        ],
        indexed: false
      }
    ],
    name: 'EnforcedOptionSet'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'inspector',
        internalType: 'address',
        type: 'address',
        indexed: false
      }
    ],
    name: 'MsgInspectorSet'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'guid', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'srcEid',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false
      },
      {
        name: 'toAddress',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'amountReceivedLD',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'OFTReceived'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'guid', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'dstEid',
        internalType: 'uint32',
        type: 'uint32',
        indexed: false
      },
      {
        name: 'fromAddress',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'amountSentLD',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'amountReceivedLD',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'OFTSent'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true
      }
    ],
    name: 'OwnershipTransferred'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'eid', internalType: 'uint32', type: 'uint32', indexed: false },
      {
        name: 'peer',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false
      }
    ],
    name: 'PeerSet'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'preCrimeAddress',
        internalType: 'address',
        type: 'address',
        indexed: false
      }
    ],
    name: 'PreCrimeSet'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Transfer'
  },
  {
    type: 'error',
    inputs: [{ name: 'amountSD', internalType: 'uint256', type: 'uint256' }],
    name: 'AmountSDOverflowed'
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'ERC20InsufficientAllowance'
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'ERC20InsufficientBalance'
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover'
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver'
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender'
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender'
  },
  { type: 'error', inputs: [], name: 'InvalidDelegate' },
  { type: 'error', inputs: [], name: 'InvalidEndpointCall' },
  { type: 'error', inputs: [], name: 'InvalidLocalDecimals' },
  {
    type: 'error',
    inputs: [{ name: 'options', internalType: 'bytes', type: 'bytes' }],
    name: 'InvalidOptions'
  },
  { type: 'error', inputs: [], name: 'LzTokenUnavailable' },
  {
    type: 'error',
    inputs: [{ name: 'eid', internalType: 'uint32', type: 'uint32' }],
    name: 'NoPeer'
  },
  {
    type: 'error',
    inputs: [{ name: 'msgValue', internalType: 'uint256', type: 'uint256' }],
    name: 'NotEnoughNative'
  },
  {
    type: 'error',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'OnlyEndpoint'
  },
  {
    type: 'error',
    inputs: [
      { name: 'eid', internalType: 'uint32', type: 'uint32' },
      { name: 'sender', internalType: 'bytes32', type: 'bytes32' }
    ],
    name: 'OnlyPeer'
  },
  { type: 'error', inputs: [], name: 'OnlySelf' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner'
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount'
  },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation'
  },
  {
    type: 'error',
    inputs: [{ name: 'result', internalType: 'bytes', type: 'bytes' }],
    name: 'SimulationResult'
  },
  {
    type: 'error',
    inputs: [
      { name: 'amountLD', internalType: 'uint256', type: 'uint256' },
      { name: 'minAmountLD', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'SlippageExceeded'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dustMarketplaceAbi}__
 */
export const useReadDustMarketplace = /*#__PURE__*/ createUseReadContract({
  abi: dustMarketplaceAbi
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"allowInitializePath"`
 */
export const useReadDustMarketplaceAllowInitializePath =
  /*#__PURE__*/ createUseReadContract({
    abi: dustMarketplaceAbi,
    functionName: 'allowInitializePath'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"cctpConfig"`
 */
export const useReadDustMarketplaceCctpConfig =
  /*#__PURE__*/ createUseReadContract({
    abi: dustMarketplaceAbi,
    functionName: 'cctpConfig'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"currentDomain"`
 */
export const useReadDustMarketplaceCurrentDomain =
  /*#__PURE__*/ createUseReadContract({
    abi: dustMarketplaceAbi,
    functionName: 'currentDomain'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"endpoint"`
 */
export const useReadDustMarketplaceEndpoint =
  /*#__PURE__*/ createUseReadContract({
    abi: dustMarketplaceAbi,
    functionName: 'endpoint'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"feeRecipient"`
 */
export const useReadDustMarketplaceFeeRecipient =
  /*#__PURE__*/ createUseReadContract({
    abi: dustMarketplaceAbi,
    functionName: 'feeRecipient'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"isComposeMsgSender"`
 */
export const useReadDustMarketplaceIsComposeMsgSender =
  /*#__PURE__*/ createUseReadContract({
    abi: dustMarketplaceAbi,
    functionName: 'isComposeMsgSender'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"marketOrders"`
 */
export const useReadDustMarketplaceMarketOrders =
  /*#__PURE__*/ createUseReadContract({
    abi: dustMarketplaceAbi,
    functionName: 'marketOrders'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"nextNonce"`
 */
export const useReadDustMarketplaceNextNonce =
  /*#__PURE__*/ createUseReadContract({
    abi: dustMarketplaceAbi,
    functionName: 'nextNonce'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"oAppVersion"`
 */
export const useReadDustMarketplaceOAppVersion =
  /*#__PURE__*/ createUseReadContract({
    abi: dustMarketplaceAbi,
    functionName: 'oAppVersion'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"orderBids"`
 */
export const useReadDustMarketplaceOrderBids =
  /*#__PURE__*/ createUseReadContract({
    abi: dustMarketplaceAbi,
    functionName: 'orderBids'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"owner"`
 */
export const useReadDustMarketplaceOwner = /*#__PURE__*/ createUseReadContract({
  abi: dustMarketplaceAbi,
  functionName: 'owner'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"peers"`
 */
export const useReadDustMarketplacePeers = /*#__PURE__*/ createUseReadContract({
  abi: dustMarketplaceAbi,
  functionName: 'peers'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"protocolFee"`
 */
export const useReadDustMarketplaceProtocolFee =
  /*#__PURE__*/ createUseReadContract({
    abi: dustMarketplaceAbi,
    functionName: 'protocolFee'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"settlementToken"`
 */
export const useReadDustMarketplaceSettlementToken =
  /*#__PURE__*/ createUseReadContract({
    abi: dustMarketplaceAbi,
    functionName: 'settlementToken'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"tokenMessenger"`
 */
export const useReadDustMarketplaceTokenMessenger =
  /*#__PURE__*/ createUseReadContract({
    abi: dustMarketplaceAbi,
    functionName: 'tokenMessenger'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"trustedOFTs"`
 */
export const useReadDustMarketplaceTrustedOfTs =
  /*#__PURE__*/ createUseReadContract({
    abi: dustMarketplaceAbi,
    functionName: 'trustedOFTs'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dustMarketplaceAbi}__
 */
export const useWriteDustMarketplace = /*#__PURE__*/ createUseWriteContract({
  abi: dustMarketplaceAbi
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"finalizeAuction"`
 */
export const useWriteDustMarketplaceFinalizeAuction =
  /*#__PURE__*/ createUseWriteContract({
    abi: dustMarketplaceAbi,
    functionName: 'finalizeAuction'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"instantBuy"`
 */
export const useWriteDustMarketplaceInstantBuy =
  /*#__PURE__*/ createUseWriteContract({
    abi: dustMarketplaceAbi,
    functionName: 'instantBuy'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"lzCompose"`
 */
export const useWriteDustMarketplaceLzCompose =
  /*#__PURE__*/ createUseWriteContract({
    abi: dustMarketplaceAbi,
    functionName: 'lzCompose'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"lzReceive"`
 */
export const useWriteDustMarketplaceLzReceive =
  /*#__PURE__*/ createUseWriteContract({
    abi: dustMarketplaceAbi,
    functionName: 'lzReceive'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"placeBid"`
 */
export const useWriteDustMarketplacePlaceBid =
  /*#__PURE__*/ createUseWriteContract({
    abi: dustMarketplaceAbi,
    functionName: 'placeBid'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteDustMarketplaceRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: dustMarketplaceAbi,
    functionName: 'renounceOwnership'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"setCCTPConfig"`
 */
export const useWriteDustMarketplaceSetCctpConfig =
  /*#__PURE__*/ createUseWriteContract({
    abi: dustMarketplaceAbi,
    functionName: 'setCCTPConfig'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"setDelegate"`
 */
export const useWriteDustMarketplaceSetDelegate =
  /*#__PURE__*/ createUseWriteContract({
    abi: dustMarketplaceAbi,
    functionName: 'setDelegate'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"setPeer"`
 */
export const useWriteDustMarketplaceSetPeer =
  /*#__PURE__*/ createUseWriteContract({
    abi: dustMarketplaceAbi,
    functionName: 'setPeer'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"setTokenMessenger"`
 */
export const useWriteDustMarketplaceSetTokenMessenger =
  /*#__PURE__*/ createUseWriteContract({
    abi: dustMarketplaceAbi,
    functionName: 'setTokenMessenger'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"setTrustedOFT"`
 */
export const useWriteDustMarketplaceSetTrustedOft =
  /*#__PURE__*/ createUseWriteContract({
    abi: dustMarketplaceAbi,
    functionName: 'setTrustedOFT'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteDustMarketplaceTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: dustMarketplaceAbi,
    functionName: 'transferOwnership'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dustMarketplaceAbi}__
 */
export const useSimulateDustMarketplace =
  /*#__PURE__*/ createUseSimulateContract({ abi: dustMarketplaceAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"finalizeAuction"`
 */
export const useSimulateDustMarketplaceFinalizeAuction =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dustMarketplaceAbi,
    functionName: 'finalizeAuction'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"instantBuy"`
 */
export const useSimulateDustMarketplaceInstantBuy =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dustMarketplaceAbi,
    functionName: 'instantBuy'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"lzCompose"`
 */
export const useSimulateDustMarketplaceLzCompose =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dustMarketplaceAbi,
    functionName: 'lzCompose'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"lzReceive"`
 */
export const useSimulateDustMarketplaceLzReceive =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dustMarketplaceAbi,
    functionName: 'lzReceive'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"placeBid"`
 */
export const useSimulateDustMarketplacePlaceBid =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dustMarketplaceAbi,
    functionName: 'placeBid'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateDustMarketplaceRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dustMarketplaceAbi,
    functionName: 'renounceOwnership'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"setCCTPConfig"`
 */
export const useSimulateDustMarketplaceSetCctpConfig =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dustMarketplaceAbi,
    functionName: 'setCCTPConfig'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"setDelegate"`
 */
export const useSimulateDustMarketplaceSetDelegate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dustMarketplaceAbi,
    functionName: 'setDelegate'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"setPeer"`
 */
export const useSimulateDustMarketplaceSetPeer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dustMarketplaceAbi,
    functionName: 'setPeer'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"setTokenMessenger"`
 */
export const useSimulateDustMarketplaceSetTokenMessenger =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dustMarketplaceAbi,
    functionName: 'setTokenMessenger'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"setTrustedOFT"`
 */
export const useSimulateDustMarketplaceSetTrustedOft =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dustMarketplaceAbi,
    functionName: 'setTrustedOFT'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateDustMarketplaceTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: dustMarketplaceAbi,
    functionName: 'transferOwnership'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dustMarketplaceAbi}__
 */
export const useWatchDustMarketplaceEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: dustMarketplaceAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `eventName` set to `"BidPlaced"`
 */
export const useWatchDustMarketplaceBidPlacedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: dustMarketplaceAbi,
    eventName: 'BidPlaced'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `eventName` set to `"InstantBuyExecuted"`
 */
export const useWatchDustMarketplaceInstantBuyExecutedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: dustMarketplaceAbi,
    eventName: 'InstantBuyExecuted'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `eventName` set to `"OrderFilled"`
 */
export const useWatchDustMarketplaceOrderFilledEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: dustMarketplaceAbi,
    eventName: 'OrderFilled'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `eventName` set to `"OrderListed"`
 */
export const useWatchDustMarketplaceOrderListedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: dustMarketplaceAbi,
    eventName: 'OrderListed'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchDustMarketplaceOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: dustMarketplaceAbi,
    eventName: 'OwnershipTransferred'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link dustMarketplaceAbi}__ and `eventName` set to `"PeerSet"`
 */
export const useWatchDustMarketplacePeerSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: dustMarketplaceAbi,
    eventName: 'PeerSet'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__
 */
export const useReadMockOft = /*#__PURE__*/ createUseReadContract({
  abi: mockOftAbi
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"SEND"`
 */
export const useReadMockOftSend = /*#__PURE__*/ createUseReadContract({
  abi: mockOftAbi,
  functionName: 'SEND'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"SEND_AND_CALL"`
 */
export const useReadMockOftSendAndCall = /*#__PURE__*/ createUseReadContract({
  abi: mockOftAbi,
  functionName: 'SEND_AND_CALL'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"allowInitializePath"`
 */
export const useReadMockOftAllowInitializePath =
  /*#__PURE__*/ createUseReadContract({
    abi: mockOftAbi,
    functionName: 'allowInitializePath'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadMockOftAllowance = /*#__PURE__*/ createUseReadContract({
  abi: mockOftAbi,
  functionName: 'allowance'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"approvalRequired"`
 */
export const useReadMockOftApprovalRequired =
  /*#__PURE__*/ createUseReadContract({
    abi: mockOftAbi,
    functionName: 'approvalRequired'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadMockOftBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: mockOftAbi,
  functionName: 'balanceOf'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"combineOptions"`
 */
export const useReadMockOftCombineOptions = /*#__PURE__*/ createUseReadContract(
  { abi: mockOftAbi, functionName: 'combineOptions' }
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"decimalConversionRate"`
 */
export const useReadMockOftDecimalConversionRate =
  /*#__PURE__*/ createUseReadContract({
    abi: mockOftAbi,
    functionName: 'decimalConversionRate'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadMockOftDecimals = /*#__PURE__*/ createUseReadContract({
  abi: mockOftAbi,
  functionName: 'decimals'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"endpoint"`
 */
export const useReadMockOftEndpoint = /*#__PURE__*/ createUseReadContract({
  abi: mockOftAbi,
  functionName: 'endpoint'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"enforcedOptions"`
 */
export const useReadMockOftEnforcedOptions =
  /*#__PURE__*/ createUseReadContract({
    abi: mockOftAbi,
    functionName: 'enforcedOptions'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"isComposeMsgSender"`
 */
export const useReadMockOftIsComposeMsgSender =
  /*#__PURE__*/ createUseReadContract({
    abi: mockOftAbi,
    functionName: 'isComposeMsgSender'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"isPeer"`
 */
export const useReadMockOftIsPeer = /*#__PURE__*/ createUseReadContract({
  abi: mockOftAbi,
  functionName: 'isPeer'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"msgInspector"`
 */
export const useReadMockOftMsgInspector = /*#__PURE__*/ createUseReadContract({
  abi: mockOftAbi,
  functionName: 'msgInspector'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"name"`
 */
export const useReadMockOftName = /*#__PURE__*/ createUseReadContract({
  abi: mockOftAbi,
  functionName: 'name'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"nextNonce"`
 */
export const useReadMockOftNextNonce = /*#__PURE__*/ createUseReadContract({
  abi: mockOftAbi,
  functionName: 'nextNonce'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"oApp"`
 */
export const useReadMockOftOApp = /*#__PURE__*/ createUseReadContract({
  abi: mockOftAbi,
  functionName: 'oApp'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"oAppVersion"`
 */
export const useReadMockOftOAppVersion = /*#__PURE__*/ createUseReadContract({
  abi: mockOftAbi,
  functionName: 'oAppVersion'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"oftVersion"`
 */
export const useReadMockOftOftVersion = /*#__PURE__*/ createUseReadContract({
  abi: mockOftAbi,
  functionName: 'oftVersion'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"owner"`
 */
export const useReadMockOftOwner = /*#__PURE__*/ createUseReadContract({
  abi: mockOftAbi,
  functionName: 'owner'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"peers"`
 */
export const useReadMockOftPeers = /*#__PURE__*/ createUseReadContract({
  abi: mockOftAbi,
  functionName: 'peers'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"preCrime"`
 */
export const useReadMockOftPreCrime = /*#__PURE__*/ createUseReadContract({
  abi: mockOftAbi,
  functionName: 'preCrime'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"quoteOFT"`
 */
export const useReadMockOftQuoteOft = /*#__PURE__*/ createUseReadContract({
  abi: mockOftAbi,
  functionName: 'quoteOFT'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"quoteSend"`
 */
export const useReadMockOftQuoteSend = /*#__PURE__*/ createUseReadContract({
  abi: mockOftAbi,
  functionName: 'quoteSend'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"sharedDecimals"`
 */
export const useReadMockOftSharedDecimals = /*#__PURE__*/ createUseReadContract(
  { abi: mockOftAbi, functionName: 'sharedDecimals' }
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadMockOftSymbol = /*#__PURE__*/ createUseReadContract({
  abi: mockOftAbi,
  functionName: 'symbol'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"token"`
 */
export const useReadMockOftToken = /*#__PURE__*/ createUseReadContract({
  abi: mockOftAbi,
  functionName: 'token'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadMockOftTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: mockOftAbi,
  functionName: 'totalSupply'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockOftAbi}__
 */
export const useWriteMockOft = /*#__PURE__*/ createUseWriteContract({
  abi: mockOftAbi
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteMockOftApprove = /*#__PURE__*/ createUseWriteContract({
  abi: mockOftAbi,
  functionName: 'approve'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"batchMint"`
 */
export const useWriteMockOftBatchMint = /*#__PURE__*/ createUseWriteContract({
  abi: mockOftAbi,
  functionName: 'batchMint'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"lzReceive"`
 */
export const useWriteMockOftLzReceive = /*#__PURE__*/ createUseWriteContract({
  abi: mockOftAbi,
  functionName: 'lzReceive'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"lzReceiveAndRevert"`
 */
export const useWriteMockOftLzReceiveAndRevert =
  /*#__PURE__*/ createUseWriteContract({
    abi: mockOftAbi,
    functionName: 'lzReceiveAndRevert'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"lzReceiveSimulate"`
 */
export const useWriteMockOftLzReceiveSimulate =
  /*#__PURE__*/ createUseWriteContract({
    abi: mockOftAbi,
    functionName: 'lzReceiveSimulate'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteMockOftMint = /*#__PURE__*/ createUseWriteContract({
  abi: mockOftAbi,
  functionName: 'mint'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteMockOftRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: mockOftAbi,
    functionName: 'renounceOwnership'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"send"`
 */
export const useWriteMockOftSend = /*#__PURE__*/ createUseWriteContract({
  abi: mockOftAbi,
  functionName: 'send'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"setDelegate"`
 */
export const useWriteMockOftSetDelegate = /*#__PURE__*/ createUseWriteContract({
  abi: mockOftAbi,
  functionName: 'setDelegate'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"setEnforcedOptions"`
 */
export const useWriteMockOftSetEnforcedOptions =
  /*#__PURE__*/ createUseWriteContract({
    abi: mockOftAbi,
    functionName: 'setEnforcedOptions'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"setMsgInspector"`
 */
export const useWriteMockOftSetMsgInspector =
  /*#__PURE__*/ createUseWriteContract({
    abi: mockOftAbi,
    functionName: 'setMsgInspector'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"setPeer"`
 */
export const useWriteMockOftSetPeer = /*#__PURE__*/ createUseWriteContract({
  abi: mockOftAbi,
  functionName: 'setPeer'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"setPreCrime"`
 */
export const useWriteMockOftSetPreCrime = /*#__PURE__*/ createUseWriteContract({
  abi: mockOftAbi,
  functionName: 'setPreCrime'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteMockOftTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: mockOftAbi,
  functionName: 'transfer'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteMockOftTransferFrom = /*#__PURE__*/ createUseWriteContract(
  { abi: mockOftAbi, functionName: 'transferFrom' }
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteMockOftTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: mockOftAbi,
    functionName: 'transferOwnership'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockOftAbi}__
 */
export const useSimulateMockOft = /*#__PURE__*/ createUseSimulateContract({
  abi: mockOftAbi
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateMockOftApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockOftAbi,
    functionName: 'approve'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"batchMint"`
 */
export const useSimulateMockOftBatchMint =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockOftAbi,
    functionName: 'batchMint'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"lzReceive"`
 */
export const useSimulateMockOftLzReceive =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockOftAbi,
    functionName: 'lzReceive'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"lzReceiveAndRevert"`
 */
export const useSimulateMockOftLzReceiveAndRevert =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockOftAbi,
    functionName: 'lzReceiveAndRevert'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"lzReceiveSimulate"`
 */
export const useSimulateMockOftLzReceiveSimulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockOftAbi,
    functionName: 'lzReceiveSimulate'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateMockOftMint = /*#__PURE__*/ createUseSimulateContract({
  abi: mockOftAbi,
  functionName: 'mint'
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateMockOftRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockOftAbi,
    functionName: 'renounceOwnership'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"send"`
 */
export const useSimulateMockOftSend = /*#__PURE__*/ createUseSimulateContract({
  abi: mockOftAbi,
  functionName: 'send'
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"setDelegate"`
 */
export const useSimulateMockOftSetDelegate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockOftAbi,
    functionName: 'setDelegate'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"setEnforcedOptions"`
 */
export const useSimulateMockOftSetEnforcedOptions =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockOftAbi,
    functionName: 'setEnforcedOptions'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"setMsgInspector"`
 */
export const useSimulateMockOftSetMsgInspector =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockOftAbi,
    functionName: 'setMsgInspector'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"setPeer"`
 */
export const useSimulateMockOftSetPeer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockOftAbi,
    functionName: 'setPeer'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"setPreCrime"`
 */
export const useSimulateMockOftSetPreCrime =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockOftAbi,
    functionName: 'setPreCrime'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateMockOftTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockOftAbi,
    functionName: 'transfer'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateMockOftTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockOftAbi,
    functionName: 'transferFrom'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mockOftAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateMockOftTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mockOftAbi,
    functionName: 'transferOwnership'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockOftAbi}__
 */
export const useWatchMockOftEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: mockOftAbi
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockOftAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchMockOftApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mockOftAbi,
    eventName: 'Approval'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockOftAbi}__ and `eventName` set to `"EnforcedOptionSet"`
 */
export const useWatchMockOftEnforcedOptionSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mockOftAbi,
    eventName: 'EnforcedOptionSet'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockOftAbi}__ and `eventName` set to `"MsgInspectorSet"`
 */
export const useWatchMockOftMsgInspectorSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mockOftAbi,
    eventName: 'MsgInspectorSet'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockOftAbi}__ and `eventName` set to `"OFTReceived"`
 */
export const useWatchMockOftOftReceivedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mockOftAbi,
    eventName: 'OFTReceived'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockOftAbi}__ and `eventName` set to `"OFTSent"`
 */
export const useWatchMockOftOftSentEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mockOftAbi,
    eventName: 'OFTSent'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockOftAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchMockOftOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mockOftAbi,
    eventName: 'OwnershipTransferred'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockOftAbi}__ and `eventName` set to `"PeerSet"`
 */
export const useWatchMockOftPeerSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mockOftAbi,
    eventName: 'PeerSet'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockOftAbi}__ and `eventName` set to `"PreCrimeSet"`
 */
export const useWatchMockOftPreCrimeSetEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mockOftAbi,
    eventName: 'PreCrimeSet'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mockOftAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchMockOftTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mockOftAbi,
    eventName: 'Transfer'
  })
