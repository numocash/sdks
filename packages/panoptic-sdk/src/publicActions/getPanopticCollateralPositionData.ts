import { getERC20BalanceOf } from "reverse-mirage";
import type {
  Address,
  Chain,
  Client,
  ReadContractParameters,
  Transport,
} from "viem";
import type { collateralTrackerABI } from "../generated.js";
import type {
  PanopticCollateral,
  PanopticCollateralPositionData,
} from "../types/PanopticCollateral.js";

export type GetPanopticCollateralPositionDataParameters = Omit<
  ReadContractParameters<typeof collateralTrackerABI, "balanceOf">,
  "address" | "abi" | "functionName" | "args"
> & {
  panopticCollateral: PanopticCollateral;
  address: Address;
};

export type GetPanopticCollateralPositionDataReturnType =
  PanopticCollateralPositionData;

export const getPanopticCollateralPositionData = <
  TChain extends Chain | undefined,
>(
  client: Client<Transport, TChain>,
  {
    panopticCollateral,
    address,
    ...request
  }: GetPanopticCollateralPositionDataParameters,
): Promise<GetPanopticCollateralPositionDataReturnType> =>
  getERC20BalanceOf(client, {
    erc20: panopticCollateral,
    address,
    ...request,
  });
