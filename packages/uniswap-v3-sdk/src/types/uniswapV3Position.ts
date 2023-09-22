import type { ERC20Amount, Fraction } from "reverse-mirage";
import type { Address } from "viem/accounts";
import type { UniswapV3Pool } from "./uniswapV3Pool.js";
import type { UniswapV3Tick } from "./uniswapV3Tick.js";

export type UniswapV3Position = {
  type: "uniswapV3Position";
  pool: UniswapV3Pool;
  owner: Address;
  tickLower: UniswapV3Tick;
  tickUpper: UniswapV3Tick;
};

export type UniswapV3PositionData = {
  type: "uniswapV3PositionData";
  position: UniswapV3Position;
  liquidity: bigint;
  feeGrowthInside0: Fraction;
  feeGrowthInside1: Fraction;
  tokensOwed0: ERC20Amount<UniswapV3Position["pool"]["token0"]>;
  tokensOwed1: ERC20Amount<UniswapV3Position["pool"]["token1"]>;
};
