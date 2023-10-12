import type { UniswapV3Pool } from "@panoptic-xyz/uniswap-v3-sdk";
import type { Tuple } from "reverse-mirage";
import type { Address } from "viem/accounts";
import type { PanoptionLeg } from "../types/PanopticPosition.js";
import type {
  PanopticSemiFungiblePosition,
  PanopticSemiFungiblePositionManager,
} from "../types/PanopticSemiFungiblePositionManager.js";
import { calculatePanopticTokenID } from "./calculatePanopticTokenID.js";

export const createPanopticSemiFungiblePosition = (
  owner: Address,
  semiFungiblePositionManager: PanopticSemiFungiblePositionManager,
  legs: Tuple<PanoptionLeg | undefined, 4>,
  uniswapPool: UniswapV3Pool,
  chainID: number,
  blockCreated = 0n,
): PanopticSemiFungiblePosition => {
  return {
    type: "panopticSemiFungiblePosition",
    address: semiFungiblePositionManager.address,
    owner,
    uniswapPool,
    legs,
    id: calculatePanopticTokenID(uniswapPool, legs),
    uri: "",
    chainID,
    blockCreated,
  };
};
