import type { BaseERC20, ERC20Amount, Fraction, Price } from "reverse-mirage";
import type { Hex } from "viem";
import type { Address } from "viem/accounts";
import type { UniswapV3PositionData } from "./uniswapV3Position.js";
import type { UniswapV3Tick, UniswapV3TickData } from "./uniswapV3Tick.js";

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

export type UniswapV3PoolData = {
  type: "uniswapV3PoolData";
  uniswapV3Pool: UniswapV3Pool;
  sqrtPrice: Price<UniswapV3Pool["token1"], UniswapV3Pool["token0"]>;
  tick: UniswapV3Tick;
  feeProtocol: Fraction;
  feeGrowth0: Fraction;
  feeGrowth1: Fraction;
  protocolFees0: ERC20Amount<UniswapV3Pool["token0"]>;
  protocolFees1: ERC20Amount<UniswapV3Pool["token1"]>;
  liquidity: bigint;
  ticks: { [tick: UniswapV3Tick["tick"]]: UniswapV3TickData };
  positions: { [positionID: Hex]: UniswapV3PositionData };
  tickBitmap: { [tickIndex: number]: bigint };
};
