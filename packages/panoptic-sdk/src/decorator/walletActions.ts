import type { Account, Chain, Client, Transport } from "viem";
import type { PanopticCollateral } from "../types/index.js";
import {
  type WritePanopticCollateralDepositParameters,
  writePanopticCollateralDeposit,
} from "../walletActions/collateralTracker/writePanopticCollateralDeposit.js";
import {
  type WritePanopticCollateralMintParameters,
  writePanopticCollateralMint,
} from "../walletActions/collateralTracker/writePanopticCollateralMint.js";
import {
  type WritePanopticCollateralRedeemParameters,
  writePanopticCollateralRedeem,
} from "../walletActions/collateralTracker/writePanopticCollateralRedeem.js";
import {
  type WritePanopticCollateralWithdrawParameters,
  writePanopticCollateralWithdraw,
} from "../walletActions/collateralTracker/writePanopticCollateralWithdraw.js";
import {
  type WritePanopticBurnOptionsParameters,
  writePanopticBurnOptions,
} from "../walletActions/writeBurnOptions.js";
import {
  type WritePanopticForceExerciseParameters,
  writePanopticForceExercise,
} from "../walletActions/writeForceExercise.js";
import {
  type WritePanopticLiquidateAccountParameters,
  writePanopticLiquidateAccount,
} from "../walletActions/writeLiquidateAccount.js";
import {
  type WritePanopticMintOptionsParameters,
  writePanopticMintOptions,
} from "../walletActions/writeMintOptions.js";
import {
  type WritePanopticRollOptionsParameters,
  writePanopticRollOptions,
} from "../walletActions/writeRollOptions.js";

export const walletActionPanoptic = <
  TChain extends Chain = Chain,
  TAccount extends Account | undefined = Account | undefined,
>(
  client: Client<Transport, TChain, TAccount>,
) => ({
  writePanopticCollateralDeposit: <
    TPanopticCollateral extends PanopticCollateral,
  >(
    args: WritePanopticCollateralDepositParameters<
      TPanopticCollateral,
      TChain,
      TAccount
    >,
  ) => writePanopticCollateralDeposit(client, args),
  writePanopticCollateralMint: <
    TPanopticCollateral extends PanopticCollateral,
  >(
    args: WritePanopticCollateralMintParameters<
      TPanopticCollateral,
      TChain,
      TAccount
    >,
  ) => writePanopticCollateralMint(client, args),
  writePanopticCollateralWithdraw: <
    TPanopticCollateral extends PanopticCollateral,
  >(
    args: WritePanopticCollateralWithdrawParameters<
      TPanopticCollateral,
      TChain,
      TAccount
    >,
  ) => writePanopticCollateralWithdraw(client, args),
  writePanopticCollateralRedeem: <
    TPanopticCollateral extends PanopticCollateral,
  >(
    args: WritePanopticCollateralRedeemParameters<
      TPanopticCollateral,
      TChain,
      TAccount
    >,
  ) => writePanopticCollateralRedeem(client, args),

  writePanopticMintOptions: (
    args: WritePanopticMintOptionsParameters<TChain, TAccount>,
  ) => writePanopticMintOptions(client, args),
  writePanopticRollOptions: (
    args: WritePanopticRollOptionsParameters<TChain, TAccount>,
  ) => writePanopticRollOptions(client, args),
  writePanopticBurnOptions: (
    args: WritePanopticBurnOptionsParameters<TChain, TAccount>,
  ) => writePanopticBurnOptions(client, args),
  writePanopticForceExercise: (
    args: WritePanopticForceExerciseParameters<TChain, TAccount>,
  ) => writePanopticForceExercise(client, args),
  writePanopticLiquidateAccount: (
    args: WritePanopticLiquidateAccountParameters<TChain, TAccount>,
  ) => writePanopticLiquidateAccount(client, args),
});
