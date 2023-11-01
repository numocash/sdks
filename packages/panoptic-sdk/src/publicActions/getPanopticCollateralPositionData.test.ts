import { createAmountFromString } from "reverse-mirage";
import { type Hex } from "viem";
import { simulateContract, writeContract } from "viem/actions";
import { beforeEach, expect, test } from "vitest";
import { ALICE } from "../_test/constants.js";
import {
  deployPool,
  publicClient,
  testClient,
  walletClient,
} from "../_test/utils.js";
import { mockErc20ABI } from "../generated.js";
import type { PanopticPool } from "../types/index.js";
import { getPanopticCollateralPositionData } from "./getPanopticCollateralPositionData.js";
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

    const { request: depositRequest } = await simulatePanopticCollateralDeposit(
      publicClient,
      {
        args: {
          collateral: pool.collateralTracker0,
          amount: createAmountFromString(
            pool.collateralTracker0.underlyingToken,
            "1",
          ),
          to: ALICE,
        },
        account: ALICE,
      },
    );
    const depositHash = await writeContract(walletClient, depositRequest);
    await publicClient.waitForTransactionReceipt({ hash: depositHash });
  } else {
    await testClient.revert({ id });
  }
  id = await testClient.snapshot();
}, 100_000);

test("get collateral data", async () => {
  const collateralPosition = await getPanopticCollateralPositionData(
    publicClient,
    {
      collateral: pool.collateralTracker0,
      address: ALICE,
    },
  );

  expect(collateralPosition.token).toStrictEqual(pool.collateralTracker0);
  expect(collateralPosition.amount).toStrictEqual(
    createAmountFromString(pool.collateralTracker0, ".999").amount,
  );
});
