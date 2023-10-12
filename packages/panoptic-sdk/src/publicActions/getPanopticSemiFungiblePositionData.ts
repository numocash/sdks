import type { UniswapV3Tick } from "@panoptic-xyz/uniswap-v3-sdk";
import type { Chain, Client, ReadContractParameters, Transport } from "viem";
import { readContract } from "viem/actions";
import {
  panopticPoolABI,
  semiFungiblePositionManagerABI,
} from "../generated.js";
import type {
  PanopticSemiFungiblePosition,
  PanopticSemiFungiblePositionData,
} from "../types/PanopticSemiFungiblePositionManager.js";
import { getPanoptionLegData } from "./getPanoptionLegData.js";

export type GetPanopticSemiFungiblePositionDataParameters = Omit<
  ReadContractParameters<typeof panopticPoolABI, "totalSupply">,
  "address" | "abi" | "functionName" | "args"
> & {
  position: PanopticSemiFungiblePosition;
  tick: UniswapV3Tick;
};

export type GetPanopticSemiFungiblePositionDataReturnType =
  PanopticSemiFungiblePositionData;

export const getPanopticSemiFungiblePositionData = <
  TChain extends Chain | undefined,
>(
  client: Client<Transport, TChain>,
  { position, tick, ...request }: GetPanopticSemiFungiblePositionDataParameters,
): Promise<GetPanopticSemiFungiblePositionDataReturnType> =>
  Promise.all([
    readContract(client, {
      abi: semiFungiblePositionManagerABI,
      functionName: "balanceOf",
      address: position.address,
      args: [position.owner, position.id],
      ...request,
    }),
    position.legs[0]
      ? getPanoptionLegData(client, {
          leg: position.legs[0],
          address: position.address,
          owner: position.owner,
          uniswapPool: position.uniswapPool,
          tick,
          ...request,
        })
      : undefined,
    position.legs[1]
      ? getPanoptionLegData(client, {
          leg: position.legs[1],
          address: position.address,
          owner: position.owner,
          uniswapPool: position.uniswapPool,
          tick,
          ...request,
        })
      : undefined,
    position.legs[2]
      ? getPanoptionLegData(client, {
          leg: position.legs[2],
          address: position.address,
          owner: position.owner,
          uniswapPool: position.uniswapPool,
          tick,
          ...request,
        })
      : undefined,
    position.legs[3]
      ? getPanoptionLegData(client, {
          leg: position.legs[3],
          address: position.address,
          owner: position.owner,
          uniswapPool: position.uniswapPool,
          tick,
          ...request,
        })
      : undefined,
  ] as const).then(([balance, leg0, leg1, leg2, leg3]) => ({
    type: "panopticSemiFungiblePositionData",
    token: position,
    amount: balance,
    legData: [leg0, leg1, leg2, leg3],
  }));
