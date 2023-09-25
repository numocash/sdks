export const panopticPoolABI = [
  {
    inputs: [
      {
        internalType: "contract SemiFungiblePositionManager",
        name: "_sfpm",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "BurnedTokenIdNotLastIndex",
    type: "error",
  },
  {
    inputs: [],
    name: "CastingError",
    type: "error",
  },
  {
    inputs: [],
    name: "EffectiveLiquidityAboveThreshold",
    type: "error",
  },
  {
    inputs: [],
    name: "InputListFail",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientCollateralDecrease",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidNotionalValue",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "parameterType",
        type: "uint256",
      },
    ],
    name: "InvalidTokenIdParameter",
    type: "error",
  },
  {
    inputs: [],
    name: "NoLegsExercisable",
    type: "error",
  },
  {
    inputs: [],
    name: "NotATokenRoll",
    type: "error",
  },
  {
    inputs: [],
    name: "NotEnoughCollateral",
    type: "error",
  },
  {
    inputs: [],
    name: "OptionsNotOTM",
    type: "error",
  },
  {
    inputs: [],
    name: "PoolAlreadyInitialized",
    type: "error",
  },
  {
    inputs: [],
    name: "PositionAlreadyMinted",
    type: "error",
  },
  {
    inputs: [],
    name: "TicksNotInitializable",
    type: "error",
  },
  {
    inputs: [],
    name: "TooManyPositionsOpen",
    type: "error",
  },
  {
    inputs: [],
    name: "UnderOverFlow",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "liquidator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "liquidatee",
        type: "address",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "bonusAmounts",
        type: "int256",
      },
      {
        indexed: false,
        internalType: "int24",
        name: "tickAt",
        type: "int24",
      },
    ],
    name: "AccountLiquidated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "exercisor",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "exerciseFee",
        type: "int256",
      },
      {
        indexed: false,
        internalType: "int24",
        name: "tickAt",
        type: "int24",
      },
    ],
    name: "ForcedExercised",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "positionSize",
        type: "uint128",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "int24",
        name: "tickAtBurn",
        type: "int24",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "premia",
        type: "int256",
      },
    ],
    name: "OptionBurnt",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "positionSize",
        type: "uint128",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "int24",
        name: "tickAtMint",
        type: "int24",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "poolUtilizations",
        type: "uint128",
      },
    ],
    name: "OptionMinted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "positionSize",
        type: "uint128",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "oldTokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "newTokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "int24",
        name: "tickAtRoll",
        type: "int24",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "poolUtilizations",
        type: "uint128",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "premia",
        type: "int256",
      },
    ],
    name: "OptionRolled",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "int24",
        name: "tickLimitLow",
        type: "int24",
      },
      {
        internalType: "int24",
        name: "tickLimitHigh",
        type: "int24",
      },
    ],
    name: "burnOptions",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "positionIdList",
        type: "uint256[]",
      },
      {
        internalType: "int24",
        name: "tickLimitLow",
        type: "int24",
      },
      {
        internalType: "int24",
        name: "tickLimitHigh",
        type: "int24",
      },
    ],
    name: "burnOptions",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "positionIdList",
        type: "uint256[]",
      },
    ],
    name: "calculateAccumulatedFeesBatch",
    outputs: [
      {
        internalType: "int128",
        name: "premium0",
        type: "int128",
      },
      {
        internalType: "int128",
        name: "premium1",
        type: "int128",
      },
      {
        internalType: "uint256[2][]",
        name: "",
        type: "uint256[2][]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "int24",
        name: "atTick",
        type: "int24",
      },
      {
        internalType: "uint256[]",
        name: "positionIdList",
        type: "uint256[]",
      },
    ],
    name: "calculatePortfolioValue",
    outputs: [
      {
        internalType: "int256",
        name: "value0",
        type: "int256",
      },
      {
        internalType: "int256",
        name: "value1",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "collateralToken0",
    outputs: [
      {
        internalType: "contract CollateralTracker",
        name: "collateralToken",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "collateralToken1",
    outputs: [
      {
        internalType: "contract CollateralTracker",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "int24",
        name: "tickLimitLow",
        type: "int24",
      },
      {
        internalType: "int24",
        name: "tickLimitHigh",
        type: "int24",
      },
      {
        internalType: "uint256[]",
        name: "touchedId",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "idsToBurn",
        type: "uint256[]",
      },
    ],
    name: "forceExercise",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getPriceArray",
    outputs: [
      {
        internalType: "int24[]",
        name: "priceArray",
        type: "int24[]",
      },
      {
        internalType: "int24",
        name: "medianTick",
        type: "int24",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "int24",
        name: "tickLimitLow",
        type: "int24",
      },
      {
        internalType: "int24",
        name: "tickLimitHigh",
        type: "int24",
      },
      {
        internalType: "uint256[]",
        name: "positionIdList",
        type: "uint256[]",
      },
    ],
    name: "liquidateAccount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "positionIdList",
        type: "uint256[]",
      },
      {
        internalType: "uint128",
        name: "positionSize",
        type: "uint128",
      },
      {
        internalType: "uint64",
        name: "effectiveLiquidityLimitX32",
        type: "uint64",
      },
      {
        internalType: "int24",
        name: "tickLimitLow",
        type: "int24",
      },
      {
        internalType: "int24",
        name: "tickLimitHigh",
        type: "int24",
      },
    ],
    name: "mintOptions",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "data",
        type: "bytes[]",
      },
    ],
    name: "multicall",
    outputs: [
      {
        internalType: "bytes[]",
        name: "results",
        type: "bytes[]",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "numberOfPositions",
    outputs: [
      {
        internalType: "uint256",
        name: "_numberOfPositions",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155BatchReceived",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "optionPositionBalance",
    outputs: [
      {
        internalType: "uint128",
        name: "balance",
        type: "uint128",
      },
      {
        internalType: "uint64",
        name: "poolUtilization0",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "poolUtilization1",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pokeMedian",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "oldTokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "newTokenId",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "positionIdList",
        type: "uint256[]",
      },
      {
        internalType: "uint64",
        name: "effectiveLiquidityLimitX32",
        type: "uint64",
      },
      {
        internalType: "int24",
        name: "tickLimitLow",
        type: "int24",
      },
      {
        internalType: "int24",
        name: "tickLimitHigh",
        type: "int24",
      },
    ],
    name: "rollOptions",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IUniswapV3Pool",
        name: "univ3pool",
        type: "address",
      },
      {
        internalType: "int24",
        name: "tickSpacing",
        type: "int24",
      },
      {
        internalType: "int24",
        name: "currentTick",
        type: "int24",
      },
      {
        internalType: "address",
        name: "token0",
        type: "address",
      },
      {
        internalType: "address",
        name: "token1",
        type: "address",
      },
      {
        internalType: "contract CollateralTracker",
        name: "collateralTracker0",
        type: "address",
      },
      {
        internalType: "contract CollateralTracker",
        name: "collateralTracker1",
        type: "address",
      },
    ],
    name: "startPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "univ3pool",
    outputs: [
      {
        internalType: "contract IUniswapV3Pool",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
