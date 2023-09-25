export const collateralTrackerABI = [
  {
    inputs: [],
    name: "CastingError",
    type: "error",
  },
  {
    inputs: [],
    name: "CollateralTokenAlreadyInitialized",
    type: "error",
  },
  {
    inputs: [],
    name: "DepositTooLarge",
    type: "error",
  },
  {
    inputs: [],
    name: "ExceedsMaximumRedemption",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidNotionalValue",
    type: "error",
  },
  {
    inputs: [],
    name: "NotMarginCalled",
    type: "error",
  },
  {
    inputs: [],
    name: "NotOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "NotPanopticPool",
    type: "error",
  },
  {
    inputs: [],
    name: "PositionCountNotZero",
    type: "error",
  },
  {
    inputs: [],
    name: "TicksNotInitializable",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferFailed",
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
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "maintenanceMarginRatio",
            type: "uint256",
          },
          {
            internalType: "int128",
            name: "commissionFee",
            type: "int128",
          },
          {
            internalType: "int128",
            name: "ITMSpreadFee",
            type: "int128",
          },
          {
            internalType: "int128",
            name: "sellCollateralRatio",
            type: "int128",
          },
          {
            internalType: "int128",
            name: "buyCollateralRatio",
            type: "int128",
          },
          {
            internalType: "int128",
            name: "targetPoolUtilization",
            type: "int128",
          },
          {
            internalType: "int128",
            name: "saturatedPoolUtilization",
            type: "int128",
          },
          {
            internalType: "int128",
            name: "exerciseCost",
            type: "int128",
          },
        ],
        indexed: false,
        internalType: "struct CollateralTracker.Parameters",
        name: "newParameters",
        type: "tuple",
      },
    ],
    name: "ParametersUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "allowance",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "asset",
    outputs: [
      {
        internalType: "address",
        name: "assetTokenAddress",
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
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "balance",
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
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256[2][]",
        name: "positionBalanceArray",
        type: "uint256[2][]",
      },
      {
        internalType: "uint256",
        name: "otherTokenData",
        type: "uint256",
      },
      {
        internalType: "int24",
        name: "twapTick",
        type: "int24",
      },
      {
        internalType: "uint160",
        name: "sqrtPriceX96",
        type: "uint160",
      },
      {
        internalType: "int128",
        name: "premium",
        type: "int128",
      },
    ],
    name: "computeBonus",
    outputs: [
      {
        internalType: "int256",
        name: "bonusAmounts",
        type: "int256",
      },
      {
        internalType: "uint256",
        name: "tokenData",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "convertToAssets",
    outputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
    ],
    name: "convertToShares",
    outputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "delegator",
        type: "address",
      },
      {
        internalType: "address",
        name: "delegatee",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
    ],
    name: "delegate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "deposit",
    outputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "optionOwner",
        type: "address",
      },
      {
        internalType: "int128",
        name: "longAmount",
        type: "int128",
      },
      {
        internalType: "int128",
        name: "shortAmount",
        type: "int128",
      },
      {
        internalType: "int128",
        name: "swappedAmount",
        type: "int128",
      },
      {
        internalType: "int128",
        name: "currentPositionPremium",
        type: "int128",
      },
    ],
    name: "exercise",
    outputs: [],
    stateMutability: "nonpayable",
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
        name: "currentTick",
        type: "int24",
      },
      {
        internalType: "int24",
        name: "medianTick",
        type: "int24",
      },
      {
        internalType: "uint256",
        name: "positionId",
        type: "uint256",
      },
      {
        internalType: "uint128",
        name: "positionBalance",
        type: "uint128",
      },
      {
        internalType: "int256",
        name: "longAmounts",
        type: "int256",
      },
    ],
    name: "exerciseCost",
    outputs: [
      {
        internalType: "int256",
        name: "exerciseFees",
        type: "int256",
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
        name: "currentTick",
        type: "int24",
      },
      {
        internalType: "uint256[2][]",
        name: "positionBalanceArray",
        type: "uint256[2][]",
      },
      {
        internalType: "int128",
        name: "premiumAllPositions",
        type: "int128",
      },
    ],
    name: "getAccountMarginDetails",
    outputs: [
      {
        internalType: "uint256",
        name: "tokenData",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPoolData",
    outputs: [
      {
        internalType: "uint256",
        name: "poolAssets",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "insideAMM",
        type: "uint256",
      },
      {
        internalType: "int128",
        name: "currentPoolUtilization",
        type: "int128",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "refunder",
        type: "address",
      },
      {
        internalType: "int256",
        name: "refundValues",
        type: "int256",
      },
      {
        internalType: "int24",
        name: "atTick",
        type: "int24",
      },
      {
        internalType: "contract CollateralTracker",
        name: "collateralToken1",
        type: "address",
      },
    ],
    name: "getRefundAmounts",
    outputs: [
      {
        internalType: "int256",
        name: "refundAmounts",
        type: "int256",
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
    ],
    name: "maxDeposit",
    outputs: [
      {
        internalType: "uint256",
        name: "maxAssets",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "maxMint",
    outputs: [
      {
        internalType: "uint256",
        name: "maxShares",
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
        name: "owner",
        type: "address",
      },
    ],
    name: "maxRedeem",
    outputs: [
      {
        internalType: "uint256",
        name: "maxShares",
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
        name: "owner",
        type: "address",
      },
    ],
    name: "maxWithdraw",
    outputs: [
      {
        internalType: "uint256",
        name: "maxAssets",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
    ],
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
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
    ],
    name: "previewDeposit",
    outputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "previewMint",
    outputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "previewRedeem",
    outputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
    ],
    name: "previewWithdraw",
    outputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "redeem",
    outputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "refunder",
        type: "address",
      },
      {
        internalType: "address",
        name: "refundee",
        type: "address",
      },
      {
        internalType: "int256",
        name: "assets",
        type: "int256",
      },
    ],
    name: "refund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "delegator",
        type: "address",
      },
      {
        internalType: "address",
        name: "delegatee",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
    ],
    name: "revoke",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "underlyingToken",
        type: "address",
      },
      {
        internalType: "contract IUniswapV3Pool",
        name: "uniswapPool",
        type: "address",
      },
      {
        internalType: "contract PanopticPool",
        name: "panopticPool",
        type: "address",
      },
    ],
    name: "startToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "environmentContext",
        type: "uint256",
      },
      {
        internalType: "int128",
        name: "longAmount",
        type: "int128",
      },
      {
        internalType: "int128",
        name: "shortAmount",
        type: "int128",
      },
      {
        internalType: "int128",
        name: "portfolioPremium",
        type: "int128",
      },
      {
        internalType: "int128",
        name: "oldPositionPremia",
        type: "int128",
      },
      {
        internalType: "int128",
        name: "swappedAmount",
        type: "int128",
      },
      {
        internalType: "uint256[2][]",
        name: "positionBalanceArray",
        type: "uint256[2][]",
      },
    ],
    name: "takeCommissionAddData",
    outputs: [
      {
        internalType: "int128",
        name: "utilization",
        type: "int128",
      },
      {
        internalType: "uint256",
        name: "tokenData",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalAssets",
    outputs: [
      {
        internalType: "uint256",
        name: "totalManagedAssets",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
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
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "maintenanceMarginRatio",
            type: "uint256",
          },
          {
            internalType: "int128",
            name: "commissionFee",
            type: "int128",
          },
          {
            internalType: "int128",
            name: "ITMSpreadFee",
            type: "int128",
          },
          {
            internalType: "int128",
            name: "sellCollateralRatio",
            type: "int128",
          },
          {
            internalType: "int128",
            name: "buyCollateralRatio",
            type: "int128",
          },
          {
            internalType: "int128",
            name: "targetPoolUtilization",
            type: "int128",
          },
          {
            internalType: "int128",
            name: "saturatedPoolUtilization",
            type: "int128",
          },
          {
            internalType: "int128",
            name: "exerciseCost",
            type: "int128",
          },
        ],
        internalType: "struct CollateralTracker.Parameters",
        name: "newParameters",
        type: "tuple",
      },
    ],
    name: "updateParameters",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "withdraw",
    outputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
