import { type ReverseMirage, getERC20BalanceOf } from "reverse-mirage";
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
  ReadContractParameters<typeof collateralTrackerABI, "asset">,
  "address" | "abi" | "functionName" | "args"
> & {
  panopticCollateral: PanopticCollateral;
  address: Address;
};

export type GetPanopticCollateralPositionDataReturnType =
  PanopticCollateralPositionData;

export const getPanopticCollateralPositionData = <
  TChain extends Chain | undefined,
  T extends "select" | undefined,
>(
  client: Client<Transport, TChain>,
  {
    panopticCollateral,
    address,
    ...request
  }: GetPanopticCollateralPositionDataParameters,
  type?: T,
) =>
  (type === undefined
    ? getERC20BalanceOf(client, {
        erc20: panopticCollateral,
        address,
        ...request,
      })
    : {
        read: () =>
          getERC20BalanceOf(
            client,
            {
              erc20: panopticCollateral,
              address,
              ...request,
            },
            "select",
          ).read(),
        parse: (data) =>
          getERC20BalanceOf(
            client,
            {
              erc20: panopticCollateral,
              address,
              ...request,
            },
            "select",
          ).parse(data),
      }) as ReverseMirage<
    bigint,
    GetPanopticCollateralPositionDataReturnType,
    T
  >;
