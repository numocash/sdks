import {
  type BaseERC20,
  type ERC20Amount,
  type Fraction,
  amountAdd,
  amountMultiply,
  createAmountFromRaw,
  createFraction,
  createPriceFromFraction,
  fractionAdd,
  fractionEqualTo,
  fractionMultiply,
  fractionQuotient,
  fractionSubtract,
  rawPrice,
} from "reverse-mirage";
import invariant from "tiny-invariant";
import type { Address } from "viem";
import { MAX_TICK, MIN_TICK } from "./constants.js";
import {
  computeSwapStep,
  getAmount0Delta,
  getAmount1Delta,
  getFeeGrowthInside,
  getSqrtRatioAtTick,
  getTickAtSqrtRatio,
} from "./math.js";
import type { TickSpacing, UniswapV3PoolData, UniswapV3Tick } from "./types.js";
import { createPosition, createTick, getPositionID } from "./utils.js";

export const calculateMint = (
  poolData: UniswapV3PoolData,
  to: Address,
  tickLower: UniswapV3Tick,
  tickUpper: UniswapV3Tick,
  liquidity: bigint,
): readonly [ERC20Amount<BaseERC20>, ERC20Amount<BaseERC20>] => {
  updatePosition(poolData, to, tickLower, tickUpper, liquidity);

  return liquidityAmounts(poolData, tickLower, tickUpper, liquidity);
};

export const calculateBurn = (
  poolData: UniswapV3PoolData,
  from: Address,
  tickLower: UniswapV3Tick,
  tickUpper: UniswapV3Tick,
  liquidity: bigint,
) => {
  updatePosition(poolData, from, tickLower, tickUpper, -liquidity);

  const amounts = liquidityAmounts(poolData, tickLower, tickUpper, -liquidity);

  return [
    amountMultiply(amounts[0], -1),
    amountMultiply(amounts[1], -1),
  ] as const;
};

type SwapState = {
  amountSpecifiedRemaining: bigint;
  amountCalculated: bigint;
  sqrtRatio: Fraction;
  tick: UniswapV3Tick;
  feeGrowthGlobal: Fraction;
  protocolFee: ERC20Amount<BaseERC20>;
};

