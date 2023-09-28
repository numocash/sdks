import {
  type ERC20Amount,
  amountEqualTo,
  createAmountFromRaw,
} from "reverse-mirage";
import type { PanopticCollateralData } from "../../types/PanopticCollateral.js";

export const calculatePanopticCollateralMint = <
  TPanopticCollateralData extends PanopticCollateralData,
>({
  collateralData,
  amount,
}: {
  collateralData: TPanopticCollateralData;
  amount: ERC20Amount<TPanopticCollateralData["collateral"]>;
}): ERC20Amount<TPanopticCollateralData["collateral"]["underlyingToken"]> => {
  // TODO: poke panoptic median

  const assetsSubFee = amountEqualTo(collateralData.totalSupply, 0)
    ? amount.amount
    : (amount.amount *
        (collateralData.inAmm.amount + collateralData.poolAssets.amount)) %
        collateralData.totalSupply.amount !==
      0n
    ? ((amount.amount *
        (collateralData.inAmm.amount + collateralData.poolAssets.amount)) %
        collateralData.totalSupply.amount) +
      1n
    : (amount.amount *
        (collateralData.inAmm.amount + collateralData.poolAssets.amount)) %
      collateralData.totalSupply.amount;

  const assets =
    assetsSubFee +
    (assetsSubFee *
      collateralData.collateral.parameters.commissionFee.numerator) /
      collateralData.collateral.parameters.commissionFee.denominator;

  // TODO: error for too large

  collateralData.poolAssets.amount += assets;
  collateralData.totalSupply.amount += amount.amount;

  return createAmountFromRaw(collateralData.collateral.underlyingToken, assets);
};
