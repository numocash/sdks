import { createERC20, createFraction } from "reverse-mirage";
import invariant from "tiny-invariant";
import {
  createUniswapV3Pool,
  uniswapV3FactoryABI,
  uniswapV3PoolABI,
} from "uniswap-v3-sdk";
import {
  http,
  type Hex,
  createPublicClient,
  createTestClient,
  createWalletClient,
} from "viem";
import { sepolia } from "viem/chains";
import type { Chain } from "viem/chains";
import { readContract } from "viem/contract";
import MockERC20Bytecode from "../../../../lib/panoptic-v1-core/artifacts/contracts/MockERC20.sol/MockERC20.json";
import { sepoliaPanoptic } from "../chains/sepolia.js";
import {
  mockErc20ABI,
  panopticFactoryABI,
  panopticPoolABI,
} from "../generated.js";
import type {
  PanopticCollateralParamters,
  PanopticPool,
} from "../types/index.js";
import { createPanopticCollateral } from "../utils/createPanopticCollateral.js";
import { createPanopticPool } from "../utils/createPanopticPool.js";
import { ALICE } from "./constants.js";

export const pool = Number(process.env.VITEST_POOL_ID ?? 1);
export const anvil = {
  ...sepolia, // We are using a mainnet fork for testing.
  rpcUrls: {
    // These rpc urls are automatically used in the transports.
    default: {
      // Note how we append the worker id to the local rpc urls.
      http: [`http://127.0.0.1:8545/${pool}`],
      webSocket: [`ws://127.0.0.1:8545/${pool}`],
    },
    public: {
      // Note how we append the worker id to the local rpc urls.
      http: [`http://127.0.0.1:8545/${pool}`],
      webSocket: [`ws://127.0.0.1:8545/${pool}`],
    },
  },
} as const satisfies Chain;

export const testClient = createTestClient({
  chain: anvil,
  mode: "anvil",
  transport: http(),
});

export const publicClient = createPublicClient({
  chain: anvil,
  transport: http(),
});

export const walletClient = createWalletClient({
  chain: anvil,
  transport: http(),
  account: ALICE,
});

export const baseParameters: PanopticCollateralParamters = {
  type: "panopticCollateralParameters",
  maintenanceMarginRatio: createFraction(13_333, 10_000),
  commissionFee: createFraction(10, 10_000),
  ITMSpreadFee: createFraction(60, 10_000),
  sellCollateralRatio: createFraction(2_000, 10_000),
  buyCollateralRatio: createFraction(1_000, 10_000),
  targetPoolUtilization: createFraction(5_000, 10_000),
  saturatedPoolUtilization: createFraction(9_000, 10_000),
  exerciseCost: createFraction(-1_024, 10_000),
};

export const deployPool = async (): Promise<PanopticPool> => {
  // Deploy tokens
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

  const uniPool = createUniswapV3Pool(
    tokenA,
    tokenB,
    500,
    sepoliaPanoptic.factory.uniswapFactory,
  );

  const { request: initializeRequest } = await publicClient.simulateContract({
    address: uniPool.address,
    abi: uniswapV3PoolABI,
    functionName: "initialize",
    args: [2n ** 96n],
    account: ALICE,
  });
  const initializeHash = await walletClient.writeContract(initializeRequest);
  await publicClient.waitForTransactionReceipt({
    hash: initializeHash,
  });
  const { request: newPoolRequest, result: panopticPoolAddres } =
    await publicClient.simulateContract({
      address: sepoliaPanoptic.factory.address,
      abi: panopticFactoryABI,
      functionName: "deployNewPool",
      args: [tokenA.address, tokenB.address, 500, 0n],
      account: ALICE,
    });

  const newPoolHash = await walletClient.writeContract(newPoolRequest);
  await publicClient.waitForTransactionReceipt({
    hash: newPoolHash,
  });

  const collateralTracker0Address = await readContract(publicClient, {
    abi: panopticPoolABI,
    address: panopticPoolAddres,
    functionName: "collateralToken0",
  });

  const collateralTracker1Address = await readContract(publicClient, {
    abi: panopticPoolABI,
    address: panopticPoolAddres,
    functionName: "collateralToken1",
  });

  const collateral0 = createPanopticCollateral(
    collateralTracker0Address,
    uniPool.token0,
    uniPool.token1,
    uniPool.feeTier,
    baseParameters,
  );

  const collateral1 = createPanopticCollateral(
    collateralTracker1Address,
    uniPool.token1,
    uniPool.token0,
    uniPool.feeTier,
    baseParameters,
  );

  const pool = createPanopticPool(
    panopticPoolAddres,
    sepoliaPanoptic.factory,
    collateral0,
    collateral1,
    uniPool,
  );

  return pool;
};
