import { createAmountFromString } from "reverse-mirage";
import { type Hex } from "viem";
import { simulateContract, writeContract } from "viem/actions";
import { beforeEach, test } from "vitest";
import { ALICE } from "../_test/constants.js";
import {
  deployPool,
  publicClient,
  testClient,
  walletClient,
} from "../_test/utils.js";
import { mockErc20ABI } from "../generated.js";
import type { PanopticPool } from "../types/index.js";
import { simulatePanopticCollateralDeposit } from "./simulatePanopticCollateralDeposit.js";

let id: Hex | undefined = undefined;

let pool: PanopticPool;

beforeEach(async () => {
  if (id === undefined) {
    pool = await deployPool();

    const { request: approveRequest } = await simulateContract(publicClient, {
      address: pool.collateralTracker0.underlyingToken.address,
      abi: mockErc20ABI,
      functionName: "approve",
      args: [pool.collateralTracker0.address, 10n ** 18n],
      account: ALICE,
    });

    const approveHash = await writeContract(walletClient, approveRequest);
    await publicClient.waitForTransactionReceipt({ hash: approveHash });
  } else {
    await testClient.revert({ id });
  }
  id = await testClient.snapshot();
}, 100_000);

test("simulate collateral deposit", async () => {
  const { request } = await simulatePanopticCollateralDeposit(publicClient, {
    args: {
      collateral: pool.collateralTracker0,
      amount: createAmountFromString(
        pool.collateralTracker0.underlyingToken,
        "0.5",
      ),
      to: ALICE,
    },
    account: ALICE,
  });
  const hash = await walletClient.writeContract(request);
  await publicClient.waitForTransactionReceipt({ hash });
});
