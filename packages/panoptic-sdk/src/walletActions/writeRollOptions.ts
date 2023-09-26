import type {
  Account,
  Chain,
  Client,
  Transport,
  WriteContractParameters,
  WriteContractReturnType,
} from "viem";
import { writeContract } from "viem/contract";
import { panopticPoolABI } from "../abi/panopticPool.js";
import type { PanopticPosition } from "../types/PanopticPosition.js";

export type PanopticRollptionsParameters = {
  oldPosition: PanopticPosition;
  newPosition: PanopticPosition;
};

export type WritePanopticRollptionsParameters<
  TChain extends Chain | undefined = Chain,
  TAccount extends Account | undefined = Account | undefined,
  TChainOverride extends Chain | undefined = Chain | undefined,
> = Omit<
  WriteContractParameters<
    typeof panopticPoolABI,
    "rollOptions",
    TChain,
    TAccount,
    TChainOverride
  >,
  "args" | "address" | "abi" | "functionName"
> & { args: PanopticRollptionsParameters };

export const writePanopticRollptions = <
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  {
    args: { oldPosition, newPosition },
    ...request
  }: WritePanopticRollptionsParameters<TChain, TAccount, TChainOverride>,
): Promise<WriteContractReturnType> =>
  writeContract(client, {
    address: newPosition.pool.address,
    abi: panopticPoolABI,
    functionName: "rollOptions",
    args: [oldPosition.id, newPosition.id, [oldPosition.id], 0, 0],
    ...request,
  } as unknown as WriteContractParameters<
    typeof panopticPoolABI,
    "rollOptions",
    TChain,
    TAccount,
    TChainOverride
  >);
