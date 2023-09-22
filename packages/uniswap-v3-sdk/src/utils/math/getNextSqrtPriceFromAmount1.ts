import type { Fraction } from "reverse-mirage";
import invariant from "tiny-invariant";
import { Q96 } from "../constants.js";
import { fractionToQ96 } from "../fractionToQ96.js";
import { q96ToFraction } from "../q96ToFraction.js";

export const getNextSqrtPriceFromAmount1RoundingDown = (
  sqrtPrice: Fraction,
  liquidity: bigint,
  amount: bigint,
  add: boolean,
): Fraction => {
  if (add) {
    const quotient = (amount * Q96) / liquidity;

    return q96ToFraction(fractionToQ96(sqrtPrice) + quotient);
  } else {
    const quotient =
      (amount << 96n) % liquidity !== 0n
        ? (amount << 96n) / liquidity + 1n
        : (amount << 96n) / liquidity;

    invariant(fractionToQ96(sqrtPrice) > quotient);
    return q96ToFraction(fractionToQ96(sqrtPrice) - quotient);
  }
};
