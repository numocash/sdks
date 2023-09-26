import type {
  Account,
  Chain,
  Client,
  Transport,
  WriteContractParameters,
  WriteContractReturnType,
} from "viem";
import { writeContract } from "viem/contract";
import { panopticPoolABI } from "../generated.js";
import type { PanopticPosition } from "../types/PanopticPosition.js";

export type PanopticBurnOptionsParameters = {
  position: PanopticPosition;
};

export type WritePanopticBurnOptionsParameters<
  TChain extends Chain | undefined = Chain,
  TAccount extends Account | undefined = Account | undefined,
  TChainOverride extends Chain | undefined = Chain | undefined,
> = Omit<
  WriteContractParameters<
    typeof panopticPoolABI,
    "burnOptions",
    TChain,
    TAccount,
    TChainOverride
  >,
  "args" | "address" | "abi" | "functionName"
> & { args: PanopticBurnOptionsParameters };

export const writePanopticBurnOptions = <
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  {
    args: { position },
    ...request
  }: WritePanopticBurnOptionsParameters<TChain, TAccount, TChainOverride>,
): Promise<WriteContractReturnType> =>
  writeContract(client, {
    address: position.pool.address,
    abi: panopticPoolABI,
    functionName: "burnOptions",
    args: [position.id, 0, 0],
    ...request,
  } as unknown as WriteContractParameters<
    typeof panopticPoolABI,
    "burnOptions",
    TChain,
    TAccount,
    TChainOverride
  >);
