import type { UniswapV3Factory } from "@panoptic-xyz/uniswap-v3-sdk";
import type { WETH } from "reverse-mirage";
import type { Address } from "viem/accounts";
import type { PanopticSemiFungiblePositionManager } from "./PanopticSemiFungiblePositionManager.js";

export type PanopticFactory = {
  type: "panopticFactory";
  address: Address;
  owner: Address;
  uniswapFactory: UniswapV3Factory;
  semiFungiblePositionManager: PanopticSemiFungiblePositionManager;
  collateralTrackerReference: Address;
  panopticPoolReference: Address;
  weth: WETH;
  blockCreated: bigint;
};
