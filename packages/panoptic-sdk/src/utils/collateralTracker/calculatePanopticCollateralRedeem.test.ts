import { createAmountFromString } from "reverse-mirage";
import { beforeEach, expect, test } from "vitest";
import { collateralToken0 } from "../../_test/constants.js";
import type { PanopticCollateralData } from "../../types/PanopticCollateral.js";
import { calculatePanopticCollateralRedeem } from "./calculatePanopticCollateralRedeem.js";

let collateralData: PanopticCollateralData;

beforeEach(() => {
  collateralData = {
    type: "panopticCollateralData",
    collateral: collateralToken0,
    poolAssets: createAmountFromString(
      collateralToken0.underlyingToken,
      "1.001",
    ),
    inAmm: createAmountFromString(collateralToken0.underlyingToken, "0"),
    totalSupply: createAmountFromString(collateralToken0, "1"),
  };
});

test("calculate collateral redeem", () => {
  const collateralMint = calculatePanopticCollateralRedeem({
    collateralData,
    amount: createAmountFromString(collateralToken0, "1"),
  });

  expect(collateralMint).toStrictEqual(
    createAmountFromString(collateralToken0.underlyingToken, "1.001"),
  );
  expect(collateralData.poolAssets).toStrictEqual(
    createAmountFromString(collateralToken0.underlyingToken, "0"),
  );
  expect(collateralData.totalSupply).toStrictEqual(
    createAmountFromString(collateralToken0, "0"),
  );
});
