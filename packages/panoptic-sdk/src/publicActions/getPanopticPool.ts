import { type UniswapV3Pool } from "uniswap-v3-sdk";
import type {
  Address,
  Chain,
  Client,
  ReadContractParameters,
  Transport,
} from "viem";
import { readContract } from "viem/actions";
import { panopticFactoryABI } from "../generated.js";
import type { PanopticFactory } from "../types/PanopticFactory.js";

export type GetPanopticPoolParameters = Omit<
  ReadContractParameters<typeof panopticFactoryABI, "getPanopticPool">,
  "address" | "abi" | "functionName" | "args"
> & {
  uniswapPool: Pick<UniswapV3Pool, "address">;
  factory: Pick<PanopticFactory, "address">;
};

export type GetPanopticPoolReturnType = Address;

export const getPanopticPool = <TChain extends Chain | undefined,>(
  client: Client<Transport, TChain>,
  { uniswapPool, factory, ...request }: GetPanopticPoolParameters,
): Promise<GetPanopticPoolReturnType> =>
  readContract(client, {
    address: factory.address,
    abi: panopticFactoryABI,
    functionName: "getPanopticPool",
    args: [uniswapPool.address],
    ...request,
  });
