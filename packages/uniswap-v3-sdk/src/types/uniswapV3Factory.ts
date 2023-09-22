import type { Address } from "viem/accounts";

export type UniswapV3Factory = {
  address: Address;
  owner: Address;
  blockCreated: bigint;
};
