import {
  createAmountFromRaw,
  createERC20,
  createFraction,
  createPriceFromFraction,
} from "reverse-mirage";
import { zeroAddress } from "viem";
import { foundry } from "viem/chains";
import { expect, test } from "vitest";
import { burn, mint } from "./amounts.js";
import { Q96 } from "./constants.js";
import type { UniswapV3PoolData } from "./types.js";
import {
  createPosition,
  createTick,
  createUniswapV3Pool,
  getPositionID,
  q96ToFraction,
} from "./utils.js";

const token0 = createERC20(
  "0x0000000000000000000000000000000000000001",
  "name",
  "symbol",
  18,
  foundry.id,
);

const token1 = createERC20(
  "0x0000000000000000000000000000000000000002",
  "name",
  "symbol",
  18,
  foundry.id,
);

const uniswapV3Pool = createUniswapV3Pool(token0, token1, 100, zeroAddress);

test("mint", () => {
  const poolData = {
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
    protocolFees0: createAmountFromRaw(uniswapV3Pool.token0, 0n),
    protocolFees1: createAmountFromRaw(uniswapV3Pool.token1, 0n),
  } as UniswapV3PoolData;

  const [amount0, amount1] = mint(
    poolData,
    zeroAddress,
    createTick(0),
    createTick(1),
    10n ** 18n,
  );

  expect(amount0.amount).toBe(999900007499375055n);
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
  const poolData = {
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
    protocolFees0: createAmountFromRaw(uniswapV3Pool.token0, 0n),
    protocolFees1: createAmountFromRaw(uniswapV3Pool.token1, 0n),
  } as UniswapV3PoolData;

  mint(poolData, zeroAddress, createTick(0), createTick(1), 10n ** 18n);

  const [amount0, amount1] = burn(
    poolData,
    zeroAddress,
    createTick(0),
    createTick(1),
    10n ** 18n,
  );

  expect(amount0.amount).toBe(999900007499375055n - 1n);
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

test.todo("single tick swap");

test.todo("multi tick swap");

test.todo("far tick swap");
