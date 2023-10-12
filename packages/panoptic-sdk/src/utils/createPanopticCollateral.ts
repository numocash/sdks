import type { FeeTier } from "@panoptic-xyz/uniswap-v3-sdk";
import type { BaseERC20 } from "reverse-mirage";
import type { Address } from "viem/accounts";
import type {
  PanopticCollateral,
  PanopticCollateralParamters,
} from "../types/PanopticCollateral.js";

export const createPanopticCollateral = (
  address: Address,
  underlyingToken: BaseERC20,
  otherToken: BaseERC20,
  fee: FeeTier,
  parameters: PanopticCollateralParamters,
  blockCreated = 0n,
): PanopticCollateral => ({
  type: "poERC20",
  address,
  name: `POPT-V1 ${underlyingToken.symbol} LP on ${
    underlyingToken.address.toLowerCase() < otherToken.address.toLowerCase()
      ? underlyingToken.symbol
      : otherToken.symbol
  } / ${
    underlyingToken.address.toLowerCase() < otherToken.address.toLowerCase()
      ? otherToken.symbol
      : underlyingToken.symbol
  } ${fee} bps`,
  symbol: `po${underlyingToken.symbol}`,
  decimals: underlyingToken.decimals,
  underlyingToken,
  parameters,
  chainID: underlyingToken.chainID,
  blockCreated,
});
