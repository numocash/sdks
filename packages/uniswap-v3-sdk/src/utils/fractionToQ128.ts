import type { Fraction } from "reverse-mirage";
import { Q128 } from "./constants.js";

/**
 * Convert fraction type to Q128 integer
 */
export const fractionToQ128 = (fraction: Fraction): bigint =>
  (fraction.numerator * Q128) / fraction.denominator;
