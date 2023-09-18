import { Token } from "@uniswap/sdk-core";
import { createERC20 } from "reverse-mirage";
import { foundry } from "viem/chains";

export const token0 = createERC20(
  "0x0000000000000000000000000000000000000001",
  "name",
  "symbol",
  18,
  foundry.id,
);

export const token1 = createERC20(
  "0x0000000000000000000000000000000000000002",
  "name",
  "symbol",
  18,
  foundry.id,
);

export const uniToken0 = new Token(
  foundry.id,
  "0x0000000000000000000000000000000000000001",
  18,
  "symbol",
  "name",
);

export const uniToken1 = new Token(
  foundry.id,
  "0x0000000000000000000000000000000000000002",
  18,
  "symbol",
  "name",
);
