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

export type PanopticLiquidateAccountParameters = {
  position: PanopticPosition;
};

export type SimulatePanopticLiquidateAccountParameters<
  TChain extends Chain | undefined = Chain,
  TChainOverride extends Chain | undefined = Chain | undefined,
> = Omit<
  SimulateContractParameters<
    typeof panopticPoolABI,
    "liquidateAccount",
    TChain,
    TChainOverride
  >,
  "args" | "address" | "abi" | "functionName"
> & { args: PanopticLiquidateAccountParameters };

export type SimulatePanopticLiquidateAccountReturnType<
  TChain extends Chain | undefined,
  TChainOverride extends Chain | undefined = undefined,
> = SimulateContractReturnType<
  typeof panopticPoolABI,
  "liquidateAccount",
  TChain,
  TChainOverride
>;

export const simulatePanopticLiquidateAccount = <
  TChain extends Chain | undefined,
  TChainOverride extends Chain | undefined,
>(
  client: Client<Transport, TChain>,
  {
    args: { position },
    ...request
  }: SimulatePanopticLiquidateAccountParameters<TChain, TChainOverride>,
): Promise<
  SimulatePanopticLiquidateAccountReturnType<TChain, TChainOverride>
> =>
  simulateContract(client, {
    address: position.pool.address,
    abi: panopticPoolABI,
    functionName: "liquidateAccount",
    args: [position.owner, 0, 0, [position.id]],
    ...request,
  } as unknown as SimulateContractParameters<
    typeof panopticPoolABI,
    "liquidateAccount",
    TChain,
    TChainOverride
  >);
