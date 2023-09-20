import type { UniswapV3Factory } from "uniswap-v3-sdk";
import type { Address } from "viem/accounts";

export type PanopticFactory = {
  type: "panopticFactory";
  address: Address;
  owner: Address;
  uniswapFactory: UniswapV3Factory;
  blockCreated: bigint;
};
