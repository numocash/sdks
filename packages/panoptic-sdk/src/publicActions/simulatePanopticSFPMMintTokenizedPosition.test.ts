import { getERC1155BalanceOf } from "reverse-mirage";
import { createUniswapV3Tick } from "uniswap-v3-sdk";
import { type Hex } from "viem";
import { simulateContract, writeContract } from "viem/actions";
import { sepolia } from "viem/chains";
import { beforeEach, expect, test } from "vitest";
import { ALICE } from "../_test/constants.js";
import {
  deployPool,
  publicClient,
  testClient,
  walletClient,
} from "../_test/utils.js";
import { mockErc20ABI } from "../generated.js";
import type { PanopticPool } from "../types/PanopticPool.js";
import { createPanopticSemiFungiblePosition } from "../utils/createPanopticSemiFungiblePosition.js";
import { simulatePanopticSFPMInitializeAMMPool } from "./simulatePanopticSFPMInitializeAMMPool.js";
import { simulatePanopticSFPMMintTokenizedPosition } from "./simulatePanopticSFPMMintTokenizedPosition.js";

let id: Hex | undefined = undefined;

let pool: PanopticPool;

beforeEach(async () => {
  if (id === undefined) {
    pool = await deployPool();
    const { request: initializeRequest } =
      await simulatePanopticSFPMInitializeAMMPool(publicClient, {
        args: {
          pool: pool.uniswapPool,
          sfpm: pool.factory.semiFungiblePositionManager,
        },
      });

    const initializeHash = await walletClient.writeContract(initializeRequest);
    await publicClient.waitForTransactionReceipt({ hash: initializeHash });

    const { request: approveRequest } = await simulateContract(publicClient, {
      address: pool.collateralTracker0.underlyingToken.address,
      abi: mockErc20ABI,
      functionName: "approve",
      args: [pool.factory.semiFungiblePositionManager.address, 10n ** 18n],
      account: ALICE,
    });

    const approveHash = await writeContract(walletClient, approveRequest);
    await publicClient.waitForTransactionReceipt({ hash: approveHash });
  } else {
    await testClient.revert({ id });
  }
  id = await testClient.snapshot();
}, 100_000);

test("mint tokenized position", async () => {
  const position = createPanopticSemiFungiblePosition(
    ALICE,
    pool.factory.semiFungiblePositionManager,
    [
      {
        asset: "token0",
        optionRatio: 1,
        position: "short",
        tokenType: "token0",
        riskPartnerIndex: 0,
        tickLower: createUniswapV3Tick(0),
        tickUpper: createUniswapV3Tick(10),
      },
      undefined,
      undefined,
      undefined,
    ],
    pool.uniswapPool,
    sepolia.id,
  );

  const { request } = await simulatePanopticSFPMMintTokenizedPosition(
    publicClient,
    {
      args: {
        position,
        amount: 10n ** 18n,
      },
      account: ALICE,
    },
  );
  const hash = await walletClient.writeContract(request);
  await publicClient.waitForTransactionReceipt({ hash });

  const balance = await getERC1155BalanceOf(publicClient, {
    erc1155: position,
    address: position.owner,
  });

  expect(balance.amount).toBe(10n ** 18n);
});
