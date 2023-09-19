import {
  type Fraction,
  createFraction,
  fractionEqualTo,
  fractionGreaterThan,
  fractionLessThan,
  fractionSubtract,
} from "reverse-mirage";
import invariant from "tiny-invariant";
import { MAX_SQRT_PRICE, MIN_SQRT_PRICE, Q96, Q128 } from "./constants.js";
import type {
  UniswapV3PoolData,
  UniswapV3Tick,
  UniswapV3TickData,
} from "./types.js";
import { createTick, fractionToQ96, q96ToFraction } from "./utils.js";

export const getFeeGrowthInside = (
  poolData: Pick<UniswapV3PoolData, "feeGrowth0" | "feeGrowth1" | "tick">,
  tickLower: UniswapV3TickData,
  tickUpper: UniswapV3TickData,
) => {
  const [feeGrowthBelow0, feeGrowthBelow1] =
    poolData.tick.tick >= tickUpper.tick.tick
      ? [tickLower.feeGrowthOutside0, tickLower.feeGrowthOutside1]
      : [
          fractionSubtract(poolData.feeGrowth0, tickLower.feeGrowthOutside0),
          fractionSubtract(poolData.feeGrowth1, tickLower.feeGrowthOutside1),
        ];

  const [feeGrowthAbove0, feeGrowthAbove1] =
    poolData.tick.tick < tickUpper.tick.tick
      ? [tickUpper.feeGrowthOutside0, tickUpper.feeGrowthOutside1]
      : [
          fractionSubtract(poolData.feeGrowth0, tickUpper.feeGrowthOutside0),
          fractionSubtract(poolData.feeGrowth1, tickUpper.feeGrowthOutside1),
        ];

  return [
    fractionSubtract(
      fractionSubtract(poolData.feeGrowth0, feeGrowthBelow0),
      feeGrowthAbove0,
    ),
    fractionSubtract(
      fractionSubtract(poolData.feeGrowth1, feeGrowthBelow1),
      feeGrowthAbove1,
    ),
  ] as const;
};

export const getSqrtRatioAtTick = (tick: UniswapV3Tick): Fraction => {
  const x = tick.tick < 0 ? -tick.tick : tick.tick;
  let ratioX128: bigint = Q128;

  if ((x & 0x1) > 0)
    ratioX128 = (ratioX128 * 0xfffcb933bd6fad37aa2d162d1a594001n) >> 128n;
  if ((x & 0x2) > 0)
    ratioX128 = (ratioX128 * 0xfff97272373d413259a46990580e213an) >> 128n;
  if ((x & 0x4) > 0)
    ratioX128 = (ratioX128 * 0xfff2e50f5f656932ef12357cf3c7fdccn) >> 128n;
  if ((x & 0x8) > 0)
    ratioX128 = (ratioX128 * 0xffe5caca7e10e4e61c3624eaa0941cd0n) >> 128n;
  if ((x & 0x10) > 0)
    ratioX128 = (ratioX128 * 0xffcb9843d60f6159c9db58835c926644n) >> 128n;
  if ((x & 0x20) > 0)
    ratioX128 = (ratioX128 * 0xff973b41fa98c081472e6896dfb254c0n) >> 128n;
  if ((x & 0x40) > 0)
    ratioX128 = (ratioX128 * 0xff2ea16466c96a3843ec78b326b52861n) >> 128n;
  if ((x & 0x80) > 0)
    ratioX128 = (ratioX128 * 0xfe5dee046a99a2a811c461f1969c3053n) >> 128n;
  if ((x & 0x100) > 0)
    ratioX128 = (ratioX128 * 0xfcbe86c7900a88aedcffc83b479aa3a4n) >> 128n;
  if ((x & 0x200) > 0)
    ratioX128 = (ratioX128 * 0xf987a7253ac413176f2b074cf7815e54n) >> 128n;
  if ((x & 0x400) > 0)
    ratioX128 = (ratioX128 * 0xf3392b0822b70005940c7a398e4b70f3n) >> 128n;
  if ((x & 0x800) > 0)
    ratioX128 = (ratioX128 * 0xe7159475a2c29b7443b29c7fa6e889d9n) >> 128n;
  if ((x & 0x1000) > 0)
    ratioX128 = (ratioX128 * 0xd097f3bdfd2022b8845ad8f792aa5825n) >> 128n;
  if ((x & 0x2000) > 0)
    ratioX128 = (ratioX128 * 0xa9f746462d870fdf8a65dc1f90e061e5n) >> 128n;
  if ((x & 0x4000) > 0)
    ratioX128 = (ratioX128 * 0x70d869a156d2a1b890bb3df62baf32f7n) >> 128n;
  if ((x & 0x8000) > 0)
    ratioX128 = (ratioX128 * 0x31be135f97d08fd981231505542fcfa6n) >> 128n;
  if ((x & 0x10000) > 0)
    ratioX128 = (ratioX128 * 0x9aa508b5b7a84e1c677de54f3e99bc9n) >> 128n;
  if ((x & 0x20000) > 0)
    ratioX128 = (ratioX128 * 0x5d6af8dedb81196699c329225ee604n) >> 128n;
  if ((x & 0x40000) > 0)
    ratioX128 = (ratioX128 * 0x2216e584f5fa1ea926041bedfe98n) >> 128n;
  if ((x & 0x80000) > 0)
    ratioX128 = (ratioX128 * 0x48a170391f7dc42444e8fa2n) >> 128n;
  // Stop computation here since |strike| < 2**20

  // Inverse r since base = 1/1.0001
  if (tick.tick > 0) ratioX128 = (2n ** 256n - 1n) / ratioX128;

  // down cast to Q96 and round up
  return createFraction(
    (ratioX128 >> 32n) + (ratioX128 % (1n << 32n) === 0n ? 0n : 1n),
    Q96,
  );
};

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
    ? createTick(Number(tickLow))
    : !fractionGreaterThan(
        getSqrtRatioAtTick(createTick(Number(tickHi))),
        sqrtRatio,
      )
    ? createTick(Number(tickHi))
    : createTick(Number(tickLow));
};

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

