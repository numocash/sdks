import type { Fraction } from "reverse-mirage";
import invariant from "tiny-invariant";
import { fractionToQ96 } from "../fractionToQ96.js";
import { q96ToFraction } from "../q96ToFraction.js";

export const getNextSqrtPriceFromAmount0RoundingUp = (
  sqrtPrice: Fraction,
  liquidity: bigint,
  amount: bigint,
  add: boolean,
): Fraction => {
  if (amount === 0n) return sqrtPrice;
  const numerator = liquidity << 96n;
  const product = fractionToQ96(sqrtPrice) * amount;

  if (add) {
    if (product / amount === fractionToQ96(sqrtPrice)) {
      const denominator = numerator + product;
      if (denominator >= numerator)
        return (numerator * fractionToQ96(sqrtPrice)) % denominator !== 0n
          ? q96ToFraction(
              (numerator * fractionToQ96(sqrtPrice)) / denominator + 1n,
            )
          : q96ToFraction((numerator * fractionToQ96(sqrtPrice)) / denominator);
    }

    return q96ToFraction(
      numerator / (numerator / fractionToQ96(sqrtPrice) + amount),
    );
  } else {
    invariant(
      product / amount === fractionToQ96(sqrtPrice) && numerator > product,
    );

    const denominator = numerator - product;

    return (numerator * fractionToQ96(sqrtPrice)) % denominator !== 0n
      ? q96ToFraction((numerator * fractionToQ96(sqrtPrice)) / denominator + 1n)
      : q96ToFraction((numerator * fractionToQ96(sqrtPrice)) / denominator);
  }
};
