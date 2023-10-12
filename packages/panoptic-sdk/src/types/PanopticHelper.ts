import type { Address } from "viem/accounts";
import type { PanopticSemiFungiblePositionManager } from "./PanopticSemiFungiblePositionManager.js";

export type PanopticHelper = {
  type: "panopticHelper";
  address: Address;
  semiFungiblePositionManager: PanopticSemiFungiblePositionManager;
  blockCreated: bigint;
};
