import type { UniswapV3Factory } from "uniswap-v3-sdk";
import type { Address } from "viem/accounts";

export type PanopticSemiFungiblePositionManager = {
  type: "panopticSemiFungiblePositionManager";
  address: Address;
  uniswapFactory: UniswapV3Factory;
  blockCreated: bigint;
};
