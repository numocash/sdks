import type { BaseERC20 } from "reverse-mirage";
import type { ByteArray } from "viem";
import {
  concat,
  encodeAbiParameters,
  getAddress,
  keccak256,
  pad,
  slice,
  toBytes,
} from "viem/utils";
import type { UniswapV3Factory } from "../types/index.js";
import type { FeeTier, UniswapV3Pool } from "../types/uniswapV3Pool.js";
import { feeAmountTickSpacing } from "./constants.js";

export const createUniswapV3Pool = (
  tokenA: BaseERC20,
  tokenB: BaseERC20,
  feeTier: FeeTier,
  factory: UniswapV3Factory,
  blockCreated = 0n,
): UniswapV3Pool => {
  const [token0, token1] =
    tokenA.address.toLowerCase() < tokenB.address.toLowerCase()
      ? [tokenA, tokenB]
      : [tokenB, tokenA];

  const from = toBytes(getAddress(factory.address));
  const salt = pad(
    toBytes(
      keccak256(
        encodeAbiParameters(
          [
            { name: "token0", type: "address" },
            { name: "token1", type: "address" },
            { name: "feeTier", type: "uint24" },
          ],
          [token0.address, token1.address, feeTier],
        ),
      ),
    ),
    {
      size: 32,
    },
  ) as ByteArray;
  const bytecodeHash = toBytes(factory.poolInitCodeHash);
  const address = getAddress(
    slice(keccak256(concat([toBytes("0xff"), from, salt, bytecodeHash])), 12),
  );

  return {
    type: "uniswapV3Pool",
    token0,
    token1,
    feeTier,
    tickSpacing: feeAmountTickSpacing[feeTier],
    address,
    blockCreated,
  };
};
