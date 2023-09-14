import type { BaseERC20, ERC20Amount, Fraction, Price } from "reverse-mirage";
import type { Address } from "viem";

/**
 * Fee charged on a swap in pips
 */
export type FeeTier = 100 | 500 | 3_000 | 10_000;

export type TickSpacing = 1 | 10 | 60 | 200;

export type UniswapV3Pool = {
  type: "uniswapV3Pool";
  token0: BaseERC20;
  token1: BaseERC20;
  feeTier: FeeTier;
  tickSpacing: TickSpacing;
  address: Address;
  blockCreated: bigint;
};

export type Tick = { type: "tick"; tick: number };

export type Position = {
  type: "position";
  pool: UniswapV3Pool;
  owner: Address;
  tickLower: Tick;
  tickUpper: Tick;
};

export type TickData = {
  type: "tickData";
  tick: Tick;
  liquidityGross: bigint;
  liquidityNet: bigint;
  feeGrowthOutside0: Fraction;
  feeGrowthOutside1: Fraction;
};

export type PositionData = {
  type: "positionData";
  position: Position;
  liquidity: bigint;
  feeGrowthInside0: Fraction;
  feeGrowthInside1: Fraction;
  tokensOwed0: ERC20Amount<Position["pool"]["token0"]>;
  tokensOwed1: ERC20Amount<Position["pool"]["token1"]>;
};

export type UniswapV3PoolData = {
  type: "uniswapV3PoolData";
  uniswapV3Pool: UniswapV3Pool;
  price: Price<UniswapV3Pool["token0"], UniswapV3Pool["token1"]>;
  tick: number;
  feeProtocol: Fraction;
  feeGrowth0: Fraction;
  feeGrowth1: Fraction;
  protocolFees0: ERC20Amount<UniswapV3Pool["token0"]>;
  protocolFees1: ERC20Amount<UniswapV3Pool["token1"]>;
  liquidity: bigint;
  ticks: { [tick: Tick["tick"]]: TickData };
};
