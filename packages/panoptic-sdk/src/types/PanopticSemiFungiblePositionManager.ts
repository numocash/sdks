import type { UniswapV3Pool } from "@panoptic-xyz/uniswap-v3-sdk";
import type { BaseERC1155, ERC1155Data, Tuple } from "reverse-mirage";
import type { Address } from "viem/accounts";
import type { PanoptionLeg, PanoptionLegData } from "./PanopticPosition.js";

export type PanopticSemiFungiblePositionManager = {
  type: "panopticSemiFungiblePositionManager";
  address: Address;
  blockCreated: bigint;
};

export type PanopticSemiFungiblePosition =
  BaseERC1155<"panopticSemiFungiblePosition"> & {
    owner: Address;
    uniswapPool: UniswapV3Pool;
    legs: Tuple<PanoptionLeg | undefined, 4>;
  };

export type PanopticSemiFungiblePositionData =
  ERC1155Data<PanopticSemiFungiblePosition> & {
    legData: Tuple<
      Omit<PanoptionLegData, "liquidityAdded" | "liquidityRemoved"> | undefined,
      4
    >;
  };
