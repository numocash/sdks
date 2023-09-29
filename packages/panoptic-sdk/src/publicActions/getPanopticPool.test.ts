import { type Hex } from "viem";
import { beforeEach, expect, test } from "vitest";
import { deployPool, publicClient, testClient } from "../_test/utils.js";
import { sepoliaPanoptic } from "../chains/sepolia.js";
import type { PanopticPool } from "../types/index.js";
import { getPanopticPool } from "./getPanopticPool.js";

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

test("get panoptic pool", async () => {
  const address = await getPanopticPool(publicClient, {
    uniswapPool: pool.uniswapPool,
    factory: sepoliaPanoptic.factory,
  });

  expect(address).toBe(pool.address);
});
