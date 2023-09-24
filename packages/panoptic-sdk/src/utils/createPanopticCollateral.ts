import type { BaseERC20 } from "reverse-mirage";
import type { Address } from "viem/accounts";
import type {
  PanopticCollateral,
  PanopticCollateralParamters,
} from "../types/PanopticCollateral.js";

export const createPanopticCollateral = (
  address: Address,
  name: string,
  symbol: string,
  decimals: number,
  chainID: number,
  underlyingToken: BaseERC20,
  parameters: PanopticCollateralParamters,
  blockCreated = 0n,
): PanopticCollateral => ({
  type: "poERC20",
  address,
  name,
  symbol,
  decimals,
  underlyingToken,
  parameters,
  chainID,
  blockCreated,
});
