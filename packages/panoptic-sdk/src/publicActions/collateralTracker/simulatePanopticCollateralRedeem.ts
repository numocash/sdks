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

export type PanopticCollateralRedeemParameters<
  TPanopticCollateral extends PanopticCollateral,
> = {
  amount: ERC20Amount<TPanopticCollateral>;
  from: Address;
  to: Address;
};

export type SimulatePanopticCollateralRedeemParameters<
  TPanopticCollateral extends PanopticCollateral,
  TChain extends Chain | undefined = Chain,
  TChainOverride extends Chain | undefined = Chain | undefined,
> = Omit<
  SimulateContractParameters<
    typeof collateralTrackerABI,
    "redeem",
    TChain,
    TChainOverride
  >,
  "args" | "address" | "abi" | "functionName"
> & { args: PanopticCollateralRedeemParameters<TPanopticCollateral> };

export type SimulatePanopticCollateralRedeemReturnType<
  TChain extends Chain | undefined,
  TChainOverride extends Chain | undefined = undefined,
> = SimulateContractReturnType<
  typeof collateralTrackerABI,
  "redeem",
  TChain,
  TChainOverride
>;

export const simulatePanopticCollateralRedeem = <
  TPanopticCollateral extends PanopticCollateral,
  TChain extends Chain | undefined,
  TChainOverride extends Chain | undefined,
>(
  client: Client<Transport, TChain>,
  {
    args: { amount, from, to },
    ...request
  }: SimulatePanopticCollateralRedeemParameters<
    TPanopticCollateral,
    TChain,
    TChainOverride
  >,
): Promise<
  SimulatePanopticCollateralRedeemReturnType<TChain, TChainOverride>
> =>
  simulateContract(client, {
    address: amount.token.address,
    abi: collateralTrackerABI,
    functionName: "redeem",
    args: [amount.amount, from, to],
    ...request,
  } as unknown as SimulateContractParameters<
    typeof collateralTrackerABI,
    "redeem",
    TChain,
    TChainOverride
  >);
