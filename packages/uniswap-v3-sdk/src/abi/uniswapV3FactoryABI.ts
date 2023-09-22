export const uniswapV3FactoryABI = [
  { stateMutability: "nonpayable", type: "constructor", inputs: [] },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "fee", internalType: "uint24", type: "uint24", indexed: true },
      {
        name: "tickSpacing",
        internalType: "int24",
        type: "int24",
        indexed: true,
      },
    ],
    name: "FeeAmountEnabled",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "oldOwner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "newOwner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
    ],
    name: "OwnerChanged",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "token0",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "token1",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      { name: "fee", internalType: "uint24", type: "uint24", indexed: true },
      {
        name: "tickSpacing",
        internalType: "int24",
        type: "int24",
        indexed: false,
      },
      {
        name: "pool",
        internalType: "address",
        type: "address",
        indexed: false,
      },
    ],
    name: "PoolCreated",
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "tokenA", internalType: "address", type: "address" },
      { name: "tokenB", internalType: "address", type: "address" },
      { name: "fee", internalType: "uint24", type: "uint24" },
    ],
    name: "createPool",
    outputs: [{ name: "pool", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "fee", internalType: "uint24", type: "uint24" },
      { name: "tickSpacing", internalType: "int24", type: "int24" },
    ],
    name: "enableFeeAmount",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "", internalType: "uint24", type: "uint24" }],
    name: "feeAmountTickSpacing",
    outputs: [{ name: "", internalType: "int24", type: "int24" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "", internalType: "address", type: "address" },
      { name: "", internalType: "address", type: "address" },
      { name: "", internalType: "uint24", type: "uint24" },
    ],
    name: "getPool",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "owner",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "parameters",
    outputs: [
      { name: "factory", internalType: "address", type: "address" },
      { name: "token0", internalType: "address", type: "address" },
      { name: "token1", internalType: "address", type: "address" },
      { name: "fee", internalType: "uint24", type: "uint24" },
      { name: "tickSpacing", internalType: "int24", type: "int24" },
    ],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [{ name: "_owner", internalType: "address", type: "address" }],
    name: "setOwner",
    outputs: [],
  },
] as const;
