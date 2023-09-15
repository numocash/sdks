import { createFraction } from "reverse-mirage";
import type { FeeTier, TickSpacing } from "./types.js";

export const Q128 = 2n ** 128n;

export const MIN_TICK = -887272;
export const MAX_TICK = -MIN_TICK;

export const MIN_SQRT_PRICE = createFraction(4295128739n, Q128);
export const MAX_SQRT_PRICE = createFraction(
  1461446703485210103287273052203988822378723970342n,
  Q128,
);

export const feeAmountTickSpacing = {
  100: 1,
  500: 10,
  3_000: 60,
  10_000: 200,
} as const satisfies { [feeTier in FeeTier]: TickSpacing };

export const mainnetUniswapV3 = {
  factory: {
    address: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    blockCreated: 12369621n,
  },
} as const;
