import { createERC20 } from "reverse-mirage";
import invariant from "tiny-invariant";
import {
  type UniswapV3Pool,
  createUniswapV3Pool,
  uniswapV3FactoryABI,
  uniswapV3PoolABI,
} from "uniswap-v3-sdk";
import { type Hex } from "viem";
import { sepolia } from "viem/chains";
import { beforeEach, expect, test } from "vitest";
import MockERC20Bytecode from "../../../../lib/panoptic-v1-core/artifacts/contracts/MockERC20.sol/MockERC20.json";
import { ALICE } from "../_test/constants.js";
import { publicClient, testClient, walletClient } from "../_test/utils.js";
import { sepoliaPanoptic } from "../chains/sepolia.js";
import { mockErc20ABI } from "../generated.js";
import { getPanopticPool } from "./getPanopticPool.js";
import { simulatePanopticDeployNewPool } from "./simulatePanopticDeployNewPool.js";

let id: Hex | undefined = undefined;

let uniswapPool: UniswapV3Pool;

beforeEach(async () => {
  if (id === undefined) {
    let deployHash = await walletClient.deployContract({
      account: ALICE,
      abi: mockErc20ABI,
      bytecode: MockERC20Bytecode.bytecode.object as Hex,
      args: ["name", "symbol", 18],
    });
    const { contractAddress: tokenAAddress } =
      await publicClient.waitForTransactionReceipt({
        hash: deployHash,
      });
    invariant(tokenAAddress);
    const tokenA = createERC20(tokenAAddress, "name", "symbol", 18, sepolia.id);
    deployHash = await walletClient.deployContract({
      account: ALICE,
      abi: mockErc20ABI,
      bytecode: MockERC20Bytecode.bytecode.object as Hex,
      args: ["name", "symbol", 18],
    });
    const { contractAddress: tokenBAddress } =
      await publicClient.waitForTransactionReceipt({
        hash: deployHash,
      });
    invariant(tokenBAddress);
    const tokenB = createERC20(tokenBAddress, "name", "symbol", 18, sepolia.id);

    // Mint
    const { request: mintRequestA } = await publicClient.simulateContract({
      abi: mockErc20ABI,
      address: tokenA.address,
      functionName: "mint",
      args: [ALICE, 10n ** 36n],
    });
    const mintHashA = await walletClient.writeContract(mintRequestA);
    await publicClient.waitForTransactionReceipt({
      hash: mintHashA,
    });

    const { request: mintRequestB } = await publicClient.simulateContract({
      abi: mockErc20ABI,
      address: tokenB.address,
      functionName: "mint",
      args: [ALICE, 10n ** 36n],
    });
    const mintHashB = await walletClient.writeContract(mintRequestB);
    await publicClient.waitForTransactionReceipt({
      hash: mintHashB,
    });

    // Approve
    const { request: approveRequestA } = await publicClient.simulateContract({
      abi: mockErc20ABI,
      address: tokenA.address,
      functionName: "approve",
      args: [sepoliaPanoptic.factory.address, 10n ** 36n],
      account: ALICE,
    });
    const approveHashA = await walletClient.writeContract(approveRequestA);
    await publicClient.waitForTransactionReceipt({
      hash: approveHashA,
    });

    const { request: approveRequestB } = await publicClient.simulateContract({
      abi: mockErc20ABI,
      address: tokenB.address,
      functionName: "approve",
      args: [sepoliaPanoptic.factory.address, 10n ** 36n],
      account: ALICE,
    });
    const approveHashB = await walletClient.writeContract(approveRequestB);
    await publicClient.waitForTransactionReceipt({
      hash: approveHashB,
    });

    // Create pool
    const { request } = await publicClient.simulateContract({
      address: sepoliaPanoptic.factory.uniswapFactory.address,
      abi: uniswapV3FactoryABI,
      functionName: "createPool",
      args: [tokenA.address, tokenB.address, 500],
      account: ALICE,
    });
    const hash = await walletClient.writeContract(request);
    await publicClient.waitForTransactionReceipt({
      hash,
    });

    uniswapPool = createUniswapV3Pool(
      tokenA,
      tokenB,
      500,
      sepoliaPanoptic.factory.uniswapFactory,
    );

    const { request: initializeRequest } = await publicClient.simulateContract({
      address: uniswapPool.address,
      abi: uniswapV3PoolABI,
      functionName: "initialize",
      args: [2n ** 96n],
      account: ALICE,
    });
    const initializeHash = await walletClient.writeContract(initializeRequest);
    await publicClient.waitForTransactionReceipt({
      hash: initializeHash,
    });
  } else {
    await testClient.revert({ id });
  }
  id = await testClient.snapshot();
}, 100_000);

test("simulate deploy pool", async () => {
  const { request } = await simulatePanopticDeployNewPool(publicClient, {
    args: {
      uniswapPool,
      factory: sepoliaPanoptic.factory,
      salt: 0n,
    },
    account: ALICE,
  });

  const hash = await walletClient.writeContract(request);
  await publicClient.waitForTransactionReceipt({ hash });

  const address = await getPanopticPool(publicClient, {
    uniswapPool,
    factory: sepoliaPanoptic.factory,
  });

  expect(address).toBeTruthy();
});
