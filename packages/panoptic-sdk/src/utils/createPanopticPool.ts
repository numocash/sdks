import type { UniswapV3Pool } from "@panoptic-xyz/uniswap-v3-sdk";
import type { Address } from "viem/accounts";
import type { PanopticCollateral } from "../types/PanopticCollateral.js";
import type { PanopticFactory } from "../types/PanopticFactory.js";
import type { PanopticPool } from "../types/PanopticPool.js";

export const createPanopticPool = (
  address: Address,
  factory: PanopticFactory,
  collateralTracker0: PanopticCollateral,
  collateralTracker1: PanopticCollateral,
  uniswapPool: UniswapV3Pool,
  blockCreated = 0n,
): PanopticPool => ({
  type: "panopticPool",
  address,
  factory,
  collateralTracker0,
  collateralTracker1,
  uniswapPool,
  blockCreated,
});
