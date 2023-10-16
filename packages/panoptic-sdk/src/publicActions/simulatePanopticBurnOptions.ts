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

export type PanopticBurnOptionsParameters = {
  positions: PanopticPosition[];
};

export type SimulatePanopticBurnOptionsParameters<
  TChain extends Chain | undefined = Chain,
  TChainOverride extends Chain | undefined = Chain | undefined,
> = Omit<
  SimulateContractParameters<
    typeof panopticPoolABI,
    "burnOptions",
    TChain,
    TChainOverride
  >,
  "args" | "address" | "abi" | "functionName"
> & { args: PanopticBurnOptionsParameters };

export type SimulatePanopticBurnOptionsReturnType<
  TChain extends Chain | undefined,
  TChainOverride extends Chain | undefined = undefined,
> = SimulateContractReturnType<
  typeof panopticPoolABI,
  "burnOptions",
  TChain,
  TChainOverride
>;

export const simulatePanopticBurnOptions = <
  TChain extends Chain | undefined,
  TChainOverride extends Chain | undefined,
>(
  client: Client<Transport, TChain>,
  {
    args: { positions },
    ...request
  }: SimulatePanopticBurnOptionsParameters<TChain, TChainOverride>,
): Promise<SimulatePanopticBurnOptionsReturnType<TChain, TChainOverride>> =>
  simulateContract(client, {
    address: positions[0]!.pool.address,
    abi: panopticPoolABI,
    functionName: "burnOptions",
    args: [positions.map((p) => p.id), 0, 0],
    ...request,
  } as unknown as SimulateContractParameters<
    typeof panopticPoolABI,
    "burnOptions",
    TChain,
    TChainOverride
  >);
