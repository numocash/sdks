import type { BaseERC20, ERC20Amount } from "reverse-mirage";
import type { Address } from "viem";
import type { UniswapV3PoolData } from "../types/uniswapV3Pool.js";
import type { UniswapV3Tick } from "../types/uniswapV3Tick.js";
import { liquidityAmounts } from "./math/liquidityAmounts.js";
import { updatePosition } from "./math/updatePosition.js";

export const calculateUniswapV3PoolMint = (
  poolData: UniswapV3PoolData,
  to: Address,
  tickLower: UniswapV3Tick,
  tickUpper: UniswapV3Tick,
  liquidity: bigint,
): readonly [ERC20Amount<BaseERC20>, ERC20Amount<BaseERC20>] => {
  updatePosition(poolData, to, tickLower, tickUpper, liquidity);

  return liquidityAmounts(poolData, tickLower, tickUpper, liquidity);
};
