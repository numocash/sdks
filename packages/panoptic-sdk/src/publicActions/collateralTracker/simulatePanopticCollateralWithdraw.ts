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
import { collateralTrackerABI } from "../../generated.js";
import type { PanopticCollateral } from "../../types/PanopticCollateral.js";

export type PanopticCollateralWithdrawParameters<
  TPanopticCollateral extends PanopticCollateral,
> = {
  amount: ERC20Amount<TPanopticCollateral["underlyingToken"]>;
  from: Address;
  to: Address;
};

export type SimulatePanopticCollateralWithdrawParameters<
  TPanopticCollateral extends PanopticCollateral,
  TChain extends Chain | undefined = Chain,
  TChainOverride extends Chain | undefined = Chain | undefined,
> = Omit<
  SimulateContractParameters<
    typeof collateralTrackerABI,
    "withdraw",
    TChain,
    TChainOverride
  >,
  "args" | "address" | "abi" | "functionName"
> & { args: PanopticCollateralWithdrawParameters<TPanopticCollateral> };

export type SimulatePanopticCollateralWithdrawReturnType<
  TChain extends Chain | undefined,
  TChainOverride extends Chain | undefined = undefined,
> = SimulateContractReturnType<
  typeof collateralTrackerABI,
  "withdraw",
  TChain,
  TChainOverride
>;

export const simulatePanopticCollateralWithdraw = <
  TPanopticCollateral extends PanopticCollateral,
  TChain extends Chain | undefined,
  TChainOverride extends Chain | undefined,
>(
  client: Client<Transport, TChain>,
  {
    args: { amount, to, from },
    ...request
  }: SimulatePanopticCollateralWithdrawParameters<
    TPanopticCollateral,
    TChain,
    TChainOverride
  >,
): Promise<
  SimulatePanopticCollateralWithdrawReturnType<TChain, TChainOverride>
> =>
  simulateContract(client, {
    address: amount.token.address,
    abi: collateralTrackerABI,
    functionName: "withdraw",
    args: [amount.amount, from, to],
    ...request,
  } as unknown as SimulateContractParameters<
    typeof collateralTrackerABI,
    "withdraw",
    TChain,
    TChainOverride
  >);
