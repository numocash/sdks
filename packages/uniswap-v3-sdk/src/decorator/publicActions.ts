import type { Chain, Client, Transport } from "viem";
import {
  type GetUniswapV3PoolDataParameters,
  getUniswapV3PoolData,
} from "../publicActions/getUniswapV3PoolData.js";
import {
  type GetUniswapV3PositionDataParameters,
  getUniswapV3PositionData,
} from "../publicActions/getUniswapV3PositionData.js";
import {
  type GetUniswapV3TickDataParameters,
  getUniswapV3TickData,
} from "../publicActions/getUniswapV3TickData.js";

export const publicActionUniswapV3 = <
  TChain extends Chain | undefined = Chain | undefined,
>(
  client: Client<Transport, TChain>,
) => ({
  getUniswapV3PoolData: (args: GetUniswapV3PoolDataParameters) =>
    getUniswapV3PoolData(client, args),

  getUniswapV3PositionData: (args: GetUniswapV3PositionDataParameters) =>
    getUniswapV3PositionData(client, args),

  getUniswapV3TickData: (args: GetUniswapV3TickDataParameters) =>
    getUniswapV3TickData(client, args),
});
