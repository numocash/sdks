import type { WETH } from "reverse-mirage";
import type { UniswapV3Factory } from "uniswap-v3-sdk";
import type { Address } from "viem/accounts";
import type { PanopticSemiFungiblePositionManager } from "./PanopticSemiFungiblePositionManager.js";

export type PanopticFactory = {
  type: "panopticFactory";
  address: Address;
  owner: Address;
  uniswapFactory: UniswapV3Factory;
  semiFungiblePositionManager: PanopticSemiFungiblePositionManager;
  weth: WETH;
  blockCreated: bigint;
};
