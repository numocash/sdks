import {
  type Fraction,
  fractionGreaterThan,
  fractionLessThan,
} from "reverse-mirage";
import invariant from "tiny-invariant";
import { MAX_SQRT_PRICE, MIN_SQRT_PRICE } from "../constants.js";
import { createUniswapV3Tick } from "../createUniswapV3Tick.js";
import { fractionToQ96 } from "../fractionToQ96.js";
import { getSqrtRatioAtTick } from "./getSqrtRatioAtTick.js";

export const getTickAtSqrtRatio = (sqrtRatio: Fraction) => {
  // second inequality must be < because the price can never reach the price at the max tick
  invariant(
    !fractionLessThan(sqrtRatio, MIN_SQRT_PRICE) &&
      fractionLessThan(sqrtRatio, MAX_SQRT_PRICE),
  );
  const ratio = fractionToQ96(sqrtRatio) << 32n;

  let r = ratio;
  let msb = 0n;

  {
    const f = r > 0xffffffffffffffffffffffffffffffffn ? 1n << 7n : 0n;
    msb = msb | f;
    r = r >> f;
  }
  {
    const f = r > 0xffffffffffffffffn ? 1n << 6n : 0n;
    msb = msb | f;
    r = r >> f;
  }
  {
    const f = r > 0xffffffffn ? 1n << 5n : 0n;
    msb = msb | f;
    r = r >> f;
  }
  {
    const f = r > 0xffffn ? 1n << 4n : 0n;
    msb = msb | f;
    r = r >> f;
  }
  {
    const f = r > 0xffn ? 1n << 3n : 0n;
    msb = msb | f;
    r = r >> f;
  }
  {
    const f = r > 0xfn ? 1n << 2n : 0n;
    msb = msb | f;
    r = r >> f;
  }
  {
    const f = r > 0x3n ? 1n << 1n : 0n;
    msb = msb | f;
    r = r >> f;
  }
  {
    const f = r > 0x1n ? 1n : 0n;
    msb = msb | f;
    r = r >> f;
  }

  if (msb >= 128n) r = ratio >> (msb - 127n);
  else r = ratio << (127n - msb);

  let log_2 = (msb - 128n) << 64n;

  {
    r = (r * r) >> 127n;
    const f = r >> 128n;
    log_2 |= f << 63n;
    r = r >> f;
  }
  {
    r = (r * r) >> 127n;
    const f = r >> 128n;
    log_2 |= f << 62n;
    r = r >> f;
  }
  {
    r = (r * r) >> 127n;
    const f = r >> 128n;
    log_2 |= f << 61n;
    r = r >> f;
  }
  {
    r = (r * r) >> 127n;
    const f = r >> 128n;
    log_2 |= f << 60n;
    r = r >> f;
  }
  {
    r = (r * r) >> 127n;
    const f = r >> 128n;
    log_2 |= f << 59n;
    r = r >> f;
  }
  {
    r = (r * r) >> 127n;
    const f = r >> 128n;
    log_2 |= f << 58n;
    r = r >> f;
  }
  {
    r = (r * r) >> 127n;
    const f = r >> 128n;
    log_2 |= f << 57n;
    r = r >> f;
  }
  {
    r = (r * r) >> 127n;
    const f = r >> 128n;
    log_2 |= f << 56n;
    r = r >> f;
  }
  {
    r = (r * r) >> 127n;
    const f = r >> 128n;
    log_2 |= f << 55n;
    r = r >> f;
  }
  {
    r = (r * r) >> 127n;
    const f = r >> 128n;
    log_2 |= f << 54n;
    r = r >> f;
  }
  {
    r = (r * r) >> 127n;
    const f = r >> 128n;
    log_2 |= f << 53n;
    r = r >> f;
  }
  {
    r = (r * r) >> 127n;
    const f = r >> 128n;
    log_2 |= f << 52n;
    r = r >> f;
  }
  {
    r = (r * r) >> 127n;
    const f = r >> 128n;
    log_2 |= f << 51n;
    r = r >> f;
  }
  {
    r = (r * r) >> 127n;
    const f = r >> 128n;
    log_2 |= f << 50n;
    r = r >> f;
  }

  const log_sqrt10001 = log_2 * 255738958999603826347141n; // 128.128 number

  const tickLow =
    (log_sqrt10001 - 3402992956809132418596140100660247210n) >> 128n;
  const tickHi =
    (log_sqrt10001 + 291339464771989622907027621153398088495n) >> 128n;

  return tickLow === tickHi
    ? createUniswapV3Tick(Number(tickLow))
    : !fractionGreaterThan(
        getSqrtRatioAtTick(createUniswapV3Tick(Number(tickHi))),
        sqrtRatio,
      )
    ? createUniswapV3Tick(Number(tickHi))
    : createUniswapV3Tick(Number(tickLow));
};
