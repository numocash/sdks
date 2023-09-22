import { type Fraction, fractionGreaterThan } from "reverse-mirage";
import invariant from "tiny-invariant";
import { Q96 } from "../constants.js";
import { fractionToQ96 } from "../fractionToQ96.js";

export const getAmount0Delta = (
  sqrtPriceA: Fraction,
  sqrtPriceB: Fraction,
  liquidity: bigint,
): bigint =>
  liquidity < 0n
    ? -getAmount0DeltaRound(sqrtPriceA, sqrtPriceB, -liquidity, false)
    : getAmount0DeltaRound(sqrtPriceA, sqrtPriceB, liquidity, true);

export const getAmount0DeltaRound = (
  sqrtPriceA: Fraction,
  sqrtPriceB: Fraction,
  liquidity: bigint,
  roundUp: boolean,
): bigint => {
  const [sqrtPrice0, sqrtPrice1] = fractionGreaterThan(sqrtPriceA, sqrtPriceB)
    ? [sqrtPriceB, sqrtPriceA]
    : [sqrtPriceA, sqrtPriceB];

  const numerator1 = liquidity * Q96;
  const numerator2 = fractionToQ96(sqrtPrice1) - fractionToQ96(sqrtPrice0);

  invariant(fractionGreaterThan(sqrtPrice0, 0));

  if (roundUp) {
    const x =
      (numerator1 * numerator2) % fractionToQ96(sqrtPrice1) !== 0n
        ? (numerator1 * numerator2) / fractionToQ96(sqrtPrice1) + 1n
        : (numerator1 * numerator2) / fractionToQ96(sqrtPrice1);
    return x % fractionToQ96(sqrtPrice0) !== 0n
      ? x / fractionToQ96(sqrtPrice0) + 1n
      : x / fractionToQ96(sqrtPrice0);
  } else {
    return (
      (numerator1 * numerator2) /
      fractionToQ96(sqrtPrice1) /
      fractionToQ96(sqrtPrice0)
    );
  }
};
