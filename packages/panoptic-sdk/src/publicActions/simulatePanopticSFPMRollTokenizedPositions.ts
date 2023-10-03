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
import type { PanopticSemiFungiblePosition } from "../types/PanopticSemiFungiblePositionManager.js";

export type PanopticSFPMRollTokenizedPositionsParameters = {
  oldPosition: PanopticSemiFungiblePosition;
  newPosition: PanopticSemiFungiblePosition;
  amount: bigint;
};

export type SimulatePanopticSFPMRollTokenizedPositionsParameters<
  TChain extends Chain | undefined = Chain,
  TChainOverride extends Chain | undefined = Chain | undefined,
> = Omit<
  SimulateContractParameters<
    typeof semiFungiblePositionManagerABI,
    "rollTokenizedPositions",
    TChain,
    TChainOverride
  >,
  "args" | "address" | "abi" | "functionName"
> & { args: PanopticSFPMRollTokenizedPositionsParameters };

export type SimulatePanopticSFPMRollTokenizedPositionsReturnType<
  TChain extends Chain | undefined,
  TChainOverride extends Chain | undefined = undefined,
> = SimulateContractReturnType<
  typeof semiFungiblePositionManagerABI,
  "rollTokenizedPositions",
  TChain,
  TChainOverride
>;

export const simulatePanopticSFPMRollTokenizedPositions = <
  TChain extends Chain | undefined,
  TChainOverride extends Chain | undefined,
>(
  client: Client<Transport, TChain>,
  {
    args: { oldPosition, newPosition, amount },
    ...request
  }: SimulatePanopticSFPMRollTokenizedPositionsParameters<
    TChain,
    TChainOverride
  >,
): Promise<
  SimulatePanopticSFPMRollTokenizedPositionsReturnType<TChain, TChainOverride>
> =>
  simulateContract(client, {
    address: newPosition.address,
    abi: semiFungiblePositionManagerABI,
    functionName: "rollTokenizedPositions",
    args: [oldPosition.id, newPosition.id, amount, MIN_TICK, MAX_TICK],
    ...request,
  } as unknown as SimulateContractParameters<
    typeof semiFungiblePositionManagerABI,
    "rollTokenizedPositions",
    TChain,
    TChainOverride
  >);
