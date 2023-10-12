import type {
  UniswapV3Pool,
  UniswapV3Tick,
} from "@panoptic-xyz/uniswap-v3-sdk";
import type {
  Address,
  Chain,
  Client,
  ReadContractParameters,
  Transport,
} from "viem";
import { readContract } from "viem/actions";
import { panopticPoolABI } from "../generated.js";
import { semiFungiblePositionManagerABI } from "../generated.js";
import type {
  PanoptionLeg,
  PanoptionLegData,
} from "../types/PanopticPosition.js";
import type {} from "./getPanopticPositionData.js";

export type GetPanoptionLegDataParameters = Omit<
  ReadContractParameters<typeof panopticPoolABI, "totalSupply">,
  "address" | "abi" | "functionName" | "args"
> & {
  address: Address;
  owner: Address;
  leg: PanoptionLeg;
  uniswapPool: UniswapV3Pool;
  tick: UniswapV3Tick;
};

export type GetPanoptionLegDataReturnType = PanoptionLegData;

export const getPanoptionLegData = <TChain extends Chain | undefined>(
  client: Client<Transport, TChain>,
  {
    address,
    owner,
    leg,
    uniswapPool,
    tick,
    ...request
  }: GetPanoptionLegDataParameters,
): Promise<GetPanoptionLegDataReturnType> =>
  Promise.all([
    readContract(client, {
      abi: semiFungiblePositionManagerABI,
      functionName: "getAccountLiquidity",
      address,
      args: [
        uniswapPool.address,
        owner,
        leg.tokenType === "token0" ? 0n : 1n,
        leg.tickLower.tick,
        leg.tickUpper.tick,
      ],
      ...request,
    }),
    readContract(client, {
      abi: semiFungiblePositionManagerABI,
      functionName: "getAccountPremium",
      address,
      args: [
        uniswapPool.address,
        owner,
        leg.tokenType === "token0" ? 0n : 1n,
        leg.tickLower.tick,
        leg.tickUpper.tick,
        tick.tick,
        leg.position === "short" ? 0n : 1n,
      ],
      ...request,
    }),
    readContract(client, {
      abi: semiFungiblePositionManagerABI,
      functionName: "getAccountFeesBase",
      address,
      args: [
        uniswapPool.address,
        owner,
        leg.tokenType === "token0" ? 0n : 1n,
        leg.tickLower.tick,
        leg.tickUpper.tick,
      ],
      ...request,
    }),
  ] as const).then(([legLiquidity, legPremium, legFeesBase]) => ({
    liquidityAdded: legLiquidity && 2n ** 128n - 1n,
    liquidityRemoved: legLiquidity >> 128n,
    accountPremium0: legPremium[0],
    accountPremium1: legPremium[1],
    baseFee0: legFeesBase[0],
    baseFee1: legFeesBase[1],
  }));
