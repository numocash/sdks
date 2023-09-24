import { type ReverseMirage } from "reverse-mirage";
import { getUniswapV3PoolData } from "uniswap-v3-sdk";
import type { Chain, Client, ReadContractParameters, Transport } from "viem";
import { collateralTrackerABI } from "../generated.js";
import type { PanopticPool, PanopticPoolData } from "../types/PanopticPool.js";
import { getPanopticCollateralData } from "./getPanopticCollateralData.js";

export type GetPanopticPoolDataParameters = Omit<
  ReadContractParameters<typeof collateralTrackerABI, "totalSupply">,
  "address" | "abi" | "functionName" | "args"
> & {
  panopticPool: PanopticPool;
};

export type GetPanopticPoolDataReturnType = PanopticPoolData;

export const getPanopticPoolData = <
  TChain extends Chain | undefined,
  T extends "select" | undefined,
>(
  client: Client<Transport, TChain>,
  { panopticPool, ...request }: GetPanopticPoolDataParameters,
  type?: T,
) =>
  (type === undefined
    ? Promise.all([
        getUniswapV3PoolData(client, {
          pool: panopticPool.uniswapPool,
          ...request,
        }),
        getPanopticCollateralData(client, {
          panopticCollateral: panopticPool.collateralTracker0,
          ...request,
        }),
        getPanopticCollateralData(client, {
          panopticCollateral: panopticPool.collateralTracker1,
          ...request,
        }),
      ]).then(([poolData, collateral0Data, collateral1Data]) => ({
        type: "panopticPoolData",
        panopticPool,
        collateralTracker0Data: collateral0Data,
        collateralTracker1Data: collateral1Data,
        uniswapPoolData: poolData,
      }))
    : {
        read: () =>
          Promise.all([
            getUniswapV3PoolData(
              client,
              {
                pool: panopticPool.uniswapPool,
                ...request,
              },
              "select",
            ).read(),
            getPanopticCollateralData(
              client,
              {
                panopticCollateral: panopticPool.collateralTracker0,
                ...request,
              },
              "select",
            ).read(),
            getPanopticCollateralData(
              client,
              {
                panopticCollateral: panopticPool.collateralTracker1,
                ...request,
              },
              "select",
            ).read(),
          ]),
        parse: (data) => ({
          type: "panopticPoolData",
          uniswapPoolData: getUniswapV3PoolData(
            client,
            {
              pool: panopticPool.uniswapPool,
              ...request,
            },
            "select",
          ).parse(data[0]),
          collateralTracker0Data: getPanopticCollateralData(
            client,
            {
              panopticCollateral: panopticPool.collateralTracker0,
              ...request,
            },
            "select",
          ).parse(data[1]),
          collateralTracker1Data: getPanopticCollateralData(
            client,
            {
              panopticCollateral: panopticPool.collateralTracker1,
              ...request,
            },
            "select",
          ).parse(data[1]),
        }),
      }) as ReverseMirage<
    [
      readonly [
        {
          poolData: readonly [
            bigint,
            number,
            number,
            number,
            number,
            number,
            boolean,
          ];
          tickData: readonly [
            readonly [
              bigint,
              bigint,
              bigint,
              bigint,
              bigint,
              bigint,
              number,
              boolean,
            ],
            bigint,
          ];
        },
        bigint,
        bigint,
        bigint,
        readonly [bigint, bigint],
      ],
      [bigint, [bigint, bigint, bigint]],
      [bigint, [bigint, bigint, bigint]],
    ],
    GetPanopticPoolDataReturnType,
    T
  >;
