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

export type PanopticRollOptionsParameters = {
  oldPositions: PanopticPosition[];
  newPosition: PanopticPosition;
};

export type SimulatePanopticRollOptionsParameters<
  TChain extends Chain | undefined = Chain,
  TChainOverride extends Chain | undefined = Chain | undefined,
> = Omit<
  SimulateContractParameters<
    typeof panopticPoolABI,
    "rollOptions",
    TChain,
    TChainOverride
  >,
  "args" | "address" | "abi" | "functionName"
> & { args: PanopticRollOptionsParameters };

export type SimulatePanopticRollOptionsReturnType<
  TChain extends Chain | undefined,
  TChainOverride extends Chain | undefined = undefined,
> = SimulateContractReturnType<
  typeof panopticPoolABI,
  "rollOptions",
  TChain,
  TChainOverride
>;

export const simulatePanopticRollOptions = <
  TChain extends Chain | undefined,
  TChainOverride extends Chain | undefined,
>(
  client: Client<Transport, TChain>,
  {
    args: { oldPositions, newPosition },
    ...request
  }: SimulatePanopticRollOptionsParameters<TChain, TChainOverride>,
): Promise<SimulatePanopticRollOptionsReturnType<TChain, TChainOverride>> =>
  simulateContract(client, {
    address: newPosition.pool.address,
    abi: panopticPoolABI,
    functionName: "rollOptions",
    args: [
      oldPositions[oldPositions.length - 1]!.id,
      newPosition.id,
      oldPositions.map((p) => p.id),
      0n,
      0,
      0,
    ],
    ...request,
  } as unknown as SimulateContractParameters<
    typeof panopticPoolABI,
    "rollOptions",
    TChain,
    TChainOverride
  >);
