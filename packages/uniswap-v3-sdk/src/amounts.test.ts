import { CurrencyAmount } from "@uniswap/sdk-core";
import { FeeAmount, Pool, Tick } from "@uniswap/v3-sdk";
import {
  createAmountFromRaw,
  createAmountFromString,
  createFraction,
  createPriceFromFraction,
  rawPrice,
} from "reverse-mirage";
import { zeroAddress } from "viem";
import { expect, test } from "vitest";
import { token0, token1, uniToken0, uniToken1 } from "./_test/constants.js";
import { calculateBurn, calculateMint, calculateSwap } from "./amounts.js";
import { Q96 } from "./constants.js";
import type { UniswapV3PoolData } from "./types.js";
import {
  createPosition,
  createTick,
  createUniswapV3Pool,
  fractionToQ96,
  getPositionID,
  q96ToFraction,
} from "./utils.js";

const uniswapV3Pool = createUniswapV3Pool(token0, token1, 100, zeroAddress);

test("mint", () => {
  const poolData: UniswapV3PoolData = {
    type: "uniswapV3PoolData",
    uniswapV3Pool,
    liquidity: 0n,
    feeGrowth0: createFraction(0),
    feeGrowth1: createFraction(0),
    sqrtPrice: createPriceFromFraction(
      uniswapV3Pool.token1,
      uniswapV3Pool.token0,
      q96ToFraction(Q96),
    ),
    tick: createTick(0),
    feeProtocol: createFraction(0),
    ticks: {},
    positions: {},
    tickBitmap: {},
    protocolFees0: createAmountFromRaw(uniswapV3Pool.token0, 0n),
    protocolFees1: createAmountFromRaw(uniswapV3Pool.token1, 0n),
  };

  const [_, amount1] = calculateMint(
    poolData,
    zeroAddress,
    createTick(0),
    createTick(1),
    10n ** 18n,
  );

  expect(amount1.amount).toBe(0n);
  expect(poolData.liquidity).toBe(10n ** 18n);
  expect(poolData.ticks[0]).toBeTruthy();
  expect(poolData.ticks[1]).toBeTruthy();
  expect(poolData.ticks[0]!.liquidityGross).toBe(10n ** 18n);
  expect(poolData.ticks[1]!.liquidityGross).toBe(10n ** 18n);
  expect(poolData.ticks[0]!.liquidityNet).toBe(10n ** 18n);
  expect(poolData.ticks[1]!.liquidityNet).toBe(-1n * 10n ** 18n);
  expect(
    poolData.positions[
      getPositionID(
        createPosition(
          uniswapV3Pool,
          zeroAddress,
          createTick(0),
          createTick(1),
        ),
      )
    ],
  ).toBeTruthy();
  expect(
    poolData.positions[
      getPositionID(
        createPosition(
          uniswapV3Pool,
          zeroAddress,
          createTick(0),
          createTick(1),
        ),
      )
    ]!.liquidity,
  ).toBe(10n ** 18n);
});

test("burn", () => {
  const poolData: UniswapV3PoolData = {
    type: "uniswapV3PoolData",
    uniswapV3Pool,
    liquidity: 0n,
    feeGrowth0: createFraction(0),
    feeGrowth1: createFraction(0),
    sqrtPrice: createPriceFromFraction(
      uniswapV3Pool.token1,
      uniswapV3Pool.token0,
      q96ToFraction(Q96),
    ),
    tick: createTick(0),
    feeProtocol: createFraction(0),
    ticks: {},
    positions: {},
    tickBitmap: {},
    protocolFees0: createAmountFromRaw(uniswapV3Pool.token0, 0n),
    protocolFees1: createAmountFromRaw(uniswapV3Pool.token1, 0n),
  };

  calculateMint(
    poolData,
    zeroAddress,
    createTick(0),
    createTick(1),
    10n ** 18n,
  );

  const [_, amount1] = calculateBurn(
    poolData,
    zeroAddress,
    createTick(0),
    createTick(1),
    10n ** 18n,
  );

  // expect(amount0.amount).toBe(999900007499375055n - 1n);
  expect(amount1.amount).toBe(0n);
  expect(poolData.liquidity).toBe(0n);
  expect(poolData.ticks[0]).toBeTruthy();
  expect(poolData.ticks[1]).toBeTruthy();
  expect(poolData.ticks[0]!.liquidityGross).toBe(0n);
  expect(poolData.ticks[1]!.liquidityGross).toBe(0n);
  expect(poolData.ticks[0]!.liquidityNet).toBe(0n);
  expect(poolData.ticks[1]!.liquidityNet).toBe(0n);
  expect(
    poolData.positions[
      getPositionID(
        createPosition(
          uniswapV3Pool,
          zeroAddress,
          createTick(0),
          createTick(1),
        ),
      )
    ],
  ).toBeTruthy();
  expect(
    poolData.positions[
      getPositionID(
        createPosition(
          uniswapV3Pool,
          zeroAddress,
          createTick(0),
          createTick(1),
        ),
      )
    ]!.liquidity,
  ).toBe(0n);
});

