import { type UniswapV3Tick } from "@panoptic-xyz/uniswap-v3-sdk";
import {
  type BaseERC20,
  type ERC20Amount,
  createAmountFromRaw,
} from "reverse-mirage";
import type { Chain, Client, ReadContractParameters, Transport } from "viem";
import { readContract } from "viem/actions";
import { panopticFactoryABI, panopticHelperABI } from "../generated.js";
import type { PanopticHelper } from "../types/PanopticHelper.js";
import type { PanopticPosition } from "../types/PanopticPosition.js";

export type GetPanopticCheckCollateralParameters<
  TPanopticPosition extends PanopticPosition,
> = Omit<
  ReadContractParameters<typeof panopticFactoryABI, "getPanopticPool">,
  "address" | "abi" | "functionName" | "args"
> & {
  helper: PanopticHelper;
  positions: TPanopticPosition[];
  tick: UniswapV3Tick;
  tokenType:
    | TPanopticPosition["pool"]["collateralTracker0"]["underlyingToken"]
    | TPanopticPosition["pool"]["collateralTracker1"]["underlyingToken"];
};

export type GetPanopticCheckCollateralReturnType<TERC20 extends BaseERC20> = {
  collateralBalance: ERC20Amount<TERC20>;
  requiredCollateral: ERC20Amount<TERC20>;
};

export const getPanopticCheckCollateral = <
  TChain extends Chain | undefined,
  TPanopticPosition extends PanopticPosition,
>(
  client: Client<Transport, TChain>,
  {
    positions,
    tick,
    tokenType,
    helper,
    ...request
  }: GetPanopticCheckCollateralParameters<TPanopticPosition>,
): Promise<
  GetPanopticCheckCollateralReturnType<
    | TPanopticPosition["pool"]["collateralTracker0"]["underlyingToken"]
    | TPanopticPosition["pool"]["collateralTracker1"]["underlyingToken"]
  >
> =>
  readContract(client, {
    address: helper.address,
    abi: panopticHelperABI,
    functionName: "checkCollateral",
    args: [
      positions[0]!.pool.address,
      positions[0]!.owner,
      tick.tick,
      positions[0]!.pool.collateralTracker0.underlyingToken === tokenType
        ? 0n
        : 1n,
      positions.map((p) => p.id),
    ],
    ...request,
  }).then(([collateralBalance, requiredBalance]) => ({
    collateralBalance: createAmountFromRaw(tokenType, collateralBalance),
    requiredCollateral: createAmountFromRaw(tokenType, requiredBalance),
  }));
