import {
  type BaseERC20,
  type ERC20Amount,
  type Fraction,
  amountAdd,
  createAmountFromRaw,
  createFraction,
  createPriceFromFraction,
  fractionAdd,
  fractionEqualTo,
  rawPrice,
} from "reverse-mirage";
import invariant from "tiny-invariant";
import type { UniswapV3PoolData } from "../types/uniswapV3Pool.js";
import type { UniswapV3Tick } from "../types/uniswapV3Tick.js";
import { MAX_TICK, MIN_TICK } from "./constants.js";
import { createUniswapV3Tick } from "./createUniswapV3Tick.js";
import { computeSwapStep } from "./math/computeSwapStep.js";
import { getSqrtRatioAtTick } from "./math/getSqrtRatioAtTick.js";
import { getTickAtSqrtRatio } from "./math/getTickAtSqrtRatio.js";
import { nextInitializedTickWithinOneWord } from "./math/nextInitializedTickWithinOneWord.js";

type SwapState = {
  amountSpecifiedRemaining: bigint;
  amountCalculated: bigint;
  sqrtRatio: Fraction;
  tick: UniswapV3Tick;
  feeGrowthGlobal: Fraction;
  protocolFee: ERC20Amount<BaseERC20>;
};

export const calculateUniswapV3PoolSwap = (
  poolData: UniswapV3PoolData,
  amountSpecified: ERC20Amount<BaseERC20>,
): [ERC20Amount<BaseERC20>, ERC20Amount<BaseERC20>] => {
  invariant(amountSpecified.amount !== 0n);
  const zeroForOne =
    (amountSpecified.token === poolData.uniswapV3Pool.token0) ===
    amountSpecified.amount > 0n;

  const state: SwapState = {
    amountSpecifiedRemaining: amountSpecified.amount,
    amountCalculated: 0n,
    sqrtRatio: rawPrice(poolData.sqrtPrice),
    tick: poolData.tick,
    feeGrowthGlobal: zeroForOne ? poolData.feeGrowth0 : poolData.feeGrowth1,
    protocolFee: zeroForOne ? poolData.protocolFees0 : poolData.protocolFees1,
  };

  while (state.amountSpecifiedRemaining !== 0n) {
    const [tickNext, initialized] = nextInitializedTickWithinOneWord(
      poolData.tickBitmap,
      state.tick,
      poolData.uniswapV3Pool.tickSpacing,
      zeroForOne,
    );

    if (tickNext.tick < MIN_TICK) {
      tickNext.tick = MIN_TICK;
    } else if (tickNext.tick > MAX_TICK) {
      tickNext.tick = MAX_TICK;
    }

    const sqrtRatioNextTick = getSqrtRatioAtTick(tickNext);

    const { sqrtRatioNext, amountIn, amountOut, feeAmount } = computeSwapStep(
      state.sqrtRatio,
      sqrtRatioNextTick,
      zeroForOne,
      poolData.liquidity,
      state.amountSpecifiedRemaining,
      poolData.uniswapV3Pool.feeTier,
    );

    state.sqrtRatio = sqrtRatioNext;

    if (amountSpecified.amount > 0n) {
      state.amountSpecifiedRemaining -= amountIn + feeAmount;
      state.amountCalculated -= amountOut;
    } else {
      state.amountSpecifiedRemaining += amountOut;
      state.amountCalculated += amountIn + feeAmount;
    }

    // update protocol fee

    // update global fee tracker
    if (poolData.liquidity > 0n)
      state.feeGrowthGlobal = fractionAdd(
        state.feeGrowthGlobal,
        createFraction(feeAmount, poolData.liquidity),
      );

    // update liquidity by going to next tick
    if (fractionEqualTo(state.sqrtRatio, sqrtRatioNextTick)) {
      if (initialized) {
        // subtract liquidity net
        const liquidityNet = poolData.ticks[tickNext.tick]!.liquidityNet;
        // todo: cross ticks

        poolData.liquidity += zeroForOne ? -liquidityNet : liquidityNet;
      }

      state.tick = zeroForOne
        ? createUniswapV3Tick(tickNext.tick - 1)
        : tickNext;
    } else {
      state.tick = getTickAtSqrtRatio(state.sqrtRatio);
    }
  }

  // update price
  poolData.sqrtPrice = createPriceFromFraction(
    poolData.uniswapV3Pool.token1,
    poolData.uniswapV3Pool.token0,
    state.sqrtRatio,
  );

  // update fee growth
  if (zeroForOne) {
    poolData.feeGrowth0 = state.feeGrowthGlobal;
    poolData.protocolFees0 = amountAdd(
      poolData.protocolFees0,
      state.protocolFee,
    );
  } else {
    poolData.feeGrowth1 = state.feeGrowthGlobal;
    poolData.protocolFees1 = amountAdd(
      poolData.protocolFees1,
      state.protocolFee,
    );
  }

  return amountSpecified.token === poolData.uniswapV3Pool.token0
    ? [
        createAmountFromRaw(
          poolData.uniswapV3Pool.token0,
          amountSpecified.amount - state.amountSpecifiedRemaining,
        ),
        createAmountFromRaw(
          poolData.uniswapV3Pool.token1,
          state.amountCalculated,
        ),
      ]
    : [
        createAmountFromRaw(
          poolData.uniswapV3Pool.token0,
          state.amountCalculated,
        ),
        createAmountFromRaw(
          poolData.uniswapV3Pool.token1,
          amountSpecified.amount - state.amountSpecifiedRemaining,
        ),
      ];
};
