import { createAmountFromString, createERC20 } from "reverse-mirage";
import invariant from "tiny-invariant";
import { type Hex, parseEther } from "viem";
import { foundry } from "viem/chains";
import { beforeEach, test } from "vitest";
import { collateralTrackerBytecode } from "../../_test/bytecode/collateralTracker.js";
import { mockERC20Bytecode } from "../../_test/bytecode/mockERC20.js";
import { ALICE } from "../../_test/constants.js";
import {
  baseParameters,
  publicClient,
  testClient,
  walletClient,
} from "../../_test/utils.js";
import { mockERC20ABI } from "../../abi/mockERC20.js";
import type { PanopticCollateral } from "../../index.js";
import { createPanopticCollateral } from "../../utils/createPanopticCollateral.js";
import { writePanopticCollateralDeposit } from "./writePanopticCollateralDeposit.js";
import { writePanopticCollateralRedeem } from "./writePanopticCollateralRedeem.js";

let id: Hex | undefined = undefined;

let collat: PanopticCollateral;

beforeEach(async () => {
  if (id === undefined) {
    const deployHash = await walletClient.deployContract({
      account: ALICE,
      abi: mockERC20ABI,
      bytecode: mockERC20Bytecode,
      args: ["name", "symbol", 18],
    });

    const { contractAddress } = await publicClient.waitForTransactionReceipt({
      hash: deployHash,
    });
    invariant(contractAddress);
    const erc20 = createERC20(
      contractAddress,
      "name",
      "symbol",
      18,
      foundry.id,
    );

    testClient.setCode({
      address: "0xe846c6fcf817734ca4527b28ccb4aea2b6663c79",
      bytecode: collateralTrackerBytecode,
    });

    collat = createPanopticCollateral(
      "0xe846c6fcf817734ca4527b28ccb4aea2b6663c79",
      "name",
      "symbol",
      18,
      foundry.id,
      erc20,
      baseParameters,
    );

    const mintHash = await walletClient.writeContract({
      abi: mockERC20ABI,
      functionName: "mint",
      address: contractAddress,
      args: [ALICE, parseEther("1")],
    });
    await publicClient.waitForTransactionReceipt({ hash: mintHash });

    const hash = await writePanopticCollateralDeposit(walletClient, {
      args: {
        amount: createAmountFromString(collat.underlyingToken, "1"),
        to: ALICE,
      },
    });

    await publicClient.waitForTransactionReceipt({ hash });
  } else {
    await testClient.revert({ id });
  }
  id = await testClient.snapshot();
});

test("Redeem", async () => {
  const hash = await writePanopticCollateralRedeem(walletClient, {
    args: {
      amount: createAmountFromString(collat, "0.5"),
      from: ALICE,
      to: ALICE,
    },
  });

  await publicClient.waitForTransactionReceipt({ hash });
});
