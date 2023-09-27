import type { Hex } from "viem";
import type { Address } from "viem/accounts";

export type UniswapV3Factory = {
  address: Address;
  owner: Address;
  blockCreated: bigint;
  poolInitCodeHash: Hex;
};
