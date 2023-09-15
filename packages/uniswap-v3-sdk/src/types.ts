import type { BaseERC20, ERC20Amount, Fraction, Price } from "reverse-mirage";
import type { Address, Hex } from "viem";

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

export type UniswapV3Tick = { type: "uniswapV3Tick"; tick: number };

export type UniswapV3Position = {
  type: "uniswapV3Position";
  pool: UniswapV3Pool;
  owner: Address;
  tickLower: UniswapV3Tick;
  tickUpper: UniswapV3Tick;
};

export type UniswapV3TickData = {
  type: "uniswapV3TickData";
  tick: UniswapV3Tick;
  liquidityGross: bigint;
  liquidityNet: bigint;
  feeGrowthOutside0: Fraction;
  feeGrowthOutside1: Fraction;
};

export type UniswapV3PositionData = {
  type: "uniswapV3PositionData";
  position: UniswapV3Position;
  liquidity: bigint;
  feeGrowthInside0: Fraction;
  feeGrowthInside1: Fraction;
  tokensOwed0: ERC20Amount<UniswapV3Position["pool"]["token0"]>;
  tokensOwed1: ERC20Amount<UniswapV3Position["pool"]["token1"]>;
};

export type UniswapV3PoolData = {
  type: "uniswapV3PoolData";
  uniswapV3Pool: UniswapV3Pool;
  price: Price<UniswapV3Pool["token1"], UniswapV3Pool["token0"]>;
  tick: UniswapV3Tick;
  feeProtocol: Fraction;
  feeGrowth0: Fraction;
  feeGrowth1: Fraction;
  protocolFees0: ERC20Amount<UniswapV3Pool["token0"]>;
  protocolFees1: ERC20Amount<UniswapV3Pool["token1"]>;
  liquidity: bigint;
  ticks: { [tick: UniswapV3Tick["tick"]]: UniswapV3TickData };
  positions: { [positionID: Hex]: UniswapV3PositionData };
};
