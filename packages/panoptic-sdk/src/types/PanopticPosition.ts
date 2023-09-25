import type { BaseERC1155, ERC1155Data, Fraction, Tuple } from "reverse-mirage";
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

export type PanopticPosition = BaseERC1155<"panopticPosition"> & {
  owner: Address;
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

export type PanopticPositionData = ERC1155Data<PanopticPosition> & {
  token0Utilization: Fraction;
  token1Utilization: Fraction;
  legData: Tuple<PanoptionLegData | undefined, 4>;
};
