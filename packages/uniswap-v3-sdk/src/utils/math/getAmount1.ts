import { type Fraction, fractionGreaterThan } from "reverse-mirage";
import invariant from "tiny-invariant";
import { Q96 } from "../constants.js";
import { fractionToQ96 } from "../fractionToQ96.js";

export const getAmount1Delta = (
  sqrtPriceA: Fraction,
  sqrtPriceB: Fraction,
  liquidity: bigint,
): bigint =>
  liquidity < 0n
    ? -getAmount1DeltaRound(sqrtPriceA, sqrtPriceB, -liquidity, false)
    : getAmount1DeltaRound(sqrtPriceA, sqrtPriceB, liquidity, true);

export const getAmount1DeltaRound = (
  sqrtPriceA: Fraction,
  sqrtPriceB: Fraction,
  liquidity: bigint,
  roundUp: boolean,
): bigint => {
  const [sqrtPrice0, sqrtPrice1] = fractionGreaterThan(sqrtPriceA, sqrtPriceB)
    ? [sqrtPriceB, sqrtPriceA]
    : [sqrtPriceA, sqrtPriceB];

  const numerator =
    liquidity * (fractionToQ96(sqrtPrice1) - fractionToQ96(sqrtPrice0));

  invariant(fractionGreaterThan(sqrtPrice0, 0));

  return numerator % Q96 !== 0n && roundUp
    ? numerator / Q96 + 1n
    : numerator / Q96;
};
