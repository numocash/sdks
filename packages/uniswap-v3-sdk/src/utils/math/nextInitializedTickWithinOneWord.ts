import invariant from "tiny-invariant";
import type {
  TickSpacing,
  UniswapV3PoolData,
} from "../../types/uniswapV3Pool.js";
import type { UniswapV3Tick } from "../../types/uniswapV3Tick.js";
import { createUniswapV3Tick } from "../createUniswapV3Tick.js";
import { leastSignificantBit } from "./leastSignificantBit.js";
import { mostSignificantBit } from "./mostSignificantBit.js";

export const nextInitializedTickWithinOneWord = (
  tickBitmap: UniswapV3PoolData["tickBitmap"],
  tick: UniswapV3Tick,
  tickSpacing: TickSpacing,
  lte: boolean,
) => {
  let compressed = tick.tick / tickSpacing;
  if (tick.tick < 0 && tick.tick % tickSpacing !== 0) compressed--;

  if (lte) {
    const word = compressed >> 8;
    const bit = compressed % 256;

    invariant(tickBitmap[word] !== undefined);
    const mask = (1n << BigInt(bit)) - 1n + (1n << BigInt(bit));
    const masked = tickBitmap[word]! & mask;

    const initialized = masked !== 0n;

    return [
      initialized
        ? createUniswapV3Tick(
            (compressed - (bit - mostSignificantBit(masked))) * tickSpacing,
          )
        : createUniswapV3Tick((compressed - bit) * tickSpacing),
      initialized,
    ] as const;
  } else {
    const word = (compressed + 1) >> 8;
    const bit = (compressed + 1) % 256;

    invariant(tickBitmap[word] !== undefined);
    const mask = ~((1n << BigInt(bit)) - 1n);
    const masked = tickBitmap[word]! & mask;

    const initialized = masked !== 0n;

    return [
      initialized
        ? createUniswapV3Tick(
            (compressed + 1 + leastSignificantBit(masked) - bit) * tickSpacing,
          )
        : createUniswapV3Tick((compressed + 1 + 255 - bit) * tickSpacing),
      initialized,
    ] as const;
  }
};
