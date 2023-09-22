import type { UniswapV3Factory } from "../types/uniswapV3Factory.js";

export const mainnetUniswapV3 = {
  factory: {
    address: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    owner: "0x1a9C8182C09F50C8318d769245beA52c32BE35BC",
    blockCreated: 12369621n,
  },
} as const satisfies { factory: UniswapV3Factory };
