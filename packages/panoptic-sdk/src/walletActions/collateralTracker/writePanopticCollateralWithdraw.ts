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

export type PanopticCollateralWithdrawParameters<
  TPanopticCollateral extends PanopticCollateral,
> = {
  amount: ERC20Amount<TPanopticCollateral["underlyingToken"]>;
  from: Address;
  to: Address;
};

export type WritePanopticCollateralWithdrawParameters<
  TPanopticCollateral extends PanopticCollateral,
  TChain extends Chain | undefined = Chain,
  TAccount extends Account | undefined = Account | undefined,
  TChainOverride extends Chain | undefined = Chain | undefined,
> = Omit<
  WriteContractParameters<
    typeof collateralTrackerABI,
    "withdraw",
    TChain,
    TAccount,
    TChainOverride
  >,
  "args" | "address" | "abi" | "functionName"
> & { args: PanopticCollateralWithdrawParameters<TPanopticCollateral> };

export const writePanopticCollateralWithdraw = <
  TPanopticCollateral extends PanopticCollateral,
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  {
    args: { amount, from, to },
    ...request
  }: WritePanopticCollateralWithdrawParameters<
    TPanopticCollateral,
    TChain,
    TAccount,
    TChainOverride
  >,
): Promise<WriteContractReturnType> =>
  writeContract(client, {
    address: amount.token.address,
    abi: collateralTrackerABI,
    functionName: "withdraw",
    args: [amount.amount, from, to],
    ...request,
  } as unknown as WriteContractParameters<
    typeof collateralTrackerABI,
    "withdraw",
    TChain,
    TAccount,
    TChainOverride
  >);
