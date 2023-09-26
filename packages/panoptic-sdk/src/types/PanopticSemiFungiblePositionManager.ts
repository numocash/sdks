import type { Address } from "viem/accounts";

export type PanopticSemiFungiblePositionManager = {
  type: "panopticSemiFungiblePositionManager";
  address: Address;
  blockCreated: bigint;
};
