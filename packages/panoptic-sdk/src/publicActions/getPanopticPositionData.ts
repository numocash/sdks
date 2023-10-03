import { createFraction } from "reverse-mirage";
import type { Chain, Client, ReadContractParameters, Transport } from "viem";
import { readContract } from "viem/actions";
import { panopticPoolABI } from "../generated.js";
import type {
  PanopticPosition,
  PanopticPositionData,
} from "../types/PanopticPosition.js";

export type GetPanopticPositionDataParameters = Omit<
  ReadContractParameters<typeof panopticPoolABI, "totalSupply">,
  "address" | "abi" | "functionName" | "args"
> & {
  position: PanopticPosition;
};

export type GetPanopticPositionDataReturnType = PanopticPositionData;

export const getPanopticPositionData = <TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  { position, ...request }: GetPanopticPositionDataParameters,
): Promise<GetPanopticPositionDataReturnType> =>
  Promise.all([
    readContract(client, {
      abi: panopticPoolABI,
      functionName: "optionPositionBalance",
      address: position.pool.address,
      args: [position.owner, position.id],
      ...request,
    }),
    readContract(client, {
      abi: panopticPoolABI,
      functionName: "calculateAccumulatedFeesBatch",
      address: position.pool.address,
      args: [position.owner, [position.id]],
      ...request,
    }),
  ] as const).then(([optionsBalance, accumumlatedFees]) => ({
    type: "panopticPositionData",
    position,
    amount: optionsBalance[0],
    token0Utilization: createFraction(optionsBalance[1], 2n ** 64n),
    token1Utilization: createFraction(optionsBalance[2], 2n ** 64n),
    premium0: accumumlatedFees[0],
    premium1: accumumlatedFees[1],
  }));