export const calculateSwap = (
  poolData: UniswapV3PoolData,
  amountSpecified: ERC20Amount<BaseERC20>,
): [ERC20Amount<BaseERC20>, ERC20Amount<BaseERC20>] => {
  invariant(amountSpecified.amount !== 0n);
  const zeroForOne =
    (amountSpecified.token === poolData.uniswapV3Pool.token0) ===
    amountSpecified.amount > 0n;

  const state: SwapState = {
    amountSpecifiedRemaining: amountSpecified.amount,
    amountCalculated: 0n,
    sqrtRatio: rawPrice(poolData.sqrtPrice),
    tick: poolData.tick,
    feeGrowthGlobal: zeroForOne ? poolData.feeGrowth0 : poolData.feeGrowth1,
    protocolFee: zeroForOne ? poolData.protocolFees0 : poolData.protocolFees1,
  };

  while (state.amountSpecifiedRemaining !== 0n) {
    const [tickNext, initialized] = nextInitializedTickWithinOneWord(
      poolData.tickBitmap,
      state.tick,
      poolData.uniswapV3Pool.tickSpacing,
      zeroForOne,
    );

    if (tickNext.tick < MIN_TICK) {
      tickNext.tick = MIN_TICK;
    } else if (tickNext.tick > MAX_TICK) {
      tickNext.tick = MAX_TICK;
    }

    const sqrtRatioNextTick = getSqrtRatioAtTick(tickNext);

    const { sqrtRatioNext, amountIn, amountOut, feeAmount } = computeSwapStep(
      state.sqrtRatio,
      sqrtRatioNextTick,
      zeroForOne,
      poolData.liquidity,
      state.amountSpecifiedRemaining,
      poolData.uniswapV3Pool.feeTier,
    );

    state.sqrtRatio = sqrtRatioNext;

    if (amountSpecified.amount > 0n) {
      state.amountSpecifiedRemaining -= amountIn + feeAmount;
      state.amountCalculated -= amountOut;
    } else {
      state.amountSpecifiedRemaining += amountOut;
      state.amountCalculated += amountIn + feeAmount;
    }

    // update protocol fee

    // update global fee tracker
    if (poolData.liquidity > 0n)
      state.feeGrowthGlobal = fractionAdd(
        state.feeGrowthGlobal,
        createFraction(feeAmount, poolData.liquidity),
      );

    // update liquidity by going to next tick
    if (fractionEqualTo(state.sqrtRatio, sqrtRatioNextTick)) {
      if (initialized) {
        // subtract liquidity net
        const liquidityNet = poolData.ticks[tickNext.tick]!.liquidityNet;
        // todo: cross ticks

        poolData.liquidity += zeroForOne ? -liquidityNet : liquidityNet;
      }

      state.tick = zeroForOne ? createTick(tickNext.tick - 1) : tickNext;
    } else {
      state.tick = getTickAtSqrtRatio(state.sqrtRatio);
    }
  }

  // update price
  poolData.sqrtPrice = createPriceFromFraction(
    poolData.uniswapV3Pool.token1,
    poolData.uniswapV3Pool.token0,
    state.sqrtRatio,
  );

  // update fee growth
  if (zeroForOne) {
    poolData.feeGrowth0 = state.feeGrowthGlobal;
    poolData.protocolFees0 = amountAdd(
      poolData.protocolFees0,
      state.protocolFee,
    );
  } else {
    poolData.feeGrowth1 = state.feeGrowthGlobal;
    poolData.protocolFees1 = amountAdd(
      poolData.protocolFees1,
      state.protocolFee,
    );
  }

  return amountSpecified.token === poolData.uniswapV3Pool.token0
    ? [
        createAmountFromRaw(
          poolData.uniswapV3Pool.token0,
          amountSpecified.amount - state.amountSpecifiedRemaining,
        ),
        createAmountFromRaw(
          poolData.uniswapV3Pool.token1,
          state.amountCalculated,
        ),
      ]
    : [
        createAmountFromRaw(
          poolData.uniswapV3Pool.token0,
          state.amountCalculated,
        ),
        createAmountFromRaw(
          poolData.uniswapV3Pool.token1,
          amountSpecified.amount - state.amountSpecifiedRemaining,
        ),
      ];
};

const liquidityAmounts = (
  poolData: UniswapV3PoolData,
  tickLower: UniswapV3Tick,
  tickUpper: UniswapV3Tick,
  liquidity: bigint,
): readonly [ERC20Amount<BaseERC20>, ERC20Amount<BaseERC20>] => {
  invariant(tickUpper.tick > tickLower.tick);

  if (liquidity !== 0n) {
    if (poolData.tick.tick < tickLower.tick) {
      return [
        createAmountFromRaw(
          poolData.uniswapV3Pool.token0,
          getAmount0Delta(
            getSqrtRatioAtTick(tickLower),
            getSqrtRatioAtTick(tickUpper),
            liquidity,
          ),
        ),
        createAmountFromRaw(poolData.uniswapV3Pool.token1, 0n),
      ] as const;
    } else if (poolData.tick.tick < tickUpper.tick) {
      poolData.liquidity += liquidity;

      return [
        createAmountFromRaw(
          poolData.uniswapV3Pool.token0,
          getAmount0Delta(
            rawPrice(poolData.sqrtPrice),
            getSqrtRatioAtTick(tickUpper),
            liquidity,
          ),
        ),
        createAmountFromRaw(
          poolData.uniswapV3Pool.token1,
          getAmount1Delta(
            getSqrtRatioAtTick(tickLower),
            rawPrice(poolData.sqrtPrice),
            liquidity,
          ),
        ),
      ] as const;
    } else {
      return [
        createAmountFromRaw(poolData.uniswapV3Pool.token0, 0n),

        createAmountFromRaw(
          poolData.uniswapV3Pool.token1,
          getAmount0Delta(
            getSqrtRatioAtTick(tickLower),
            getSqrtRatioAtTick(tickUpper),
            liquidity,
          ),
        ),
      ] as const;
    }
  } else {
    return [
      createAmountFromRaw(poolData.uniswapV3Pool.token0, 0n),
      createAmountFromRaw(poolData.uniswapV3Pool.token1, 0n),
    ] as const;
  }
};

