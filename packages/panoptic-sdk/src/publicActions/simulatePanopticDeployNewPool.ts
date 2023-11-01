import type { UniswapV3Pool } from "@panoptic-xyz/uniswap-v3-sdk";
import type {
  Chain,
  Client,
  SimulateContractParameters,
  SimulateContractReturnType,
  Transport,
} from "viem";
import { simulateContract } from "viem/contract";
import { panopticFactoryABI } from "../generated.js";
import type { PanopticFactory } from "../types/PanopticFactory.js";

export type PanopticDeployNewPoolParameters = {
  factory: PanopticFactory;
  pool: UniswapV3Pool;
  salt: bigint;
};

export type SimulatePanopticDeployNewPoolParameters<
  TChain extends Chain | undefined = Chain,
  TChainOverride extends Chain | undefined = Chain | undefined,
> = Omit<
  SimulateContractParameters<
    typeof panopticFactoryABI,
    "deployNewPool",
    TChain,
    TChainOverride
  >,
  "args" | "address" | "abi" | "functionName"
> & { args: PanopticDeployNewPoolParameters };

export type SimulatePanopticDeployNewPoolReturnType<
  TChain extends Chain | undefined,
  TChainOverride extends Chain | undefined = undefined,
> = SimulateContractReturnType<
  typeof panopticFactoryABI,
  "deployNewPool",
  TChain,
  TChainOverride
>;

// TODO: return PanopticPool
export const simulatePanopticDeployNewPool = <
  TChain extends Chain | undefined,
  TChainOverride extends Chain | undefined,
>(
  client: Client<Transport, TChain>,
  {
    args: { factory, pool, salt },
    ...request
  }: SimulatePanopticDeployNewPoolParameters<TChain, TChainOverride>,
): Promise<SimulatePanopticDeployNewPoolReturnType<TChain, TChainOverride>> =>
  simulateContract(client, {
    address: factory.address,
    abi: panopticFactoryABI,
    functionName: "deployNewPool",
    args: [pool.token0.address, pool.token1.address, pool.feeTier, salt],
    ...request,
  } as unknown as SimulateContractParameters<
    typeof panopticFactoryABI,
    "deployNewPool",
    TChain,
    TChainOverride
  >);
