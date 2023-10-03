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

export type PanopticSFPMMintTokenizedPositionParameters = {
  position: PanopticSemiFungiblePosition;
  amount: bigint;
};

export type SimulatePanopticSFPMMintTokenizedPositionParameters<
  TChain extends Chain | undefined = Chain,
  TChainOverride extends Chain | undefined = Chain | undefined,
> = Omit<
  SimulateContractParameters<
    typeof semiFungiblePositionManagerABI,
    "mintTokenizedPosition",
    TChain,
    TChainOverride
  >,
  "args" | "address" | "abi" | "functionName"
> & { args: PanopticSFPMMintTokenizedPositionParameters };

export type SimulatePanopticSFPMMintTokenizedPositionReturnType<
  TChain extends Chain | undefined,
  TChainOverride extends Chain | undefined = undefined,
> = SimulateContractReturnType<
  typeof semiFungiblePositionManagerABI,
  "mintTokenizedPosition",
  TChain,
  TChainOverride
>;

export const simulatePanopticSFPMMintTokenizedPosition = <
  TChain extends Chain | undefined,
  TChainOverride extends Chain | undefined,
>(
  client: Client<Transport, TChain>,
  {
    args: { position, amount },
    ...request
  }: SimulatePanopticSFPMMintTokenizedPositionParameters<
    TChain,
    TChainOverride
  >,
): Promise<
  SimulatePanopticSFPMMintTokenizedPositionReturnType<TChain, TChainOverride>
> =>
  simulateContract(client, {
    address: position.address,
    abi: semiFungiblePositionManagerABI,
    functionName: "mintTokenizedPosition",
    args: [position.id, amount, MIN_TICK, MAX_TICK],
    ...request,
  } as unknown as SimulateContractParameters<
    typeof semiFungiblePositionManagerABI,
    "mintTokenizedPosition",
    TChain,
    TChainOverride
  >);
