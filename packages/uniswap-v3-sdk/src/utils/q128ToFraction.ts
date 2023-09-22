import { type Fraction, createFraction } from "reverse-mirage";
import { Q128 } from "./constants.js";

/**
 * Convert Q128 integer to fraction type
 */
export const q128ToFraction = (q128: bigint): Fraction =>
  createFraction(q128, Q128);
