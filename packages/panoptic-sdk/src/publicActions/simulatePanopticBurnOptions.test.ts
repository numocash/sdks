import { createUniswapV3Tick } from "@panoptic-xyz/uniswap-v3-sdk";
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
import type { PanopticPool } from "../types/PanopticPool.js";
import type { PanopticPosition } from "../types/PanopticPosition.js";
import { createPanopticPosition } from "../utils/createPanopticPosition.js";
import { simulatePanopticBurnOptions } from "./simulatePanopticBurnOptions.js";
import { simulatePanopticCollateralDeposit } from "./simulatePanopticCollateralDeposit.js";
import { simulatePanopticMintOptions } from "./simulatePanopticMintOptions.js";
import { simulatePanopticSFPMInitializeAMMPool } from "./simulatePanopticSFPMInitializeAMMPool.js";

let id: Hex | undefined = undefined;

let pool: PanopticPool;
let position: PanopticPosition;

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

    position = createPanopticPosition(ALICE, pool, [
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
    ]);

    const { request } = await simulatePanopticMintOptions(publicClient, {
      args: {
        position,
        amount: 5n * 10n ** 17n,
      },
      account: ALICE,
    });
    const hash = await walletClient.writeContract(request);
    await publicClient.waitForTransactionReceipt({ hash });
  } else {
    await testClient.revert({ id });
  }
  id = await testClient.snapshot();
}, 100_000);

test("burn options", async () => {
  const { request } = await simulatePanopticBurnOptions(publicClient, {
    args: {
      position,
    },
    account: ALICE,
  });
  const hash = await walletClient.writeContract(request);
  await publicClient.waitForTransactionReceipt({ hash });
});
