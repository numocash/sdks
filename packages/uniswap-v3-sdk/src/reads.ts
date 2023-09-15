import {
  type ReverseMirageRead,
  createAmountFromRaw,
  createFraction,
  createPrice,
} from "reverse-mirage";
import { type PublicClient } from "viem";
import { uniswapV3PoolABI } from "./abi.js";
import { Q96 } from "./constants.js";
import type {
  UniswapV3Pool,
  UniswapV3PoolData,
  UniswapV3Position,
  UniswapV3PositionData,
  UniswapV3Tick,
  UniswapV3TickData,
} from "./types.js";
import { createTick, getPositionID, q128ToFraction } from "./utils.js";

export const uniswapV3PoolData = (args: {
  pool: UniswapV3Pool;
}) =>
  ({
    read: (publicClient: PublicClient) =>
      Promise.all([
        publicClient
          .readContract({
            abi: uniswapV3PoolABI,
            functionName: "slot0",
            address: args.pool.address,
          })
          .then(async (data) => ({
            poolData: data,
            tickData: await Promise.all([
              uniswapV3PoolTickData({
                pool: args.pool,
                tick: createTick(data[1]),
              }).read(publicClient),
              publicClient.readContract({
                abi: uniswapV3PoolABI,
                functionName: "tickBitmap",
                address: args.pool.address,
                args: [(data[1] / args.pool.tickSpacing) >> 8],
              }),
            ]),
          })),
        publicClient.readContract({
          abi: uniswapV3PoolABI,
          functionName: "feeGrowthGlobal0X128",
          address: args.pool.address,
        }),
        publicClient.readContract({
          abi: uniswapV3PoolABI,
          functionName: "feeGrowthGlobal1X128",
          address: args.pool.address,
        }),
        publicClient.readContract({
          abi: uniswapV3PoolABI,
          functionName: "liquidity",
          address: args.pool.address,
        }),
        publicClient.readContract({
          abi: uniswapV3PoolABI,
          functionName: "protocolFees",
          address: args.pool.address,
        }),
      ]),
    parse: (data): UniswapV3PoolData => ({
      type: "uniswapV3PoolData",
      uniswapV3Pool: args.pool,
      sqrtPrice: createPrice(
        args.pool.token1,
        args.pool.token0,
        data[0].poolData[0],
        Q96,
      ),
      tick: createTick(data[0].poolData[1]),
      feeProtocol: createFraction(data[0].poolData[5], 10_000),
      feeGrowth0: q128ToFraction(data[1]),
      feeGrowth1: q128ToFraction(data[2]),
      protocolFees0: createAmountFromRaw(args.pool.token0, data[4][0]),
      protocolFees1: createAmountFromRaw(args.pool.token1, data[4][1]),
      liquidity: data[3],
      ticks: {
        [data[0].poolData[1]]: uniswapV3PoolTickData({
          pool: args.pool,
          tick: createTick(data[0].poolData[1]),
        }).parse(data[0].tickData[0]),
      },
      positions: {},
      tickBitmap: {
        [(data[0].poolData[1] / args.pool.tickSpacing) >> 8]:
          data[0].tickData[1],
      },
    }),
  }) as const satisfies ReverseMirageRead<
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
    ]
  >;

export const uniswapV3PoolTickData = (args: {
  pool: Pick<UniswapV3Pool, "address">;
  tick: UniswapV3Tick;
}) =>
  ({
    read: (publicClient: PublicClient) =>
      publicClient.readContract({
        abi: uniswapV3PoolABI,
        functionName: "ticks",
        address: args.pool.address,
        args: [args.tick.tick],
      }),
    parse: (data): UniswapV3TickData => ({
      type: "uniswapV3TickData",
      tick: args.tick,
      liquidityGross: data[0],
      liquidityNet: data[1],
      feeGrowthOutside0: q128ToFraction(data[2]),
      feeGrowthOutside1: q128ToFraction(data[3]),
    }),
  }) as const satisfies ReverseMirageRead<
    readonly [bigint, bigint, bigint, bigint, bigint, bigint, number, boolean]
  >;

export const uniswapV3PoolPositionData = (args: {
  position: UniswapV3Position;
}) =>
  ({
    read: (publicClient: PublicClient) =>
      publicClient.readContract({
        abi: uniswapV3PoolABI,
        functionName: "positions",
        address: args.position.pool.address,
        args: [getPositionID(args.position)],
      }),
    parse: (data): UniswapV3PositionData => ({
      type: "uniswapV3PositionData",
      position: args.position,
      liquidity: data[0],
      feeGrowthInside0: q128ToFraction(data[1]),
      feeGrowthInside1: q128ToFraction(data[2]),
      tokensOwed0: createAmountFromRaw(args.position.pool.token0, data[3]),
      tokensOwed1: createAmountFromRaw(args.position.pool.token1, data[4]),
    }),
  }) as const satisfies ReverseMirageRead<
    readonly [bigint, bigint, bigint, bigint, bigint]
  >;
