import {
  createAmountFromRaw,
  createFraction,
  createPriceFromFraction,
} from "reverse-mirage";
import { zeroAddress } from "viem";
import { expect, test } from "vitest";
import { token0, token1 } from "../_test/constants.js";
import type { UniswapV3PoolData } from "../types/uniswapV3Pool.js";
import { calculateUniswapV3PoolMint } from "./calculateUniswapV3PoolMint.js";
import { calculateUniswapV3PositionID } from "./calculateUniswapV3PositionID.js";
import { Q96 } from "./constants.js";
import { createUniswapV3Pool } from "./createUniswapV3Pool.js";
import { createUniswapV3Position } from "./createUniswapV3Position.js";
import { createUniswapV3Tick } from "./createUniswapV3Tick.js";
import { q96ToFraction } from "./q96ToFraction.js";

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
    tick: createUniswapV3Tick(0),
    feeProtocol: createFraction(0),
    ticks: {},
    positions: {},
    tickBitmap: {},
    protocolFees0: createAmountFromRaw(uniswapV3Pool.token0, 0n),
    protocolFees1: createAmountFromRaw(uniswapV3Pool.token1, 0n),
  };

  const [_, amount1] = calculateUniswapV3PoolMint(
    poolData,
    zeroAddress,
    createUniswapV3Tick(0),
    createUniswapV3Tick(1),
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
      calculateUniswapV3PositionID(
        createUniswapV3Position(
          uniswapV3Pool,
          zeroAddress,
          createUniswapV3Tick(0),
          createUniswapV3Tick(1),
        ),
      )
    ],
  ).toBeTruthy();
  expect(
    poolData.positions[
      calculateUniswapV3PositionID(
        createUniswapV3Position(
          uniswapV3Pool,
          zeroAddress,
          createUniswapV3Tick(0),
          createUniswapV3Tick(1),
        ),
      )
    ]!.liquidity,
  ).toBe(10n ** 18n);
});
