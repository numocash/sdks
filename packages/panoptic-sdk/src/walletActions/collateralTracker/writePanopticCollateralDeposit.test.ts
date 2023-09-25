import { createERC20 } from "reverse-mirage";
import invariant from "tiny-invariant";
import { type Hex } from "viem";
import { foundry } from "viem/chains";
import { beforeEach, test } from "vitest";
import CollateralTrackerBytecode from "../../../../../lib/panoptic-v1-core/artifacts/contracts/CollateralTracker.sol/CollateralTracker.json";
import ERC20Bytecode from "../../../../../lib/panoptic-v1-core/artifacts/contracts/MockERC20.sol/MockERC20.json";
import { ALICE } from "../../_test/constants.js";
import { publicClient, testClient, walletClient } from "../../_test/utils.js";
import { collateralTrackerABI, mockErc20ABI } from "../../generated.js";
import type { PanopticCollateral } from "../../index.js";

let id: Hex | undefined = undefined;

let collat: PanopticCollateral;

beforeEach(async () => {
  if (id === undefined) {
    let deployHash = await walletClient.deployContract({
      account: ALICE,
      abi: mockErc20ABI,
      bytecode: ERC20Bytecode.bytecode.object as Hex,
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

    deployHash = await walletClient.deployContract({
      account: ALICE,
      abi: collateralTrackerABI,
      bytecode: CollateralTrackerBytecode.bytecode.object as Hex,
    });

    // const { contractAddress: collateralAddress } =
    //   await publicClient.waitForTransactionReceipt({
    //     hash: deployHash,
    //   });
    // invariant(collateralAddress);

    // collat = createPanopticCollateral(
    //   collateralAddress,
    //   "name",
    //   "symbol",
    //   18,
    //   foundry.id,
    //   erc20,
    //   baseParameters,
    // );

    // const mintHash = await walletClient.writeContract({
    //   abi: mockErc20ABI,
    //   functionName: "mint",
    //   address: contractAddress,
    //   args: [ALICE, parseEther("1")],
    // });
    // await publicClient.waitForTransactionReceipt({ hash: mintHash });
  } else {
    await testClient.revert({ id });
  }
  id = await testClient.snapshot();
});

test("deposit", async () => {
  // const { request } = await simulateERC20Transfer(publicClient, {
  //   args: { amount: createAmountFromString(erc20, "1"), to: BOB },
  //   account: ALICE,
  // });
  // const hash = await walletClient.writeContract(request);
  // await publicClient.waitForTransactionReceipt({ hash });
  // const balance = await getERC20BalanceOf(publicClient, {
  //   erc20,
  //   address: BOB,
  // });
  // expect(balance.amount).toBe(10n ** 18n);
  // expect(balance.token).toStrictEqual(erc20);
});
