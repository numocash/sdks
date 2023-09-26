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

export type PanopticForceExerciseParameters = {
  position: PanopticPosition;
};

export type WritePanopticForceExerciseParameters<
  TChain extends Chain | undefined = Chain,
  TAccount extends Account | undefined = Account | undefined,
  TChainOverride extends Chain | undefined = Chain | undefined,
> = Omit<
  WriteContractParameters<
    typeof panopticPoolABI,
    "forceExercise",
    TChain,
    TAccount,
    TChainOverride
  >,
  "args" | "address" | "abi" | "functionName"
> & { args: PanopticForceExerciseParameters };

export const writePanopticForceExercise = <
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  {
    args: { position },
    ...request
  }: WritePanopticForceExerciseParameters<TChain, TAccount, TChainOverride>,
): Promise<WriteContractReturnType> =>
  writeContract(client, {
    address: position.pool.address,
    abi: panopticPoolABI,
    functionName: "forceExercise",
    args: [position.owner, 0, 0, [position.id], []],
    ...request,
  } as unknown as WriteContractParameters<
    typeof panopticPoolABI,
    "forceExercise",
    TChain,
    TAccount,
    TChainOverride
  >);
