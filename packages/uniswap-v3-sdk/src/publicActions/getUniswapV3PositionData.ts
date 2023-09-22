import { type ReverseMirage, createAmountFromRaw } from "reverse-mirage";
import type { Chain, Client, ReadContractParameters, Transport } from "viem";
import { readContract } from "viem/actions";
import { uniswapV3PoolABI } from "../abi/uniswapV3PoolABI.js";
import type {
  UniswapV3Position,
  UniswapV3PositionData,
} from "../types/uniswapV3Position.js";
import { calculateUniswapV3PositionID } from "../utils/calculateUniswapV3PositionID.js";
import { q128ToFraction } from "../utils/q128ToFraction.js";

export type GetUniswapV3PositionDataParameters = Omit<
  ReadContractParameters<typeof uniswapV3PoolABI, "positions">,
  "address" | "abi" | "functionName" | "args"
> & { position: UniswapV3Position };

export type GetUniswapV3PositionReturnType = UniswapV3PositionData;

export const getUniswapV3PositionData = <
  TChain extends Chain | undefined,
  T extends "select" | undefined,
>(
  client: Client<Transport, TChain>,
  { position, ...request }: GetUniswapV3PositionDataParameters,
  type?: T,
): ReverseMirage<
  [bigint, bigint, bigint, bigint, bigint],
  GetUniswapV3PositionReturnType,
  T
> =>
  (type === undefined
    ? readContract(client, {
        abi: uniswapV3PoolABI,
        functionName: "positions",
        address: position.pool.address,
        args: [calculateUniswapV3PositionID(position)],
        ...request,
      }).then((data) => ({
        type: "uniswapV3PositionData",
        position: position,
        liquidity: data[0],
        feeGrowthInside0: q128ToFraction(data[1]),
        feeGrowthInside1: q128ToFraction(data[2]),
        tokensOwed0: createAmountFromRaw(position.pool.token0, data[3]),
        tokensOwed1: createAmountFromRaw(position.pool.token1, data[4]),
      }))
    : {
        read: () =>
          readContract(client, {
            abi: uniswapV3PoolABI,
            functionName: "positions",
            address: position.pool.address,
            args: [calculateUniswapV3PositionID(position)],
            ...request,
          }),
        parse: (data) => ({
          type: "uniswapV3PositionData",
          position: position,
          liquidity: data[0],
          feeGrowthInside0: q128ToFraction(data[1]),
          feeGrowthInside1: q128ToFraction(data[2]),
          tokensOwed0: createAmountFromRaw(position.pool.token0, data[3]),
          tokensOwed1: createAmountFromRaw(position.pool.token1, data[4]),
        }),
      }) as ReverseMirage<
    [bigint, bigint, bigint, bigint, bigint],
    GetUniswapV3PositionReturnType,
    T
  >;
