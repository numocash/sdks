import {
  type UniswapV3Tick,
  createUniswapV3Tick,
} from "@panoptic-xyz/uniswap-v3-sdk";
import type { Chain, Client, ReadContractParameters, Transport } from "viem";
import { readContract } from "viem/actions";
import { panopticHelperABI } from "../generated.js";
import type { PanopticHelper } from "../types/PanopticHelper.js";
import type { PanopticPosition } from "../types/PanopticPosition.js";

export type GetPanopticFindLiquidationPriceDownParameters<
  TPanopticPosition extends PanopticPosition,
> = Omit<
  ReadContractParameters<typeof panopticHelperABI, "findLiquidationPriceDown">,
  "address" | "abi" | "functionName" | "args"
> & {
  helper: PanopticHelper;
  positions: TPanopticPosition[];
};

export type GetPanopticFindLiquidationPriceDownReturnType = UniswapV3Tick;

export const getPanopticFindLiquidationPriceDown = <
  TChain extends Chain | undefined,
  TPanopticPosition extends PanopticPosition,
>(
  client: Client<Transport, TChain>,
  {
    positions,
    helper,
    ...request
  }: GetPanopticFindLiquidationPriceDownParameters<TPanopticPosition>,
): Promise<GetPanopticFindLiquidationPriceDownReturnType> =>
  readContract(client, {
    address: helper.address,
    abi: panopticHelperABI,
    functionName: "findLiquidationPriceDown",
    args: [
      positions[0]!.pool.address,
      positions[0]!.owner,
      positions.map((p) => p.id),
    ],
    ...request,
  }).then((data) => createUniswapV3Tick(data));
