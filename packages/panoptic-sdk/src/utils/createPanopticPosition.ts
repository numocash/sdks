import type { Tuple } from "reverse-mirage";
import type { Address } from "viem/accounts";
import type { PanopticPool } from "../types/PanopticPool.js";
import type {
  PanopticPosition,
  PanoptionLeg,
} from "../types/PanopticPosition.js";
import { calculatePanopticTokenID } from "./calculatePanopticTokenID.js";

export const createPanopticPosition = (
  owner: Address,
  address: Address,
  pool: PanopticPool,
  legs: Tuple<PanoptionLeg, 4>,
  chainID: number,
  blockCreated = 0n,
): PanopticPosition => {
  return {
    type: "panopticPosition",
    address,
    owner,
    pool,
    legs,
    id: calculatePanopticTokenID(pool, legs),
    uri: "",
    chainID,
    blockCreated,
  };
};
