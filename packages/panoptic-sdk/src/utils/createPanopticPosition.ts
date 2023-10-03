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
  pool: PanopticPool,
  legs: Tuple<PanoptionLeg | undefined, 4>,
): PanopticPosition => {
  return {
    type: "panopticPosition",
    owner,
    pool,
    legs,
    id: calculatePanopticTokenID(pool.uniswapPool, legs),
  };
};