const updatePosition = (
  poolData: UniswapV3PoolData,
  owner: Address,
  tickLower: UniswapV3Tick,
  tickUpper: UniswapV3Tick,
  liquidity: bigint,
) => {
  if (liquidity !== 0n) {
    updateTick(poolData, tickLower, liquidity, false);
    updateTick(poolData, tickUpper, liquidity, true);
  }

  const [feeGrowthInside0, feeGrowthInside1] = getFeeGrowthInside(
    poolData,
    poolData.ticks[tickLower.tick]!,
    poolData.ticks[tickUpper.tick]!,
  );

  const position = createPosition(
    poolData.uniswapV3Pool,
    owner,
    tickLower,
    tickUpper,
  );

  if (poolData.positions[getPositionID(position)] === undefined)
    poolData.positions[getPositionID(position)] = {
      type: "uniswapV3PositionData",
      position,
      feeGrowthInside0,
      feeGrowthInside1,
      tokensOwed0: createAmountFromRaw(poolData.uniswapV3Pool.token0, 0n),
      tokensOwed1: createAmountFromRaw(poolData.uniswapV3Pool.token1, 0n),
      liquidity: 0n,
    };

  const liquidityNext =
    poolData.positions[getPositionID(position)]!.liquidity + liquidity;

  const tokensOwed0 = fractionQuotient(
    fractionMultiply(
      fractionSubtract(
        feeGrowthInside0,
        poolData.positions[getPositionID(position)]!.feeGrowthInside0,
      ),
      poolData.positions[getPositionID(position)]!.liquidity,
    ),
  );

  const tokensOwed1 = fractionQuotient(
    fractionMultiply(
      fractionSubtract(
        feeGrowthInside1,
        poolData.positions[getPositionID(position)]!.feeGrowthInside1,
      ),
      poolData.positions[getPositionID(position)]!.liquidity,
    ),
  );

  poolData.positions[getPositionID(position)]!.liquidity = liquidityNext;
  poolData.positions[getPositionID(position)]!.feeGrowthInside0 =
    feeGrowthInside0;
  poolData.positions[getPositionID(position)]!.feeGrowthInside1 =
    feeGrowthInside1;
  poolData.positions[getPositionID(position)]!.tokensOwed0 = amountAdd(
    poolData.positions[getPositionID(position)]!.tokensOwed0,
    tokensOwed0,
  );
  poolData.positions[getPositionID(position)]!.tokensOwed1 = amountAdd(
    poolData.positions[getPositionID(position)]!.tokensOwed1,
    tokensOwed1,
  );
};

const updateTick = (
  poolData: UniswapV3PoolData,
  tick: UniswapV3Tick,
  liquidity: bigint,
  upper: boolean,
) => {
  if (poolData.ticks[tick.tick] === undefined)
    poolData.ticks[tick.tick] = {
      type: "uniswapV3TickData",
      tick,
      feeGrowthOutside0: createFraction(0),
      feeGrowthOutside1: createFraction(0),
      liquidityGross: 0n,
      liquidityNet: 0n,
    };

  const liquidityGrossBefore = poolData.ticks[tick.tick]!.liquidityGross;
  const liquidityGrossAfter = liquidityGrossBefore + liquidity;

  // TODO: check max liquidity

  if (liquidityGrossBefore === 0n && tick.tick <= poolData.tick.tick) {
    poolData.ticks[tick.tick]!.feeGrowthOutside0 = poolData.feeGrowth0;
    poolData.ticks[tick.tick]!.feeGrowthOutside1 = poolData.feeGrowth1;
  }

  poolData.ticks[tick.tick]!.liquidityGross = liquidityGrossAfter;

  poolData.ticks[tick.tick]!.liquidityNet = upper
    ? poolData.ticks[tick.tick]!.liquidityNet - liquidity
    : poolData.ticks[tick.tick]!.liquidityNet + liquidity;
};

