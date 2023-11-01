import type { Chain, Client, Transport } from "viem";
import {
  type GetPanopticCheckCollateralParameters,
  getPanopticCheckCollateral,
} from "../publicActions/getPanopticCheckCollateral.js";
import {
  type GetPanopticCollateralDataParameters,
  getPanopticCollateralData,
} from "../publicActions/getPanopticCollateralData.js";
import {
  type GetPanopticCollateralPositionDataParameters,
  getPanopticCollateralPositionData,
} from "../publicActions/getPanopticCollateralPositionData.js";
import {
  type GetPanopticFindLiquidationPriceDownParameters,
  getPanopticFindLiquidationPriceDown,
} from "../publicActions/getPanopticFindLiquidationPriceDown.js";
import {
  type GetPanopticFindLiquidationPriceUpParameters,
  getPanopticFindLiquidationPriceUp,
} from "../publicActions/getPanopticFindLiquidationPriceUp.js";
import {
  type GetPanopticPoolParameters,
  getPanopticPool,
} from "../publicActions/getPanopticPool.js";
import {
  type GetPanopticPoolDataParameters,
  getPanopticPoolData,
} from "../publicActions/getPanopticPoolData.js";
import {
  type GetPanopticPositionDataParameters,
  getPanopticPositionData,
} from "../publicActions/getPanopticPositionData.js";
import {
  type GetPanoptionLegDataParameters,
  getPanoptionLegData,
} from "../publicActions/getPanoptionLegData.js";
import {
  type SimulatePanopticBurnOptionsParameters,
  simulatePanopticBurnOptions,
} from "../publicActions/simulatePanopticBurnOptions.js";
import {
  type SimulatePanopticCollateralDepositParameters,
  simulatePanopticCollateralDeposit,
} from "../publicActions/simulatePanopticCollateralDeposit.js";
import {
  type SimulatePanopticCollateralMintParameters,
  simulatePanopticCollateralMint,
} from "../publicActions/simulatePanopticCollateralMint.js";
import {
  type SimulatePanopticCollateralRedeemParameters,
  simulatePanopticCollateralRedeem,
} from "../publicActions/simulatePanopticCollateralRedeem.js";
import {
  type SimulatePanopticCollateralWithdrawParameters,
  simulatePanopticCollateralWithdraw,
} from "../publicActions/simulatePanopticCollateralWithdraw.js";
import {
  type SimulatePanopticDeployNewPoolParameters,
  simulatePanopticDeployNewPool,
} from "../publicActions/simulatePanopticDeployNewPool.js";
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
import {
  type SimulatePanopticSFPMBurnTokenizedPositionParameters,
  simulatePanopticSFPMBurnTokenizedPosition,
} from "../publicActions/simulatePanopticSFPMBurnTokenizedPosition.js";
import {
  type SimulatePanopticSFPMInitializeAMMPoolParameters,
  simulatePanopticSFPMInitializeAMMPool,
} from "../publicActions/simulatePanopticSFPMInitializeAMMPool.js";
import {
  type SimulatePanopticSFPMMintTokenizedPositionParameters,
  simulatePanopticSFPMMintTokenizedPosition,
} from "../publicActions/simulatePanopticSFPMMintTokenizedPosition.js";
import {
  type SimulatePanopticSFPMRollTokenizedPositionsParameters,
  simulatePanopticSFPMRollTokenizedPositions,
} from "../publicActions/simulatePanopticSFPMRollTokenizedPositions.js";
import type { PanopticCollateral } from "../types/PanopticCollateral.js";
import type { PanopticPosition } from "../types/index.js";

export const publicActionPanoptic = <
  TChain extends Chain | undefined = Chain | undefined,
>(
  client: Client<Transport, TChain>,
) => ({
  getPanopticPool: (args: GetPanopticPoolParameters) =>
    getPanopticPool(client, args),
  getPanopticPoolData: (args: GetPanopticPoolDataParameters) =>
    getPanopticPoolData(client, args),
  getPanopticCollateralData: (args: GetPanopticCollateralDataParameters) =>
    getPanopticCollateralData(client, args),
  getPanopticCollateralPositionData: (
    args: GetPanopticCollateralPositionDataParameters,
  ) => getPanopticCollateralPositionData(client, args),
  getPanoptionLegData: (args: GetPanoptionLegDataParameters) =>
    getPanoptionLegData(client, args),
  getPanopticPositionData: (args: GetPanopticPositionDataParameters) =>
    getPanopticPositionData(client, args),

  getPanopticCheckCollateral: <TPanopticPosition extends PanopticPosition>(
    args: GetPanopticCheckCollateralParameters<TPanopticPosition>,
  ) => getPanopticCheckCollateral(client, args),
  getPanopticFindLiquidationPriceUp: <
    TPanopticPosition extends PanopticPosition,
  >(
    args: GetPanopticFindLiquidationPriceUpParameters<TPanopticPosition>,
  ) => getPanopticFindLiquidationPriceUp(client, args),
  getPanopticFindLiquidationPriceDown: <
    TPanopticPosition extends PanopticPosition,
  >(
    args: GetPanopticFindLiquidationPriceDownParameters<TPanopticPosition>,
  ) => getPanopticFindLiquidationPriceDown(client, args),

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

  simulatePanopticDeployNewPool: (
    args: SimulatePanopticDeployNewPoolParameters<TChain>,
  ) => simulatePanopticDeployNewPool(client, args),
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

  simulatePanopticSFPMInitializeAMMPool: (
    args: SimulatePanopticSFPMInitializeAMMPoolParameters<TChain>,
  ) => simulatePanopticSFPMInitializeAMMPool(client, args),
  simulatePanopticSFPMMintTokenizedPosition: (
    args: SimulatePanopticSFPMMintTokenizedPositionParameters<TChain>,
  ) => simulatePanopticSFPMMintTokenizedPosition(client, args),
  simulatePanopticSFPMBurnTokenizedPosition: (
    args: SimulatePanopticSFPMBurnTokenizedPositionParameters<TChain>,
  ) => simulatePanopticSFPMBurnTokenizedPosition(client, args),
  simulatePanopticRollTokenizedPositions: (
    args: SimulatePanopticSFPMRollTokenizedPositionsParameters<TChain>,
  ) => simulatePanopticSFPMRollTokenizedPositions(client, args),
});
