import {
  type ReverseMirage,
  createAmountFromRaw,
  createFraction,
  createPrice,
} from "reverse-mirage";
import type { Chain, Client, ReadContractParameters, Transport } from "viem";
import { readContract } from "viem/actions";
import { uniswapV3PoolABI } from "../abi/uniswapV3PoolABI.js";
import type {
  UniswapV3Pool,
  UniswapV3PoolData,
} from "../types/uniswapV3Pool.js";
import { Q96 } from "../utils/constants.js";
import { createUniswapV3Tick } from "../utils/createUniswapV3Tick.js";
import { q128ToFraction } from "../utils/q128ToFraction.js";
import { getUniswapV3TickData } from "./getUniswapV3TickData.js";

export type GetUniswapV3PoolDataParameters = Omit<
  ReadContractParameters<typeof uniswapV3PoolABI, "Pools">,
  "address" | "abi" | "functionName" | "args"
> & { pool: UniswapV3Pool };

export type GetUniswapV3PoolReturnType = UniswapV3PoolData;

export const getUniswapV3PoolData = <
  TChain extends Chain | undefined,
  T extends "select" | undefined,
>(
  client: Client<Transport, TChain>,
  { pool, ...request }: GetUniswapV3PoolDataParameters,
  type?: T,
) =>
  (type === undefined
    ? Promise.all([
        readContract(client, {
          abi: uniswapV3PoolABI,
          functionName: "slot0",
          address: pool.address,
          ...request,
        }).then(async (data) => ({
          poolData: data,
          tickData: await Promise.all([
            getUniswapV3TickData(client, {
              pool,
              tick: createUniswapV3Tick(data[1]),
              ...request,
            }),
            readContract(client, {
              abi: uniswapV3PoolABI,
              functionName: "tickBitmap",
              address: pool.address,
              args: [(data[1] / pool.tickSpacing) >> 8],
              ...request,
            }),
          ]),
        })),
        readContract(client, {
          abi: uniswapV3PoolABI,
          functionName: "feeGrowthGlobal0X128",
          address: pool.address,
          ...request,
        }),
        readContract(client, {
          abi: uniswapV3PoolABI,
          functionName: "feeGrowthGlobal1X128",
          address: pool.address,
          ...request,
        }),
        readContract(client, {
          abi: uniswapV3PoolABI,
          functionName: "liquidity",
          address: pool.address,
          ...request,
        }),
        readContract(client, {
          abi: uniswapV3PoolABI,
          functionName: "protocolFees",
          address: pool.address,
          ...request,
        }),
      ]).then((data) => ({
        type: "uniswapV3PoolData",
        uniswapV3Pool: pool,
        sqrtPrice: createPrice(
          pool.token1,
          pool.token0,
          data[0].poolData[0],
          Q96,
        ),
        tick: createUniswapV3Tick(data[0].poolData[1]),
        feeProtocol: createFraction(data[0].poolData[5], 10_000),
        feeGrowth0: q128ToFraction(data[1]),
        feeGrowth1: q128ToFraction(data[2]),
        protocolFees0: createAmountFromRaw(pool.token0, data[4][0]),
        protocolFees1: createAmountFromRaw(pool.token1, data[4][1]),
        liquidity: data[3],
        ticks: {
          [data[0].poolData[1]]: data[0].tickData[0],
        },
        positions: {},
        tickBitmap: {
          [(data[0].poolData[1] / pool.tickSpacing) >> 8]: data[0].tickData[1],
        },
      }))
    : {
        read: () =>
          Promise.all([
            readContract(client, {
              abi: uniswapV3PoolABI,
              functionName: "slot0",
              address: pool.address,
              ...request,
            }).then(async (data) => ({
              poolData: data,
              tickData: await Promise.all([
                getUniswapV3TickData(client, {
                  pool,
                  tick: createUniswapV3Tick(data[1]),
                  ...request,
                }),
                readContract(client, {
                  abi: uniswapV3PoolABI,
                  functionName: "tickBitmap",
                  address: pool.address,
                  args: [(data[1] / pool.tickSpacing) >> 8],
                  ...request,
                }),
              ]),
            })),
            readContract(client, {
              abi: uniswapV3PoolABI,
              functionName: "feeGrowthGlobal0X128",
              address: pool.address,
              ...request,
            }),
            readContract(client, {
              abi: uniswapV3PoolABI,
              functionName: "feeGrowthGlobal1X128",
              address: pool.address,
              ...request,
            }),
            readContract(client, {
              abi: uniswapV3PoolABI,
              functionName: "liquidity",
              address: pool.address,
              ...request,
            }),
            readContract(client, {
              abi: uniswapV3PoolABI,
              functionName: "protocolFees",
              address: pool.address,
              ...request,
            }),
          ]),
        parse: (data) => ({
          type: "uniswapV3PoolData",
          uniswapV3Pool: pool,
          sqrtPrice: createPrice(
            pool.token1,
            pool.token0,
            data[0].poolData[0],
            Q96,
          ),
          tick: createUniswapV3Tick(data[0].poolData[1]),
          feeProtocol: createFraction(data[0].poolData[5], 10_000),
          feeGrowth0: q128ToFraction(data[1]),
          feeGrowth1: q128ToFraction(data[2]),
          protocolFees0: createAmountFromRaw(pool.token0, data[4][0]),
          protocolFees1: createAmountFromRaw(pool.token1, data[4][1]),
          liquidity: data[3],
          ticks: {
            [data[0].poolData[1]]: data[0].tickData[0],
          },
          positions: {},
          tickBitmap: {
            [(data[0].poolData[1] / pool.tickSpacing) >> 8]:
              data[0].tickData[1],
          },
        }),
      }) as ReverseMirage<
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
    GetUniswapV3PoolReturnType,
    T
  >;
