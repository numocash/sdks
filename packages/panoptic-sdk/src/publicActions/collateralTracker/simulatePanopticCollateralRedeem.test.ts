import { type Hex } from "viem";
import { beforeEach, test } from "vitest";
import { deployPool, testClient } from "../../_test/utils.js";
import type { PanopticPool } from "../../index.js";

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

test.skip("Redeem", async () => {
  // const { request } = await simulatePanopticCollateralRedeem(walletClient, {
  //   args: {
  //     amount: createAmountFromString(collat, "0.5"),
  //     from: ALICE,
  //     to: ALICE,
  //   },
  // });
  // const hash = await walletClient.writeContract(request);
  // await publicClient.waitForTransactionReceipt({ hash });
});
