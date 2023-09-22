import {
  type BaseERC20,
  type ERC20Amount,
  createAmountFromRaw,
  rawPrice,
} from "reverse-mirage";
import invariant from "tiny-invariant";
import type { UniswapV3PoolData } from "../../types/uniswapV3Pool.js";
import type { UniswapV3Tick } from "../../types/uniswapV3Tick.js";
import { getAmount0Delta } from "./getAmount0.js";
import { getAmount1Delta } from "./getAmount1.js";
import { getSqrtRatioAtTick } from "./getSqrtRatioAtTick.js";

export const liquidityAmounts = (
  poolData: UniswapV3PoolData,
  tickLower: UniswapV3Tick,
  tickUpper: UniswapV3Tick,
  liquidity: bigint,
): readonly [ERC20Amount<BaseERC20>, ERC20Amount<BaseERC20>] => {
  invariant(tickUpper.tick > tickLower.tick);

  if (liquidity !== 0n) {
    if (poolData.tick.tick < tickLower.tick) {
      return [
        createAmountFromRaw(
          poolData.uniswapV3Pool.token0,
          getAmount0Delta(
            getSqrtRatioAtTick(tickLower),
            getSqrtRatioAtTick(tickUpper),
            liquidity,
          ),
        ),
        createAmountFromRaw(poolData.uniswapV3Pool.token1, 0n),
      ] as const;
    } else if (poolData.tick.tick < tickUpper.tick) {
      poolData.liquidity += liquidity;

      return [
        createAmountFromRaw(
          poolData.uniswapV3Pool.token0,
          getAmount0Delta(
            rawPrice(poolData.sqrtPrice),
            getSqrtRatioAtTick(tickUpper),
            liquidity,
          ),
        ),
        createAmountFromRaw(
          poolData.uniswapV3Pool.token1,
          getAmount1Delta(
            getSqrtRatioAtTick(tickLower),
            rawPrice(poolData.sqrtPrice),
            liquidity,
          ),
        ),
      ] as const;
    } else {
      return [
        createAmountFromRaw(poolData.uniswapV3Pool.token0, 0n),

        createAmountFromRaw(
          poolData.uniswapV3Pool.token1,
          getAmount0Delta(
            getSqrtRatioAtTick(tickLower),
            getSqrtRatioAtTick(tickUpper),
            liquidity,
          ),
        ),
      ] as const;
    }
  } else {
    return [
      createAmountFromRaw(poolData.uniswapV3Pool.token0, 0n),
      createAmountFromRaw(poolData.uniswapV3Pool.token1, 0n),
    ] as const;
  }
};
