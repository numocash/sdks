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

export type PanopticCollateralMintParameters<
  TPanopticCollateral extends PanopticCollateral,
> = {
  amount: ERC20Amount<TPanopticCollateral>;
  to: Address;
};

export type WritePanopticCollateralMintParameters<
  TPanopticCollateral extends PanopticCollateral,
  TChain extends Chain | undefined = Chain,
  TAccount extends Account | undefined = Account | undefined,
  TChainOverride extends Chain | undefined = Chain | undefined,
> = Omit<
  WriteContractParameters<
    typeof collateralTrackerABI,
    "mint",
    TChain,
    TAccount,
    TChainOverride
  >,
  "args" | "address" | "abi" | "functionName"
> & { args: PanopticCollateralMintParameters<TPanopticCollateral> };

export const writePanopticCollateralMint = <
  TPanopticCollateral extends PanopticCollateral,
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  {
    args: { amount, to },
    ...request
  }: WritePanopticCollateralMintParameters<
    TPanopticCollateral,
    TChain,
    TAccount,
    TChainOverride
  >,
): Promise<WriteContractReturnType> =>
  writeContract(client, {
    address: amount.token.address,
    abi: collateralTrackerABI,
    functionName: "mint",
    args: [amount.amount, to],
    ...request,
  } as unknown as WriteContractParameters<
    typeof collateralTrackerABI,
    "mint",
    TChain,
    TAccount,
    TChainOverride
  >);
