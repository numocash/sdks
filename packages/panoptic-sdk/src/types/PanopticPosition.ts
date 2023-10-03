import type { Fraction, Tuple } from "reverse-mirage";
import type { UniswapV3Tick } from "uniswap-v3-sdk";
import type { Address } from "viem/accounts";
import type { PanopticPool } from "./PanopticPool.js";

export type PanoptionLeg = {
  asset: "token0" | "token1";
  optionRatio: number;
  position: "long" | "short";
  tokenType: "token0" | "token1";
  riskPartnerIndex: 0 | 1 | 2 | 3;
  tickLower: UniswapV3Tick;
  tickUpper: UniswapV3Tick;
};

export type PanopticPosition = {
  type: "panopticPosition";
  owner: Address;
  id: bigint;
  pool: PanopticPool;
  legs: Tuple<PanoptionLeg | undefined, 4>;
};

export type PanoptionLegData = {
  liquidityAdded: bigint;
  liquidityRemoved: bigint;
  accountPremium0: bigint;
  accountPremium1: bigint;
  baseFee0: bigint;
  baseFee1: bigint;
};

export type PanopticPositionData = {
  type: "panopticPositionData";
  position: PanopticPosition;
  amount: bigint;
  token0Utilization: Fraction;
  token1Utilization: Fraction;
  premium0: bigint;
  premium1: bigint;
};
