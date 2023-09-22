import type { Fraction } from "reverse-mirage";
import { Q96 } from "./constants.js";

/**
 * Convert fraction type to Q96 integer
 */
export const fractionToQ96 = (fraction: Fraction): bigint =>
  (fraction.numerator * Q96) / fraction.denominator;
