import {
  type UniswapV3Tick,
  createUniswapV3Tick,
} from "@panoptic-xyz/uniswap-v3-sdk";
import type { Chain, Client, ReadContractParameters, Transport } from "viem";
import { readContract } from "viem/actions";
import { panopticHelperABI } from "../generated.js";
import type { PanopticHelper } from "../types/PanopticHelper.js";
import type { PanopticPosition } from "../types/PanopticPosition.js";

export type GetPanopticFindLiquidationPriceUpParameters<
  TPanopticPosition extends PanopticPosition,
> = Omit<
  ReadContractParameters<typeof panopticHelperABI, "findLiquidationPriceUp">,
  "address" | "abi" | "functionName" | "args"
> & {
  helper: PanopticHelper;
  positions: TPanopticPosition[];
};

export type GetPanopticFindLiquidationPriceUpReturnType = UniswapV3Tick;

export const getPanopticFindLiquidationPriceUp = <
  TChain extends Chain | undefined,
  TPanopticPosition extends PanopticPosition,
>(
  client: Client<Transport, TChain>,
  {
    positions,
    helper,
    ...request
  }: GetPanopticFindLiquidationPriceUpParameters<TPanopticPosition>,
): Promise<GetPanopticFindLiquidationPriceUpReturnType> =>
  readContract(client, {
    address: helper.address,
    abi: panopticHelperABI,
    functionName: "findLiquidationPriceUp",
    args: [
      positions[0]!.pool.address,
      positions[0]!.owner,
      positions.map((p) => p.id),
    ],
    ...request,
  }).then((data) => createUniswapV3Tick(data));