test("single tick swap", async () => {
  const poolData: UniswapV3PoolData = {
    type: "uniswapV3PoolData",
    uniswapV3Pool,
    liquidity: 0n,
    feeGrowth0: createFraction(0),
    feeGrowth1: createFraction(0),
    sqrtPrice: createPriceFromFraction(
      uniswapV3Pool.token1,
      uniswapV3Pool.token0,
      q96ToFraction(Q96),
    ),
    tick: createTick(0),
    feeProtocol: createFraction(0),
    ticks: {},
    positions: {},
    tickBitmap: { [0]: 3n },
    protocolFees0: createAmountFromRaw(uniswapV3Pool.token0, 0n),
    protocolFees1: createAmountFromRaw(uniswapV3Pool.token1, 0n),
  };
  const uniPool = new Pool(
    uniToken0,
    uniToken1,
    FeeAmount.LOWEST,
    "0x1000000000000000000000000",
    "1000000000000000000",
    0,
    [
      new Tick({
        index: 0,
        liquidityGross: "1000000000000000000",
        liquidityNet: "1000000000000000000",
      }),
      new Tick({
        index: 1,
        liquidityGross: "1000000000000000000",
        liquidityNet: "-1000000000000000000",
      }),
    ],
  );

  calculateMint(
    poolData,
    zeroAddress,
    createTick(0),
    createTick(1),
    10n ** 18n,
  );

  const [amount0, amount1] = calculateSwap(
    poolData,
    createAmountFromString(token0, "-0.000005"),
  );

  const [uniAmount1, up] = await uniPool.getInputAmount(
    CurrencyAmount.fromFractionalAmount(uniToken0, "5000000000000", "1"),
  );

  expect(amount0.amount).toBe(-5n * 10n ** 12n);
  expect(amount1.amount).toBe(BigInt(uniAmount1.asFraction.toFixed(0)));
  expect(poolData.liquidity).toBe(BigInt(up.liquidity.toString()));
  expect(fractionToQ96(rawPrice(poolData.sqrtPrice))).toBe(
    BigInt(up.sqrtRatioX96.toString()),
  );
});

