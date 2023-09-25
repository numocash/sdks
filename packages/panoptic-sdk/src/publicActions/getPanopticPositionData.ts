import { createFraction } from "reverse-mirage";
import type { UniswapV3Tick } from "uniswap-v3-sdk";
import type { Chain, Client, ReadContractParameters, Transport } from "viem";
import { readContract } from "viem/actions";
import { panopticPoolABI } from "../generated.js";
import type {
  PanopticPosition,
  PanopticPositionData,
} from "../types/PanopticPosition.js";
import { getPanoptionLegData } from "./getPanoptionLegData.js";

export type GetPanopticPositionDataParameters = Omit<
  ReadContractParameters<typeof panopticPoolABI, "totalSupply">,
  "address" | "abi" | "functionName" | "args"
> & {
  panopticPosition: PanopticPosition;
  tick: UniswapV3Tick;
};

export type GetPanopticPositionDataReturnType = PanopticPositionData;

export const getPanopticPositionData = <TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { panopticPosition, tick, ...request }: GetPanopticPositionDataParameters,
): Promise<GetPanopticPositionDataReturnType> =>
  Promise.all([
    readContract(client, {
      abi: panopticPoolABI,
      functionName: "optionPositionBalance",
      address: panopticPosition.pool.address,
      args: [panopticPosition.address, panopticPosition.id],
      ...request,
    }),
    panopticPosition.legs[0]
      ? getPanoptionLegData(client, {
          leg: panopticPosition.legs[0],
          address: panopticPosition.address,
          pool: panopticPosition.pool,
          tick,
          ...request,
        })
      : undefined,
    panopticPosition.legs[1]
      ? getPanoptionLegData(client, {
          leg: panopticPosition.legs[1],
          address: panopticPosition.address,
          pool: panopticPosition.pool,
          tick,
          ...request,
        })
      : undefined,
    panopticPosition.legs[2]
      ? getPanoptionLegData(client, {
          leg: panopticPosition.legs[2],
          address: panopticPosition.address,
          pool: panopticPosition.pool,
          tick,
          ...request,
        })
      : undefined,
    panopticPosition.legs[3]
      ? getPanoptionLegData(client, {
          leg: panopticPosition.legs[3],
          address: panopticPosition.address,
          pool: panopticPosition.pool,
          tick,
          ...request,
        })
      : undefined,
  ] as const).then(([optionsBalance, leg0, leg1, leg2, leg3]) => ({
    type: "panopticPositionData",
    amount: optionsBalance[0],
    token0Utilization: createFraction(optionsBalance[1], 2n ** 64n),
    token1Utilization: createFraction(optionsBalance[2], 2n ** 64n),
    token: panopticPosition,
    legData: [leg0, leg1, leg2, leg3],
  }));