export const getNextSqrtPriceFromInput = (
  sqrtPrice: Fraction,
  liquidity: bigint,
  amountIn: bigint,
  zeroForOne: boolean,
) => {
  invariant(fractionGreaterThan(sqrtPrice, 0));
  invariant(liquidity > 0n);

  return zeroForOne
    ? getNextSqrtPriceFromAmount0RoundingUp(
        sqrtPrice,
        liquidity,
        amountIn,
        true,
      )
    : getNextSqrtPriceFromAmount1RoundingDown(
        sqrtPrice,
        liquidity,
        amountIn,
        true,
      );
};

export const getNextSqrtPriceFromOutput = (
  sqrtPrice: Fraction,
  liquidity: bigint,
  amountOut: bigint,
  zeroForOne: boolean,
) => {
  invariant(fractionGreaterThan(sqrtPrice, 0));
  invariant(liquidity > 0n);

  return zeroForOne
    ? getNextSqrtPriceFromAmount1RoundingDown(
        sqrtPrice,
        liquidity,
        amountOut,
        false,
      )
    : getNextSqrtPriceFromAmount0RoundingUp(
        sqrtPrice,
        liquidity,
        amountOut,
        false,
      );
};

const getAmount0DeltaRound = (
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

const getAmount1DeltaRound = (
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

export const getAmount0Delta = (
  sqrtPriceA: Fraction,
  sqrtPriceB: Fraction,
  liquidity: bigint,
): bigint =>
  liquidity < 0n
    ? -getAmount0DeltaRound(sqrtPriceA, sqrtPriceB, -liquidity, false)
    : getAmount0DeltaRound(sqrtPriceA, sqrtPriceB, liquidity, true);

export const getAmount1Delta = (
  sqrtPriceA: Fraction,
  sqrtPriceB: Fraction,
  liquidity: bigint,
): bigint =>
  liquidity < 0n
    ? -getAmount1DeltaRound(sqrtPriceA, sqrtPriceB, -liquidity, false)
    : getAmount1DeltaRound(sqrtPriceA, sqrtPriceB, liquidity, true);

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
