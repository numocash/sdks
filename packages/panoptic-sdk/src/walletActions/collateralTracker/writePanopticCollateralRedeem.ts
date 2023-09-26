import type { ERC20Amount } from "reverse-mirage";
import type {
  Account,
  Address,
  Chain,
  Client,
  Transport,
  WriteContractParameters,
  WriteContractReturnType,
} from "viem";
import { writeContract } from "viem/contract";
import { collateralTrackerABI } from "../../generated.js";
import type { PanopticCollateral } from "../../types/PanopticCollateral.js";

export type PanopticCollateralRedeemParameters<
  TPanopticCollateral extends PanopticCollateral,
> = {
  amount: ERC20Amount<TPanopticCollateral>;
  from: Address;
  to: Address;
};

export type WritePanopticCollateralRedeemParameters<
  TPanopticCollateral extends PanopticCollateral,
  TChain extends Chain | undefined = Chain,
  TAccount extends Account | undefined = Account | undefined,
  TChainOverride extends Chain | undefined = Chain | undefined,
> = Omit<
  WriteContractParameters<
    typeof collateralTrackerABI,
    "redeem",
    TChain,
    TAccount,
    TChainOverride
  >,
  "args" | "address" | "abi" | "functionName"
> & { args: PanopticCollateralRedeemParameters<TPanopticCollateral> };

export const writePanopticCollateralRedeem = <
  TPanopticCollateral extends PanopticCollateral,
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  {
    args: { amount, to, from },
    ...request
  }: WritePanopticCollateralRedeemParameters<
    TPanopticCollateral,
    TChain,
    TAccount,
    TChainOverride
  >,
): Promise<WriteContractReturnType> =>
  writeContract(client, {
    address: amount.token.address,
    abi: collateralTrackerABI,
    functionName: "redeem",
    args: [amount.amount, from, to],
    ...request,
  } as unknown as WriteContractParameters<
    typeof collateralTrackerABI,
    "redeem",
    TChain,
    TAccount,
    TChainOverride
  >);