const nextInitializedTickWithinOneWord = (
  tickBitmap: UniswapV3PoolData["tickBitmap"],
  tick: UniswapV3Tick,
  tickSpacing: TickSpacing,
  lte: boolean,
) => {
  let compressed = tick.tick / tickSpacing;
  if (tick.tick < 0 && tick.tick % tickSpacing !== 0) compressed--;

  if (lte) {
    const word = compressed >> 8;
    const bit = compressed % 256;

    invariant(tickBitmap[word] !== undefined);
    const mask = (1n << BigInt(bit)) - 1n + (1n << BigInt(bit));
    const masked = tickBitmap[word]! & mask;

    const initialized = masked !== 0n;

    return [
      initialized
        ? createTick(
            (compressed - (bit - mostSignificantBit(masked))) * tickSpacing,
          )
        : createTick((compressed - bit) * tickSpacing),
      initialized,
    ] as const;
  } else {
    const word = (compressed + 1) >> 8;
    const bit = (compressed + 1) % 256;

    invariant(tickBitmap[word] !== undefined);
    const mask = ~((1n << BigInt(bit)) - 1n);
    const masked = tickBitmap[word]! & mask;

    const initialized = masked !== 0n;

    return [
      initialized
        ? createTick(
            (compressed + 1 + leastSignificantBit(masked) - bit) * tickSpacing,
          )
        : createTick((compressed + 1 + 255 - bit) * tickSpacing),
      initialized,
    ] as const;
  }
};

const mostSignificantBit = (y: bigint): number => {
  invariant(y > 0n);

  let x = y;
  let r = 0;

  if (x >= 0x100000000000000000000000000000000) {
    x >>= 128n;
    r += 128;
  }
  if (x >= 0x10000000000000000) {
    x >>= 64n;
    r += 64;
  }
  if (x >= 0x100000000) {
    x >>= 32n;
    r += 32;
  }
  if (x >= 0x10000) {
    x >>= 16n;
    r += 16;
  }
  if (x >= 0x100) {
    x >>= 8n;
    r += 8;
  }
  if (x >= 0x10) {
    x >>= 4n;
    r += 4;
  }
  if (x >= 0x4) {
    x >>= 2n;
    r += 2;
  }
  if (x >= 0x2) r += 1;

  return r;
};

const leastSignificantBit = (y: bigint): number => {
  invariant(y > 0);

  let x = y;
  let r = 255;

  if ((x & (2n ** 128n - 1n)) > 0) {
    r -= 128;
  } else {
    x >>= 128n;
  }
  if ((x & (2n ** 64n - 1n)) > 0) {
    r -= 64;
  } else {
    x >>= 64n;
  }
  if ((x & (2n ** 32n - 1n)) > 0) {
    r -= 32;
  } else {
    x >>= 32n;
  }
  if ((x & (2n ** 16n - 1n)) > 0) {
    r -= 16;
  } else {
    x >>= 16n;
  }
  if ((x & (2n ** 8n - 1n)) > 0) {
    r -= 8;
  } else {
    x >>= 8n;
  }
  if ((x & 0xfn) > 0) {
    r -= 4;
  } else {
    x >>= 4n;
  }
  if ((x & 0x3n) > 0) {
    r -= 2;
  } else {
    x >>= 2n;
  }
  if ((x & 0x1n) > 0) r -= 1;

  return r;
};
