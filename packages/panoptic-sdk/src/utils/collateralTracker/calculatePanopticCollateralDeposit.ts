import {
  type ERC20Amount,
  amountEqualTo,
  createAmountFromRaw,
} from "reverse-mirage";
import type {
  PanopticCollateralData,
  PanopticCollateralPositionData,
} from "../../types/PanopticCollateral.js";

export const calculatePanopticCollateralDeposit = <
  TPanopticCollateralData extends PanopticCollateralData,
>({
  collateralData,
  amount,
}: {
  collateralData: TPanopticCollateralData;
  amount: ERC20Amount<TPanopticCollateralData["collateral"]["underlyingToken"]>;
}): PanopticCollateralPositionData => {
  // TODO: error for too large
  // TODO: poke panoptic median

  const amountSubFee =
    amount.amount -
    (amount.amount *
      collateralData.collateral.parameters.commissionFee.numerator) /
      collateralData.collateral.parameters.commissionFee.denominator;

  const shares = amountEqualTo(collateralData.totalSupply, 0)
    ? amountSubFee
    : (amountSubFee * collateralData.totalSupply.amount) /
      (collateralData.inAmm.amount + collateralData.poolAssets.amount);

  collateralData.poolAssets.amount += amount.amount;
  collateralData.totalSupply.amount += shares;

  return createAmountFromRaw(collateralData.collateral, shares);
};
