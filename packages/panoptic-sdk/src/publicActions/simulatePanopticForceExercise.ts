import type {
  Chain,
  Client,
  SimulateContractParameters,
  SimulateContractReturnType,
  Transport,
} from "viem";
import { simulateContract } from "viem/contract";
import { panopticPoolABI } from "../generated.js";
import type { PanopticPosition } from "../types/PanopticPosition.js";

export type PanopticForceExerciseParameters = {
  position: PanopticPosition;
};

export type SimulatePanopticForceExerciseParameters<
  TChain extends Chain | undefined = Chain,
  TChainOverride extends Chain | undefined = Chain | undefined,
> = Omit<
  SimulateContractParameters<
    typeof panopticPoolABI,
    "forceExercise",
    TChain,
    TChainOverride
  >,
  "args" | "address" | "abi" | "functionName"
> & { args: PanopticForceExerciseParameters };

export type SimulatePanopticForceExerciseReturnType<
  TChain extends Chain | undefined,
  TChainOverride extends Chain | undefined = undefined,
> = SimulateContractReturnType<
  typeof panopticPoolABI,
  "forceExercise",
  TChain,
  TChainOverride
>;

export const simulatePanopticForceExercise = <
  TChain extends Chain | undefined,
  TChainOverride extends Chain | undefined,
>(
  client: Client<Transport, TChain>,
  {
    args: { position },
    ...request
  }: SimulatePanopticForceExerciseParameters<TChain, TChainOverride>,
): Promise<SimulatePanopticForceExerciseReturnType<TChain, TChainOverride>> =>
  simulateContract(client, {
    address: position.pool.address,
    abi: panopticPoolABI,
    functionName: "forceExercise",
    args: [position.owner, 0, 0, [position.id], []],
    ...request,
  } as unknown as SimulateContractParameters<
    typeof panopticPoolABI,
    "forceExercise",
    TChain,
    TChainOverride
  >);
