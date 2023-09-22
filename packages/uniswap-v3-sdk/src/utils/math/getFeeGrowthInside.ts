import { fractionSubtract } from "reverse-mirage";
import type { UniswapV3PoolData } from "../../types/uniswapV3Pool.js";
import type { UniswapV3TickData } from "../../types/uniswapV3Tick.js";

export const getFeeGrowthInside = (
  poolData: Pick<UniswapV3PoolData, "feeGrowth0" | "feeGrowth1" | "tick">,
  tickLower: UniswapV3TickData,
  tickUpper: UniswapV3TickData,
) => {
  const [feeGrowthBelow0, feeGrowthBelow1] =
    poolData.tick.tick >= tickUpper.tick.tick
      ? [tickLower.feeGrowthOutside0, tickLower.feeGrowthOutside1]
      : [
          fractionSubtract(poolData.feeGrowth0, tickLower.feeGrowthOutside0),
          fractionSubtract(poolData.feeGrowth1, tickLower.feeGrowthOutside1),
        ];

  const [feeGrowthAbove0, feeGrowthAbove1] =
    poolData.tick.tick < tickUpper.tick.tick
      ? [tickUpper.feeGrowthOutside0, tickUpper.feeGrowthOutside1]
      : [
          fractionSubtract(poolData.feeGrowth0, tickUpper.feeGrowthOutside0),
          fractionSubtract(poolData.feeGrowth1, tickUpper.feeGrowthOutside1),
        ];

  return [
    fractionSubtract(
      fractionSubtract(poolData.feeGrowth0, feeGrowthBelow0),
      feeGrowthAbove0,
    ),
    fractionSubtract(
      fractionSubtract(poolData.feeGrowth1, feeGrowthBelow1),
      feeGrowthAbove1,
    ),
  ] as const;
};
