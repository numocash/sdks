import { type Hex } from "viem";
import { beforeEach, expect, test } from "vitest";
import {
  deployPool,
  publicClient,
  testClient,
  walletClient,
} from "../_test/utils.js";
import { semiFungiblePositionManagerABI } from "../generated.js";
import type { PanopticPool } from "../types/PanopticPool.js";
import { simulatePanopticSFPMInitializeAMMPool } from "./simulatePanopticSFPMInitializeAMMPool.js";

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

test("initialize pool", async () => {
  const { request } = await simulatePanopticSFPMInitializeAMMPool(
    publicClient,
    {
      args: {
        pool: pool.uniswapPool,
        sfpm: pool.factory.semiFungiblePositionManager,
      },
    },
  );

  const hash = await walletClient.writeContract(request);
  await publicClient.waitForTransactionReceipt({ hash });

  const poolID = await publicClient.readContract({
    abi: semiFungiblePositionManagerABI,
    address: pool.factory.semiFungiblePositionManager.address,
    functionName: "getPoolId",
    args: [pool.uniswapPool.address],
  });

  expect(poolID).toBe(
    ((BigInt(pool.uniswapPool.address) >> 96n) + 2n ** 255n) &
      0xffffffffffffffffn,
  );
});
