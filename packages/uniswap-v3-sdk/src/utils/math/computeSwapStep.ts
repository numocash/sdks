import { type Fraction, fractionEqualTo } from "reverse-mirage";
import { getAmount0DeltaRound } from "./getAmount0.js";
import { getAmount1DeltaRound } from "./getAmount1.js";
import { getNextSqrtPriceFromInput } from "./getNextSqrtPriceFromInput.js";
import { getNextSqrtPriceFromOutput } from "./getNextSqrtPriceFromOutput.js";

export const computeSwapStep = (
  sqrtRatio: Fraction,
  sqrtRatioTarget: Fraction,
  zeroForOne: boolean,
  liquidity: bigint,
  amountRemaining: bigint,
  fee: number,
): {
  sqrtRatioNext: Fraction;
  amountIn: bigint;
  amountOut: bigint;
  feeAmount: bigint;
} => {
  const exactIn = amountRemaining > 0n;

  if (exactIn) {
    const amountRemainingLessFee =
      (amountRemaining * (1_000_000n - BigInt(fee))) / 1_000_000n;
    let amountIn = zeroForOne
      ? getAmount0DeltaRound(sqrtRatioTarget, sqrtRatio, liquidity, true)
      : getAmount1DeltaRound(sqrtRatio, sqrtRatioTarget, liquidity, true);
    const sqrtRatioNext =
      amountRemainingLessFee >= amountIn
        ? sqrtRatioTarget
        : getNextSqrtPriceFromInput(
            sqrtRatio,
            liquidity,
            amountRemainingLessFee,
            zeroForOne,
          );

    const max = sqrtRatioTarget === sqrtRatioNext;

    amountIn = max
      ? amountIn
      : zeroForOne
      ? getAmount0DeltaRound(sqrtRatioNext, sqrtRatio, liquidity, true)
      : getAmount1DeltaRound(sqrtRatio, sqrtRatioNext, liquidity, true);

    const amountOut = zeroForOne
      ? getAmount1DeltaRound(sqrtRatioNext, sqrtRatio, liquidity, false)
      : getAmount0DeltaRound(sqrtRatio, sqrtRatioNext, liquidity, false);

    const feeAmount =
      sqrtRatioNext !== sqrtRatioTarget
        ? amountRemaining - amountIn
        : (amountIn * BigInt(fee)) % 1_000_000n !== 0n
        ? (amountIn * BigInt(fee)) / 1_000_000n + 1n
        : (amountIn * BigInt(fee)) / 1_000_000n;

    return { sqrtRatioNext, amountIn, amountOut, feeAmount };
  } else {
    let amountOut = zeroForOne
      ? getAmount1DeltaRound(sqrtRatioTarget, sqrtRatio, liquidity, false)
      : getAmount0DeltaRound(sqrtRatio, sqrtRatioTarget, liquidity, false);

    const sqrtRatioNext =
      -amountRemaining >= amountOut
        ? sqrtRatioTarget
        : getNextSqrtPriceFromOutput(
            sqrtRatio,
            liquidity,
            -amountRemaining,
            zeroForOne,
          );

    const max = fractionEqualTo(sqrtRatioTarget, sqrtRatioNext);

    const amountIn = zeroForOne
      ? getAmount0DeltaRound(sqrtRatioNext, sqrtRatio, liquidity, true)
      : getAmount1DeltaRound(sqrtRatio, sqrtRatioNext, liquidity, true);

    amountOut = max
      ? amountOut
      : zeroForOne
      ? getAmount1DeltaRound(sqrtRatioNext, sqrtRatio, liquidity, false)
      : getAmount0DeltaRound(sqrtRatio, sqrtRatioNext, liquidity, false);

    if (amountOut > -amountRemaining) {
      amountOut = -amountRemaining;
    }

    const feeAmount =
      (amountIn * BigInt(fee)) % (1_000_000n - BigInt(fee)) !== 0n
        ? (amountIn * BigInt(fee)) / (1_000_000n - BigInt(fee)) + 1n
        : (amountIn * BigInt(fee)) / (1_000_000n - BigInt(fee));

    return { sqrtRatioNext, amountIn, amountOut, feeAmount };
  }
};
