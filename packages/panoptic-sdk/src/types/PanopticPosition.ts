import type { ERC1155, ERC1155Data, Fraction, Tuple } from "reverse-mirage";
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

export type PanopticPosition = ERC1155 & {
  // type: "panopticPosition";
  owner: Address;
  pool: PanopticPool;
  legs: Tuple<PanoptionLeg | undefined, 4>;
};

export type PanopticPositionData = ERC1155Data<PanopticPosition> & {
  liquidityAdded: bigint;
  liquidityRemoved: bigint;
  accountPremiumOwed0: bigint;
  accountPremiumOwed1: bigint;
  accountPremiumGross0: bigint;
  accountPremiumGross1: bigint;
  baseFee0: bigint;
  baseFee1: bigint;
  token0Utilization: Fraction;
  token1Utilization: Fraction;
};
