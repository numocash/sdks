import type {
  BaseERC20,
  ERC20Amount,
  ERC1155,
  ERC1155Data,
  Fraction,
  Tuple,
} from "reverse-mirage";
import type {
  UniswapV3Factory,
  UniswapV3Pool,
  UniswapV3PoolData,
  UniswapV3Tick,
} from "uniswap-v3-sdk";
import type { Address } from "viem";

export type PanopticCollateral = BaseERC20<"poERC20"> & {
  underlyingToken: BaseERC20;
};

export type PanopticFactory = {
  type: "panopticFactory";
  address: Address;
  owner: Address;
  uniswapFactory: UniswapV3Factory;
  blockCreated: bigint;
};

export type PanopticPool = {
  type: "panopticPool";
  uniswapPool: UniswapV3Pool;
  factory: PanopticFactory;
  collateralTracker0: PanopticCollateral;
  collateralTracker1: PanopticCollateral;
  address: Address;
  blockCreated: bigint;
};

export type PanopticCollateralParamters = {
  type: "panopticCollateralParameters";
  maintenanceMarginRatio: Fraction;
  commissionFee: Fraction;
  ITMSpreadFee: Fraction;
  sellCollateralRatio: Fraction;
  buyCollateralRatio: Fraction;
  targetPoolUtilization: Fraction;
  saturatedPoolUtilization: Fraction;
  exerciseCost: Fraction;
};

export type PanopticCollateralPositionData = ERC20Amount<PanopticCollateral> & {
  // position array
};

export type PanopticCollateralData = {
  type: "panopticCollateralData";
  collateral: PanopticCollateral;
  parameters: PanopticCollateralParamters;
  poolAssets: ERC20Amount<BaseERC20>;
  inAmm: ERC20Amount<BaseERC20>;
  totalSupply: ERC20Amount<BaseERC20>;
};

export type PanoptionLeg = {
  asset: "token0" | "token1";
  optionRatio: number;
  position: "long" | "short";
  riskPartnerIndex: 0 | 1 | 2 | 3;
  tickLower: UniswapV3Tick;
  tickUpper: UniswapV3Tick;
};

export type PanopticPosition = ERC1155 & {
  type: "panopticPosition";
  pool: PanopticPool;
  owner: Address;
  legs: Tuple<PanoptionLeg, 4>;
};

export type PanopticPositionData = ERC1155Data<PanopticPosition> & {
  liquidityAdded: bigint;
  liquidityRemoved: bigint;
  accountPremiumOwed0: bigint;
  accountPremiumOwed1: bigint;
  accountPremiumGross0: bigint;
  accountPremiumGross1: bigint;
  baseFee0: bigint;
  baseFee1: bigint;
  token0Utilization: Fraction;
  token1Utilization: Fraction;
};

export type PanopticPoolData = {
  type: "panopticPoolData";
  panopticPool: PanopticPool;
  uniswapPoolData: UniswapV3PoolData;
  collateralTracker0Data: PanopticCollateralData;
};
