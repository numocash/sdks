import {
  type ERC20Amount,
  amountEqualTo,
  createAmountFromRaw,
} from "reverse-mirage";
import type { PanopticCollateralData } from "../../types/PanopticCollateral.js";

export const calculatePanopticCollateralRedeem = <
  TPanopticCollateralData extends PanopticCollateralData,
>({
  collateralData,
  amount,
}: {
  collateralData: TPanopticCollateralData;
  amount: ERC20Amount<TPanopticCollateralData["collateral"]>;
}): ERC20Amount<TPanopticCollateralData["collateral"]["underlyingToken"]> => {
  // TODO: poke panoptic median

  const assets = amountEqualTo(collateralData.totalSupply, 0)
    ? amount.amount
    : (amount.amount *
        (collateralData.inAmm.amount + collateralData.poolAssets.amount)) /
      collateralData.totalSupply.amount;

  // TODO: error for too large

  collateralData.poolAssets.amount -= assets;
  collateralData.totalSupply.amount -= amount.amount;

  return createAmountFromRaw(collateralData.collateral.underlyingToken, assets);
};
