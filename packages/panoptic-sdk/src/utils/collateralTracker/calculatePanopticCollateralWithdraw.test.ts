import { createAmountFromString } from "reverse-mirage";
import { beforeEach, expect, test } from "vitest";
import { collateralToken0 } from "../../_test/constants.js";
import type { PanopticCollateralData } from "../../types/PanopticCollateral.js";
import { calculatePanopticCollateralWithdraw } from "./calculatePanopticCollateralWithdraw.js";

let collateralData: PanopticCollateralData;

beforeEach(() => {
  collateralData = {
    type: "panopticCollateralData",
    collateral: collateralToken0,
    poolAssets: createAmountFromString(collateralToken0.underlyingToken, "1"),
    inAmm: createAmountFromString(collateralToken0.underlyingToken, "0"),
    totalSupply: createAmountFromString(collateralToken0, ".999"),
  };
});

test("calculate collateral withdraw", () => {
  const collateralWithdraw = calculatePanopticCollateralWithdraw({
    collateralData,
    amount: createAmountFromString(collateralToken0.underlyingToken, "1"),
  });

  expect(collateralWithdraw).toStrictEqual(
    createAmountFromString(collateralToken0, ".999"),
  );
  expect(collateralData.poolAssets).toStrictEqual(
    createAmountFromString(collateralToken0.underlyingToken, "0"),
  );
  expect(collateralData.totalSupply).toStrictEqual(
    createAmountFromString(collateralToken0, "0"),
  );
});
