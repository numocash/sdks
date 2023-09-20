import type { UniswapV3Pool, UniswapV3PoolData } from "uniswap-v3-sdk";
import type { Address } from "viem/accounts";
import type {
  PanopticCollateral,
  PanopticCollateralData,
} from "./PanopticCollateral.js";
import type { PanopticFactory } from "./PanopticFactory.js";

export type PanopticPool = {
  type: "panopticPool";
  uniswapPool: UniswapV3Pool;
  factory: PanopticFactory;
  collateralTracker0: PanopticCollateral;
  collateralTracker1: PanopticCollateral;
  address: Address;
  blockCreated: bigint;
};

export type PanopticPoolData = {
  type: "panopticPoolData";
  panopticPool: PanopticPool;
  uniswapPoolData: UniswapV3PoolData;
  collateralTracker0Data: PanopticCollateralData;
};
