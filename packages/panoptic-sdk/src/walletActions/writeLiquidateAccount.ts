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

export type PanopticLiquidateAccountParameters = {
  position: PanopticPosition;
};

export type WritePanopticLiquidateAccountParameters<
  TChain extends Chain | undefined = Chain,
  TAccount extends Account | undefined = Account | undefined,
  TChainOverride extends Chain | undefined = Chain | undefined,
> = Omit<
  WriteContractParameters<
    typeof panopticPoolABI,
    "liquidateAccount",
    TChain,
    TAccount,
    TChainOverride
  >,
  "args" | "address" | "abi" | "functionName"
> & { args: PanopticLiquidateAccountParameters };

export const writePanopticLiquidateAccount = <
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  {
    args: { position },
    ...request
  }: WritePanopticLiquidateAccountParameters<TChain, TAccount, TChainOverride>,
): Promise<WriteContractReturnType> =>
  writeContract(client, {
    address: position.pool.address,
    abi: panopticPoolABI,
    functionName: "liquidateAccount",
    args: [position.owner, 0, 0, [position.id]],
    ...request,
  } as unknown as WriteContractParameters<
    typeof panopticPoolABI,
    "liquidateAccount",
    TChain,
    TAccount,
    TChainOverride
  >);