test("multi tick swap", async () => {
  const poolData: UniswapV3PoolData = {
    type: "uniswapV3PoolData",
    uniswapV3Pool,
    liquidity: 0n,
    feeGrowth0: createFraction(0),
    feeGrowth1: createFraction(0),
    sqrtPrice: createPriceFromFraction(
      uniswapV3Pool.token1,
      uniswapV3Pool.token0,
      q96ToFraction(Q96),
    ),
    tick: createTick(0),
    feeProtocol: createFraction(0),
    ticks: {},
    positions: {},
    tickBitmap: { [0]: 7n },
    protocolFees0: createAmountFromRaw(uniswapV3Pool.token0, 0n),
    protocolFees1: createAmountFromRaw(uniswapV3Pool.token1, 0n),
  };

  calculateMint(
    poolData,
    zeroAddress,
    createTick(0),
    createTick(1),
    10n ** 18n,
  );
  calculateMint(
    poolData,
    zeroAddress,
    createTick(0),
    createTick(2),
    10n ** 18n,
  );

  const uniPool = new Pool(
    uniToken0,
    uniToken1,
    FeeAmount.LOWEST,
    "0x1000000000000000000000000",
    "2000000000000000000",
    0,
    [
      new Tick({
        index: 0,
        liquidityGross: "2000000000000000000",
        liquidityNet: "2000000000000000000",
      }),
      new Tick({
        index: 1,
        liquidityGross: "1000000000000000000",
        liquidityNet: "-1000000000000000000",
      }),
      new Tick({
        index: 2,
        liquidityGross: "1000000000000000000",
        liquidityNet: "-1000000000000000000",
      }),
    ],
  );

  const [amount0, amount1] = calculateSwap(
    poolData,
    createAmountFromString(token0, "-0.00014"),
  );

  const [uniAmount1, up] = await uniPool.getInputAmount(
    CurrencyAmount.fromFractionalAmount(uniToken0, "140000000000000", "1"),
  );

  expect(amount0.amount).toBe(-140000000000000n);
  expect(amount1.amount).toBe(BigInt(uniAmount1.asFraction.toFixed(0)));
  expect(poolData.liquidity).toBe(BigInt(up.liquidity.toString()));
  expect(fractionToQ96(rawPrice(poolData.sqrtPrice))).toBe(
    BigInt(up.sqrtRatioX96.toString()),
  );
});

test("far tick swap", async () => {
  const poolData: UniswapV3PoolData = {
    type: "uniswapV3PoolData",
    uniswapV3Pool,
    liquidity: 0n,
    feeGrowth0: createFraction(0),
    feeGrowth1: createFraction(0),
    sqrtPrice: createPriceFromFraction(
      uniswapV3Pool.token1,
      uniswapV3Pool.token0,
      q96ToFraction(Q96),
    ),
    tick: createTick(0),
    feeProtocol: createFraction(0),
    ticks: {},
    positions: {},
    tickBitmap: { [0]: (1n << 0n) | (1n << 1n) | (1n << 200n) | (1n << 201n) },
    protocolFees0: createAmountFromRaw(uniswapV3Pool.token0, 0n),
    protocolFees1: createAmountFromRaw(uniswapV3Pool.token1, 0n),
  };

  calculateMint(
    poolData,
    zeroAddress,
    createTick(0),
    createTick(1),
    10n ** 18n,
  );
  calculateMint(
    poolData,
    zeroAddress,
    createTick(200),
    createTick(201),
    10n ** 18n,
  );

  const uniPool = new Pool(
    uniToken0,
    uniToken1,
    FeeAmount.LOWEST,
    "0x1000000000000000000000000",
    "1000000000000000000",
    0,
    [
      new Tick({
        index: 0,
        liquidityGross: "1000000000000000000",
        liquidityNet: "1000000000000000000",
      }),
      new Tick({
        index: 1,
        liquidityGross: "1000000000000000000",
        liquidityNet: "-1000000000000000000",
      }),
      new Tick({
        index: 200,
        liquidityGross: "1000000000000000000",
        liquidityNet: "1000000000000000000",
      }),
      new Tick({
        index: 201,
        liquidityGross: "1000000000000000000",
        liquidityNet: "-1000000000000000000",
      }),
    ],
  );

  const [amount0, amount1] = calculateSwap(
    poolData,
    createAmountFromString(token0, "-0.00008"),
  );

  const [uniAmount1, up] = await uniPool.getInputAmount(
    CurrencyAmount.fromFractionalAmount(uniToken0, "80000000000000", "1"),
  );

  expect(amount0.amount).toBe(-80000000000000n);
  expect(amount1.amount).toBe(BigInt(uniAmount1.asFraction.toFixed(0)));
  expect(poolData.liquidity).toBe(BigInt(up.liquidity.toString()));
  expect(fractionToQ96(rawPrice(poolData.sqrtPrice))).toBe(
    BigInt(up.sqrtRatioX96.toString()),
  );
});
