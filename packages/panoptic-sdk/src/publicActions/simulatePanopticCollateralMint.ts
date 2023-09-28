import type { ERC20Amount } from "reverse-mirage";
import type {
  Address,
  Chain,
  Client,
  SimulateContractParameters,
  SimulateContractReturnType,
  Transport,
} from "viem";
import { simulateContract } from "viem/contract";
import { collateralTrackerABI } from "../generated.js";
import type { PanopticCollateral } from "../types/PanopticCollateral.js";

export type PanopticCollateralMintParameters<
  TPanopticCollateral extends PanopticCollateral,
> = {
  amount: ERC20Amount<TPanopticCollateral>;
  to: Address;
};

export type SimulatePanopticCollateralMintParameters<
  TPanopticCollateral extends PanopticCollateral,
  TChain extends Chain | undefined = Chain,
  TChainOverride extends Chain | undefined = Chain | undefined,
> = Omit<
  SimulateContractParameters<
    typeof collateralTrackerABI,
    "mint",
    TChain,
    TChainOverride
  >,
  "args" | "address" | "abi" | "functionName"
> & { args: PanopticCollateralMintParameters<TPanopticCollateral> };

export type SimulatePanopticCollateralMintReturnType<
  TChain extends Chain | undefined,
  TChainOverride extends Chain | undefined = undefined,
> = SimulateContractReturnType<
  typeof collateralTrackerABI,
  "mint",
  TChain,
  TChainOverride
>;

export const simulatePanopticCollateralMint = <
  TPanopticCollateral extends PanopticCollateral,
  TChain extends Chain | undefined,
  TChainOverride extends Chain | undefined,
>(
  client: Client<Transport, TChain>,
  {
    args: { amount, to },
    ...request
  }: SimulatePanopticCollateralMintParameters<
    TPanopticCollateral,
    TChain,
    TChainOverride
  >,
): Promise<SimulatePanopticCollateralMintReturnType<TChain, TChainOverride>> =>
  simulateContract(client, {
    address: amount.token.address,
    abi: collateralTrackerABI,
    functionName: "mint",
    args: [amount.amount, to],
    ...request,
  } as unknown as SimulateContractParameters<
    typeof collateralTrackerABI,
    "mint",
    TChain,
    TChainOverride
  >);
