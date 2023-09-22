import type { Address } from "viem/accounts";
import type { UniswapV3Pool } from "../types/uniswapV3Pool.js";
import type { UniswapV3Position } from "../types/uniswapV3Position.js";
import type { UniswapV3Tick } from "../types/uniswapV3Tick.js";

export const createUniswapV3Position = (
  pool: UniswapV3Pool,
  owner: Address,
  tickLower: UniswapV3Tick,
  tickUpper: UniswapV3Tick,
): UniswapV3Position => ({
  type: "uniswapV3Position",
  pool,
  owner,
  tickLower,
  tickUpper,
});
