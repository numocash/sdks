import { type Hex } from "viem";
import { beforeEach, expect, test } from "vitest";
import { deployPool, publicClient, testClient } from "../_test/utils.js";
import type { PanopticPool } from "../types/index.js";
import { getPanopticPoolData } from "./getPanopticPoolData.js";

let id: Hex | undefined = undefined;

let pool: PanopticPool;

beforeEach(async () => {
  if (id === undefined) {
    pool = await deployPool();
  } else {
    await testClient.revert({ id });
  }
  id = await testClient.snapshot();
}, 100_000);

test("get pool data", async () => {
  const poolData = await getPanopticPoolData(publicClient, {
    panopticPool: pool,
  });
  expect(poolData.panopticPool).toStrictEqual(pool);

  expect(poolData.uniswapPoolData.uniswapV3Pool).toStrictEqual(
    pool.uniswapPool,
  );

  expect(poolData.collateralTracker0Data.collateral).toStrictEqual(
    pool.collateralTracker0,
  );

  expect(poolData.collateralTracker1Data.collateral).toStrictEqual(
    pool.collateralTracker1,
  );
});
