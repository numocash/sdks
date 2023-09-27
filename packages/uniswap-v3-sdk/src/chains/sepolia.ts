import type { UniswapV3Factory } from "../types/uniswapV3Factory.js";

export const sepoliaUniswapV3 = {
  factory: {
    address: "0x0227628f3F023bb0B980b67D528571c95c6DaC1c",
    owner: "0x1a9C8182C09F50C8318d769245beA52c32BE35BC",
    blockCreated: 3518270n,
    poolInitCodeHash:
      "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54",
  },
} as const satisfies { factory: UniswapV3Factory };
