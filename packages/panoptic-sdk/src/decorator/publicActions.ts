import type { Chain, Client, Transport } from "viem";
import {
  type SimulatePanopticCollateralDepositParameters,
  simulatePanopticCollateralDeposit,
} from "../publicActions/collateralTracker/simulatePanopticCollateralDeposit.js";
import {
  type SimulatePanopticCollateralMintParameters,
  simulatePanopticCollateralMint,
} from "../publicActions/collateralTracker/simulatePanopticCollateralMint.js";
import {
  type SimulatePanopticCollateralRedeemParameters,
  simulatePanopticCollateralRedeem,
} from "../publicActions/collateralTracker/simulatePanopticCollateralRedeem.js";
import {
  type SimulatePanopticCollateralWithdrawParameters,
  simulatePanopticCollateralWithdraw,
} from "../publicActions/collateralTracker/simulatePanopticCollateralWithdraw.js";
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
import {
  type SimulatePanopticBurnOptionsParameters,
  simulatePanopticBurnOptions,
} from "../publicActions/simulatePanopticBurnOptions.js";
import {
  type SimulatePanopticForceExerciseParameters,
  simulatePanopticForceExercise,
} from "../publicActions/simulatePanopticForceExercise.js";
import {
  type SimulatePanopticLiquidateAccountParameters,
  simulatePanopticLiquidateAccount,
} from "../publicActions/simulatePanopticLiquidateAccount.js";
import {
  type SimulatePanopticMintOptionsParameters,
  simulatePanopticMintOptions,
} from "../publicActions/simulatePanopticMintOptions.js";
import {
  type SimulatePanopticRollOptionsParameters,
  simulatePanopticRollOptions,
} from "../publicActions/simulatePanopticRollOptions.js";
import type { PanopticCollateral } from "../types/PanopticCollateral.js";

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
  simulatePanopticCollateralDeposit: <
    TPanopticCollateral extends PanopticCollateral,
  >(
    args: SimulatePanopticCollateralDepositParameters<
      TPanopticCollateral,
      TChain
    >,
  ) => simulatePanopticCollateralDeposit(client, args),
  simulatePanopticCollateralMint: <
    TPanopticCollateral extends PanopticCollateral,
  >(
    args: SimulatePanopticCollateralMintParameters<TPanopticCollateral, TChain>,
  ) => simulatePanopticCollateralMint(client, args),
  simulatePanopticCollateralWithdraw: <
    TPanopticCollateral extends PanopticCollateral,
  >(
    args: SimulatePanopticCollateralWithdrawParameters<
      TPanopticCollateral,
      TChain
    >,
  ) => simulatePanopticCollateralWithdraw(client, args),
  simulatePanopticCollateralRedeem: <
    TPanopticCollateral extends PanopticCollateral,
  >(
    args: SimulatePanopticCollateralRedeemParameters<
      TPanopticCollateral,
      TChain
    >,
  ) => simulatePanopticCollateralRedeem(client, args),

  simulatePanopticMintOptions: (
    args: SimulatePanopticMintOptionsParameters<TChain>,
  ) => simulatePanopticMintOptions(client, args),
  simulatePanopticRollOptions: (
    args: SimulatePanopticRollOptionsParameters<TChain>,
  ) => simulatePanopticRollOptions(client, args),
  simulatePanopticBurnOptions: (
    args: SimulatePanopticBurnOptionsParameters<TChain>,
  ) => simulatePanopticBurnOptions(client, args),
  simulatePanopticForceExercise: (
    args: SimulatePanopticForceExerciseParameters<TChain>,
  ) => simulatePanopticForceExercise(client, args),
  simulatePanopticLiquidateAccount: (
    args: SimulatePanopticLiquidateAccountParameters<TChain>,
  ) => simulatePanopticLiquidateAccount(client, args),
});
