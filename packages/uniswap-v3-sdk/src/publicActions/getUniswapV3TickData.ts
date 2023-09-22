import type { ReverseMirage } from "reverse-mirage";
import type { Chain, Client, ReadContractParameters, Transport } from "viem";
import { readContract } from "viem/actions";
import { uniswapV3PoolABI } from "../abi/uniswapV3PoolABI.js";
import type { UniswapV3Pool } from "../types/uniswapV3Pool.js";
import type {
  UniswapV3Tick,
  UniswapV3TickData,
} from "../types/uniswapV3Tick.js";
import { q128ToFraction } from "../utils/q128ToFraction.js";

export type GetUniswapV3TickDataParameters = Omit<
  ReadContractParameters<typeof uniswapV3PoolABI, "ticks">,
  "address" | "abi" | "functionName" | "args"
> & { pool: Pick<UniswapV3Pool, "address">; tick: UniswapV3Tick };

export type GetUniswapV3TickReturnType = UniswapV3TickData;

export const getUniswapV3TickData = <
  TChain extends Chain | undefined,
  T extends "select" | undefined,
>(
  client: Client<Transport, TChain>,
  { tick, pool, ...request }: GetUniswapV3TickDataParameters,
  type?: T,
): ReverseMirage<
  [bigint, bigint, bigint, bigint, bigint, bigint, number, boolean],
  GetUniswapV3TickReturnType,
  T
> =>
  (type === undefined
    ? readContract(client, {
        abi: uniswapV3PoolABI,
        functionName: "ticks",
        address: pool.address,
        args: [tick.tick],
        ...request,
      }).then((data) => ({
        type: "uniswapV3TickData",
        tick: tick,
        liquidityGross: data[0],
        liquidityNet: data[1],
        feeGrowthOutside0: q128ToFraction(data[2]),
        feeGrowthOutside1: q128ToFraction(data[3]),
      }))
    : {
        read: () =>
          readContract(client, {
            abi: uniswapV3PoolABI,
            functionName: "ticks",
            address: pool.address,
            args: [tick.tick],
            ...request,
          }),
        parse: (data) => ({
          type: "uniswapV3TickData",
          tick: tick,
          liquidityGross: data[0],
          liquidityNet: data[1],
          feeGrowthOutside0: q128ToFraction(data[2]),
          feeGrowthOutside1: q128ToFraction(data[3]),
        }),
      }) as ReverseMirage<
    [bigint, bigint, bigint, bigint, bigint, bigint, number, boolean],
    GetUniswapV3TickReturnType,
    T
  >;
