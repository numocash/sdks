import { type Fraction, createFraction } from "reverse-mirage";
import { Q96 } from "./constants.js";

/**
 * Convert Q96 integer to fraction type
 */
export const q96ToFraction = (q96: bigint): Fraction =>
  createFraction(q96, Q96);
