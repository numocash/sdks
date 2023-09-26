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
import { collateralTrackerABI } from "../../abi/collateralTracker.js";
import type { PanopticCollateral } from "../../types/PanopticCollateral.js";

export type PanopticCollateralDepositParameters<
  TPanopticCollateral extends PanopticCollateral,
> = {
  amount: ERC20Amount<TPanopticCollateral["underlyingToken"]>;
  to: Address;
};

export type WritePanopticCollateralDepositParameters<
  TPanopticCollateral extends PanopticCollateral,
  TChain extends Chain | undefined = Chain,
  TAccount extends Account | undefined = Account | undefined,
  TChainOverride extends Chain | undefined = Chain | undefined,
> = Omit<
  WriteContractParameters<
    typeof collateralTrackerABI,
    "deposit",
    TChain,
    TAccount,
    TChainOverride
  >,
  "args" | "address" | "abi" | "functionName"
> & { args: PanopticCollateralDepositParameters<TPanopticCollateral> };

export const writePanopticCollateralDeposit = <
  TPanopticCollateral extends PanopticCollateral,
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  {
    args: { amount, to },
    ...request
  }: WritePanopticCollateralDepositParameters<
    TPanopticCollateral,
    TChain,
    TAccount,
    TChainOverride
  >,
): Promise<WriteContractReturnType> =>
  writeContract(client, {
    address: amount.token.address,
    abi: collateralTrackerABI,
    functionName: "deposit",
    args: [amount.amount, to],
    ...request,
  } as unknown as WriteContractParameters<
    typeof collateralTrackerABI,
    "deposit",
    TChain,
    TAccount,
    TChainOverride
  >);
