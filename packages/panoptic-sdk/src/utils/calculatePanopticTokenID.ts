import type { Tuple } from "reverse-mirage";
import type { TickSpacing } from "uniswap-v3-sdk";
import type { PanopticPool } from "../types/PanopticPool.js";
import type { PanoptionLeg } from "../types/PanopticPosition.js";

export const calculateLegID = (leg: PanoptionLeg, tickSpacing: TickSpacing) => {
  let id = 0n;
  id |= leg.asset === "token0" ? 0n : 1n;
  id |= BigInt(leg.optionRatio) << 1n;
  id |= (leg.position === "short" ? 0n : 1n) << 8n;
  id |= (leg.tokenType === "token0" ? 0n : 1n) << 9n;
  id |= BigInt(leg.riskPartnerIndex) << 10n;
  id |= BigInt((leg.tickUpper.tick + leg.tickLower.tick) / 2) << 12n;
  id |= BigInt((leg.tickUpper.tick - leg.tickLower.tick) / tickSpacing) << 36n;
  return id;
};

export const calculatePanopticTokenID = (
  pool: PanopticPool,
  legs: Tuple<PanoptionLeg | undefined, 4>,
) => {
  let id = 0n;
  id |= BigInt(pool.address) & 0xffffffffffffffffn;
  id |= legs[0]
    ? calculateLegID(legs[0], pool.uniswapPool.tickSpacing) << 64n
    : 0n;
  id |= legs[1]
    ? calculateLegID(legs[1], pool.uniswapPool.tickSpacing) << (64n + 48n)
    : 0n;
  id |= legs[2]
    ? calculateLegID(legs[2], pool.uniswapPool.tickSpacing) << (64n + 48n + 48n)
    : 0n;
  id |= legs[3]
    ? calculateLegID(legs[3], pool.uniswapPool.tickSpacing) <<
      (64n + 48n + 48n + 48n)
    : 0n;

  return id;
};
