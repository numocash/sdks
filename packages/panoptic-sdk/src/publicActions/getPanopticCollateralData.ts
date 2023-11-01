import { createAmountFromRaw } from "reverse-mirage";
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
  collateral: PanopticCollateral;
};

export type GetPanopticCollateralDataReturnType = PanopticCollateralData;

export const getPanopticCollateralData = <TChain extends Chain | undefined,>(
  client: Client<Transport, TChain>,
  { collateral, ...request }: GetPanopticCollateralDataParameters,
): Promise<GetPanopticCollateralDataReturnType> =>
  Promise.all([
    readContract(client, {
      abi: collateralTrackerABI,
      functionName: "totalSupply",
      address: collateral.address,
      ...request,
    }),
    readContract(client, {
      abi: collateralTrackerABI,
      functionName: "getPoolData",
      address: collateral.address,
      ...request,
    }),
  ]).then(([totalSupply, poolData]) => ({
    type: "panopticCollateralData",
    collateral: collateral,
    totalSupply: createAmountFromRaw(collateral, totalSupply),
    poolAssets: createAmountFromRaw(collateral.underlyingToken, poolData[0]),
    inAmm: createAmountFromRaw(collateral.underlyingToken, poolData[1]),
  }));
