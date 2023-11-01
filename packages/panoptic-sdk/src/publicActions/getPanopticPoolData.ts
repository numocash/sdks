import { getUniswapV3PoolData } from "@panoptic-xyz/uniswap-v3-sdk";
import type { Chain, Client, ReadContractParameters, Transport } from "viem";
import { collateralTrackerABI } from "../generated.js";
import type { PanopticPool, PanopticPoolData } from "../types/PanopticPool.js";
import { getPanopticCollateralData } from "./getPanopticCollateralData.js";

export type GetPanopticPoolDataParameters = Omit<
  ReadContractParameters<typeof collateralTrackerABI, "totalSupply">,
  "address" | "abi" | "functionName" | "args"
> & {
  pool: PanopticPool;
};

export type GetPanopticPoolDataReturnType = PanopticPoolData;

export const getPanopticPoolData = <TChain extends Chain | undefined,>(
  client: Client<Transport, TChain>,
  { pool, ...request }: GetPanopticPoolDataParameters,
): Promise<GetPanopticPoolDataReturnType> =>
  Promise.all([
    getUniswapV3PoolData(client, {
      pool: pool.uniswapPool,
      ...request,
    }),
    getPanopticCollateralData(client, {
      collateral: pool.collateralTracker0,
      ...request,
    }),
    getPanopticCollateralData(client, {
      collateral: pool.collateralTracker1,
      ...request,
    }),
  ]).then(([poolData, collateral0Data, collateral1Data]) => ({
    type: "panopticPoolData",
    panopticPool: pool,
    collateralTracker0Data: collateral0Data,
    collateralTracker1Data: collateral1Data,
    uniswapPoolData: poolData,
  }));
