import { createERC20 } from "reverse-mirage";
import { expect, test } from "vitest";
import { mainnetUniswapV3 } from "./constants.js";
import { createUniswapV3Pool } from "./utils.js";

test("create uniswap v3 pool", () => {
  const tokenA = createERC20(
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    "Wrapped Ether",
    "WETH",
    18,
    1,
  );

  const tokenB = createERC20(
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "USD Coin",
    "USDC",
    6,
    1,
  );

  const pool = createUniswapV3Pool(
    tokenA,
    tokenB,
    500,
    mainnetUniswapV3.factory.address,
  );

  expect(pool.address).toBe("0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640");
});
