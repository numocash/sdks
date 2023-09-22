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
import { token0, token1, uniToken0, uniToken1 } from "../_test/constants.js";
import type { UniswapV3PoolData } from "../types/uniswapV3Pool.js";
import { calculateUniswapV3PoolMint } from "./calculateUniswapV3PoolMint.js";
import { calculateUniswapV3PoolSwap } from "./calculateUniswapV3PoolSwap.js";
import { Q96 } from "./constants.js";
import { createUniswapV3Pool } from "./createUniswapV3Pool.js";
import { createUniswapV3Tick } from "./createUniswapV3Tick.js";
import { fractionToQ96 } from "./fractionToQ96.js";
import { q96ToFraction } from "./q96ToFraction.js";

const uniswapV3Pool = createUniswapV3Pool(token0, token1, 100, zeroAddress);

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
    tick: createUniswapV3Tick(0),
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

  calculateUniswapV3PoolMint(
    poolData,
    zeroAddress,
    createUniswapV3Tick(0),
    createUniswapV3Tick(1),
    10n ** 18n,
  );

  const [amount0, amount1] = calculateUniswapV3PoolSwap(
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
    tick: createUniswapV3Tick(0),
    feeProtocol: createFraction(0),
    ticks: {},
    positions: {},
    tickBitmap: { [0]: 7n },
    protocolFees0: createAmountFromRaw(uniswapV3Pool.token0, 0n),
    protocolFees1: createAmountFromRaw(uniswapV3Pool.token1, 0n),
  };

  calculateUniswapV3PoolMint(
    poolData,
    zeroAddress,
    createUniswapV3Tick(0),
    createUniswapV3Tick(1),
    10n ** 18n,
  );
  calculateUniswapV3PoolMint(
    poolData,
    zeroAddress,
    createUniswapV3Tick(0),
    createUniswapV3Tick(2),
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

  const [amount0, amount1] = calculateUniswapV3PoolSwap(
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
    tick: createUniswapV3Tick(0),
    feeProtocol: createFraction(0),
    ticks: {},
    positions: {},
    tickBitmap: { [0]: (1n << 0n) | (1n << 1n) | (1n << 200n) | (1n << 201n) },
    protocolFees0: createAmountFromRaw(uniswapV3Pool.token0, 0n),
    protocolFees1: createAmountFromRaw(uniswapV3Pool.token1, 0n),
  };

  calculateUniswapV3PoolMint(
    poolData,
    zeroAddress,
    createUniswapV3Tick(0),
    createUniswapV3Tick(1),
    10n ** 18n,
  );
  calculateUniswapV3PoolMint(
    poolData,
    zeroAddress,
    createUniswapV3Tick(200),
    createUniswapV3Tick(201),
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

  const [amount0, amount1] = calculateUniswapV3PoolSwap(
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
