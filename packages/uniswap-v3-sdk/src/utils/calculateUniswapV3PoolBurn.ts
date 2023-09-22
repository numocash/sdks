import { amountMultiply } from "reverse-mirage";
import type { Address } from "viem";
import type { UniswapV3PoolData } from "../types/uniswapV3Pool.js";
import type { UniswapV3Tick } from "../types/uniswapV3Tick.js";
import { liquidityAmounts } from "./math/liquidityAmounts.js";
import { updatePosition } from "./math/updatePosition.js";

export const calculateUniswapV3PoolBurn = (
  poolData: UniswapV3PoolData,
  from: Address,
  tickLower: UniswapV3Tick,
  tickUpper: UniswapV3Tick,
  liquidity: bigint,
) => {
  updatePosition(poolData, from, tickLower, tickUpper, -liquidity);

  const amounts = liquidityAmounts(poolData, tickLower, tickUpper, -liquidity);

  return [
    amountMultiply(amounts[0], -1),
    amountMultiply(amounts[1], -1),
  ] as const;
};
