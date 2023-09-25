import type { Chain, Client, Transport } from "viem";
import {
  type GetPanopticCollateralDataParameters,
  getPanopticCollateralData,
} from "../publicActions/getPanopticCollateralData.js";
import {
  type GetPanopticCollateralPositionDataParameters,
  getPanopticCollateralPositionData,
} from "../publicActions/getPanopticCollateralPositionData.js";
import {
  type GetPanopticPoolDataParameters,
  getPanopticPoolData,
} from "../publicActions/getPanopticPoolData.js";
import {
  type GetPanopticPositionDataParameters,
  getPanopticPositionData,
} from "../publicActions/getPanopticPositionData.js";

export const publicActionPanoptic = <
  TChain extends Chain | undefined = Chain | undefined,
>(
  client: Client<Transport, TChain>,
) => ({
  getPanopticCollateralData: (args: GetPanopticCollateralDataParameters) =>
    getPanopticCollateralData(client, args),

  getPanopticCollateralPositionData: (
    args: GetPanopticCollateralPositionDataParameters,
  ) => getPanopticCollateralPositionData(client, args),

  getPanopticPoolData: (args: GetPanopticPoolDataParameters) =>
    getPanopticPoolData(client, args),

  getPanopticPositionData: (args: GetPanopticPositionDataParameters) =>
    getPanopticPositionData(client, args),
});
