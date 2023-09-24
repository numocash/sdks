import { type ReverseMirage, createAmountFromRaw } from "reverse-mirage";
import type { Chain, Client, ReadContractParameters, Transport } from "viem";
import { readContract } from "viem/actions";
import { collateralTrackerABI } from "../generated.js";
import type {
  PanopticCollateral,
  PanopticCollateralData,
} from "../types/PanopticCollateral.js";

export type GetPanopticCollateralDataParameters = Omit<
  ReadContractParameters<typeof collateralTrackerABI, "totalSupply">,
  "address" | "abi" | "functionName" | "args"
> & {
  panopticCollateral: PanopticCollateral;
};

export type GetPanopticCollateralDataReturnType = PanopticCollateralData;

export const getPanopticCollateralData = <
  TChain extends Chain | undefined,
  T extends "select" | undefined,
>(
  client: Client<Transport, TChain>,
  { panopticCollateral, ...request }: GetPanopticCollateralDataParameters,
  type?: T,
) =>
  (type === undefined
    ? Promise.all([
        readContract(client, {
          abi: collateralTrackerABI,
          functionName: "totalSupply",
          address: panopticCollateral.address,
          ...request,
        }),
        readContract(client, {
          abi: collateralTrackerABI,
          functionName: "getPoolData",
          address: panopticCollateral.address,
          ...request,
        }),
      ]).then(([totalSupply, poolData]) => ({
        type: "panopticCollateralData",
        collateral: panopticCollateral,
        totalSupply: createAmountFromRaw(panopticCollateral, totalSupply),
        poolAssets: createAmountFromRaw(
          panopticCollateral.underlyingToken,
          poolData[0],
        ),
        inAmm: createAmountFromRaw(
          panopticCollateral.underlyingToken,
          poolData[1],
        ),
      }))
    : {
        read: () =>
          Promise.all([
            readContract(client, {
              abi: collateralTrackerABI,
              functionName: "totalSupply",
              address: panopticCollateral.address,
              ...request,
            }),
            readContract(client, {
              abi: collateralTrackerABI,
              functionName: "getPoolData",
              address: panopticCollateral.address,
              ...request,
            }),
          ]),
        parse: ([totalSupply, poolData]) => ({
          type: "panopticCollateralData",
          collateral: panopticCollateral,
          totalSupply: createAmountFromRaw(panopticCollateral, totalSupply),
          poolAssets: createAmountFromRaw(
            panopticCollateral.underlyingToken,
            poolData[0],
          ),
          inAmm: createAmountFromRaw(
            panopticCollateral.underlyingToken,
            poolData[1],
          ),
        }),
      }) as ReverseMirage<
    [bigint, [bigint, bigint, bigint]],
    GetPanopticCollateralDataReturnType,
    T
  >;
