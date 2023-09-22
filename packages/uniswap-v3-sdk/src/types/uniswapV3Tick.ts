import type { Fraction } from "reverse-mirage";

export type UniswapV3Tick = { type: "uniswapV3Tick"; tick: number };

export type UniswapV3TickData = {
  type: "uniswapV3TickData";
  tick: UniswapV3Tick;
  liquidityGross: bigint;
  liquidityNet: bigint;
  feeGrowthOutside0: Fraction;
  feeGrowthOutside1: Fraction;
};
