import type { UniswapV3Pool } from "uniswap-v3-sdk";
import type {
  Chain,
  Client,
  SimulateContractParameters,
  SimulateContractReturnType,
  Transport,
} from "viem";
import { simulateContract } from "viem/contract";
import { semiFungiblePositionManagerABI } from "../generated.js";
import type { PanopticSemiFungiblePositionManager } from "../types/PanopticSemiFungiblePositionManager.js";

export type PanopticSFPMInitializeAMMPoolParameters = {
  pool: Pick<UniswapV3Pool, "token0" | "token1" | "feeTier">;
  sfpm: Pick<PanopticSemiFungiblePositionManager, "address">;
};

export type SimulatePanopticSFPMInitializeAMMPoolParameters<
  TChain extends Chain | undefined = Chain,
  TChainOverride extends Chain | undefined = Chain | undefined,
> = Omit<
  SimulateContractParameters<
    typeof semiFungiblePositionManagerABI,
    "initializeAMMPool",
    TChain,
    TChainOverride
  >,
  "args" | "address" | "abi" | "functionName"
> & { args: PanopticSFPMInitializeAMMPoolParameters };

export type SimulatePanopticSFPMInitializeAMMPoolReturnType<
  TChain extends Chain | undefined,
  TChainOverride extends Chain | undefined = undefined,
> = SimulateContractReturnType<
  typeof semiFungiblePositionManagerABI,
  "initializeAMMPool",
  TChain,
  TChainOverride
>;

export const simulatePanopticSFPMInitializeAMMPool = <
  TChain extends Chain | undefined,
  TChainOverride extends Chain | undefined,
>(
  client: Client<Transport, TChain>,
  {
    args: { pool, sfpm },
    ...request
  }: SimulatePanopticSFPMInitializeAMMPoolParameters<TChain, TChainOverride>,
): Promise<
  SimulatePanopticSFPMInitializeAMMPoolReturnType<TChain, TChainOverride>
> =>
  simulateContract(client, {
    address: sfpm.address,
    abi: semiFungiblePositionManagerABI,
    functionName: "initializeAMMPool",
    args: [pool.token0.address, pool.token1.address, pool.feeTier],
    ...request,
  } as unknown as SimulateContractParameters<
    typeof semiFungiblePositionManagerABI,
    "initializeAMMPool",
    TChain,
    TChainOverride
  >);
