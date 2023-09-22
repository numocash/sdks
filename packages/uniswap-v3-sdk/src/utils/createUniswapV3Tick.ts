import invariant from "tiny-invariant";
import type { UniswapV3Tick } from "../types/index.js";
import { MAX_TICK, MIN_TICK } from "./constants.js";

export const createUniswapV3Tick = (tick: number): UniswapV3Tick => {
  invariant(
    tick >= MIN_TICK && tick <= MAX_TICK,
    "Uniswap V3 SDK: Tick in not within the valid range",
  );

  return { type: "uniswapV3Tick", tick };
};
