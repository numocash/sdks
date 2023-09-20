import type { BaseERC20, ERC20Amount, Fraction } from "reverse-mirage";

export type PanopticCollateral = BaseERC20<"poERC20"> & {
  underlyingToken: BaseERC20;
};

export type PanopticCollateralParamters = {
  type: "panopticCollateralParameters";
  maintenanceMarginRatio: Fraction;
  commissionFee: Fraction;
  ITMSpreadFee: Fraction;
  sellCollateralRatio: Fraction;
  buyCollateralRatio: Fraction;
  targetPoolUtilization: Fraction;
  saturatedPoolUtilization: Fraction;
  exerciseCost: Fraction;
};

export type PanopticCollateralPositionData = ERC20Amount<PanopticCollateral> & {
  // position array
};

export type PanopticCollateralData = {
  type: "panopticCollateralData";
  collateral: PanopticCollateral;
  parameters: PanopticCollateralParamters;
  poolAssets: ERC20Amount<BaseERC20>;
  inAmm: ERC20Amount<BaseERC20>;
  totalSupply: ERC20Amount<BaseERC20>;
};
