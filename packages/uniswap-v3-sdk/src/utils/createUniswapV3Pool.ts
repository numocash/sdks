import type { BaseERC20 } from "reverse-mirage";
import type { Address } from "viem/accounts";
import { encodeAbiParameters, getContractAddress, keccak256 } from "viem/utils";
import type { FeeTier, UniswapV3Pool } from "../types/uniswapV3Pool.js";
import { UniswapV3PoolInitcode } from "./bytecode.js";
import { feeAmountTickSpacing } from "./constants.js";

export const createUniswapV3Pool = (
  tokenA: BaseERC20,
  tokenB: BaseERC20,
  feeTier: FeeTier,
  factory: Address,
  blockCreated = 0n,
): UniswapV3Pool => {
  const [token0, token1] =
    tokenA.address.toLowerCase() < tokenB.address.toLowerCase()
      ? [tokenA, tokenB]
      : [tokenB, tokenA];

  const address = getContractAddress({
    from: factory,
    opcode: "CREATE2",
    bytecode: UniswapV3PoolInitcode,
    salt: keccak256(
      encodeAbiParameters(
        [
          { name: "token0", type: "address" },
          { name: "token1", type: "address" },
          { name: "feeTier", type: "uint24" },
        ],
        [token0.address, token1.address, feeTier],
      ),
    ),
  });

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
