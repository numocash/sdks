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

export type PanopticCollateralDepositParameters<
  TPanopticCollateral extends PanopticCollateral,
> = {
  collateral: TPanopticCollateral;
  amount: ERC20Amount<TPanopticCollateral["underlyingToken"]>;
  to: Address;
};

export type SimulatePanopticCollateralDepositParameters<
  TPanopticCollateral extends PanopticCollateral,
  TChain extends Chain | undefined = Chain,
  TChainOverride extends Chain | undefined = Chain | undefined,
> = Omit<
  SimulateContractParameters<
    typeof collateralTrackerABI,
    "deposit",
    TChain,
    TChainOverride
  >,
  "args" | "address" | "abi" | "functionName"
> & { args: PanopticCollateralDepositParameters<TPanopticCollateral> };

export type SimulatePanopticCollateralDepositReturnType<
  TChain extends Chain | undefined,
  TChainOverride extends Chain | undefined = undefined,
> = SimulateContractReturnType<
  typeof collateralTrackerABI,
  "deposit",
  TChain,
  TChainOverride
>;

export const simulatePanopticCollateralDeposit = <
  TPanopticCollateral extends PanopticCollateral,
  TChain extends Chain | undefined,
  TChainOverride extends Chain | undefined,
>(
  client: Client<Transport, TChain>,
  {
    args: { collateral, amount, to },
    ...request
  }: SimulatePanopticCollateralDepositParameters<
    TPanopticCollateral,
    TChain,
    TChainOverride
  >,
): Promise<
  SimulatePanopticCollateralDepositReturnType<TChain, TChainOverride>
> =>
  simulateContract(client, {
    address: collateral.address,
    abi: collateralTrackerABI,
    functionName: "deposit",
    args: [amount.amount, to],
    ...request,
  } as unknown as SimulateContractParameters<
    typeof collateralTrackerABI,
    "deposit",
    TChain,
    TChainOverride
  >);
