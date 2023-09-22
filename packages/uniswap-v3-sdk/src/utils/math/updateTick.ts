import { createFraction } from "reverse-mirage";
import type { UniswapV3PoolData } from "../../types/uniswapV3Pool.js";
import type { UniswapV3Tick } from "../../types/uniswapV3Tick.js";

export const updateTick = (
  poolData: UniswapV3PoolData,
  tick: UniswapV3Tick,
  liquidity: bigint,
  upper: boolean,
) => {
  if (poolData.ticks[tick.tick] === undefined)
    poolData.ticks[tick.tick] = {
      type: "uniswapV3TickData",
      tick,
      feeGrowthOutside0: createFraction(0),
      feeGrowthOutside1: createFraction(0),
      liquidityGross: 0n,
      liquidityNet: 0n,
    };

  const liquidityGrossBefore = poolData.ticks[tick.tick]!.liquidityGross;
  const liquidityGrossAfter = liquidityGrossBefore + liquidity;

  // TODO: check max liquidity

  if (liquidityGrossBefore === 0n && tick.tick <= poolData.tick.tick) {
    poolData.ticks[tick.tick]!.feeGrowthOutside0 = poolData.feeGrowth0;
    poolData.ticks[tick.tick]!.feeGrowthOutside1 = poolData.feeGrowth1;
  }

  poolData.ticks[tick.tick]!.liquidityGross = liquidityGrossAfter;

  poolData.ticks[tick.tick]!.liquidityNet = upper
    ? poolData.ticks[tick.tick]!.liquidityNet - liquidity
    : poolData.ticks[tick.tick]!.liquidityNet + liquidity;
};
