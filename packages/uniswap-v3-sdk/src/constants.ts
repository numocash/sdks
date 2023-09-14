import { createFraction } from "reverse-mirage";

export const Q128 = 2n ** 128n;

export const MIN_TICK = -887272;
export const MAX_TICK = -MIN_TICK;

export const MIN_SQRT_PRICE = createFraction(4295128739n, Q128);
export const MAX_SQRT_PRICE = createFraction(
	1461446703485210103287273052203988822378723970342n,
	Q128,
);
