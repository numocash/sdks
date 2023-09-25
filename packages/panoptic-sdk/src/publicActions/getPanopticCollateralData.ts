import { createAmountFromRaw } from "reverse-mirage";
import type { Chain, Client, ReadContractParameters, Transport } from "viem";
import { readContract } from "viem/actions";
import { collateralTrackerABI } from "../abi/collateralTracker.js";
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

export const getPanopticCollateralData = <TChain extends Chain | undefined,>(
  client: Client<Transport, TChain>,
  { panopticCollateral, ...request }: GetPanopticCollateralDataParameters,
): Promise<GetPanopticCollateralDataReturnType> =>
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
  ]).then(([totalSupply, poolData]) => ({
    type: "panopticCollateralData",
    collateral: panopticCollateral,
    totalSupply: createAmountFromRaw(panopticCollateral, totalSupply),
    poolAssets: createAmountFromRaw(
      panopticCollateral.underlyingToken,
      poolData[0],
    ),
    inAmm: createAmountFromRaw(panopticCollateral.underlyingToken, poolData[1]),
  }));
