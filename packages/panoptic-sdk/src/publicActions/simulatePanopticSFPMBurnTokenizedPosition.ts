import { MAX_TICK, MIN_TICK } from "uniswap-v3-sdk";
import type {
  Chain,
  Client,
  SimulateContractParameters,
  SimulateContractReturnType,
  Transport,
} from "viem";
import { simulateContract } from "viem/contract";
import { semiFungiblePositionManagerABI } from "../generated.js";
import type { PanopticPosition } from "../types/PanopticPosition.js";

export type PanopticSFPMBurnTokenizedPositionParameters = {
  position: PanopticPosition;
  amount: bigint;
};

export type SimulatePanopticSFPMBurnTokenizedPositionParameters<
  TChain extends Chain | undefined = Chain,
  TChainOverride extends Chain | undefined = Chain | undefined,
> = Omit<
  SimulateContractParameters<
    typeof semiFungiblePositionManagerABI,
    "burnTokenizedPosition",
    TChain,
    TChainOverride
  >,
  "args" | "address" | "abi" | "functionName"
> & { args: PanopticSFPMBurnTokenizedPositionParameters };

export type SimulatePanopticSFPMBurnTokenizedPositionReturnType<
  TChain extends Chain | undefined,
  TChainOverride extends Chain | undefined = undefined,
> = SimulateContractReturnType<
  typeof semiFungiblePositionManagerABI,
  "burnTokenizedPosition",
  TChain,
  TChainOverride
>;

export const simulatePanopticSFPMBurnTokenizedPosition = <
  TChain extends Chain | undefined,
  TChainOverride extends Chain | undefined,
>(
  client: Client<Transport, TChain>,
  {
    args: { position, amount },
    ...request
  }: SimulatePanopticSFPMBurnTokenizedPositionParameters<
    TChain,
    TChainOverride
  >,
): Promise<
  SimulatePanopticSFPMBurnTokenizedPositionReturnType<TChain, TChainOverride>
> =>
  simulateContract(client, {
    address: position.pool.factory.semiFungiblePositionManager.address,
    abi: semiFungiblePositionManagerABI,
    functionName: "burnTokenizedPosition",
    args: [[position.id], amount, MIN_TICK, MAX_TICK],
    ...request,
  } as unknown as SimulateContractParameters<
    typeof semiFungiblePositionManagerABI,
    "burnTokenizedPosition",
    TChain,
    TChainOverride
  >);
