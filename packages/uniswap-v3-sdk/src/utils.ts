import { type BaseERC20, type Fraction, createFraction } from "reverse-mirage";
import invariant from "tiny-invariant";
import type { Address } from "viem/accounts";
import { encodeAbiParameters, getContractAddress, keccak256 } from "viem/utils";
import { UniswapV3PoolInitcode } from "./bytecode.js";
import { MAX_TICK, MIN_TICK, Q128, feeAmountTickSpacing } from "./constants.js";
import type { FeeTier, Position, Tick, UniswapV3Pool } from "./types.js";

/**
 * Convert fraction type to Q128 integer
 */
export const fractionToQ128 = (fraction: Fraction): bigint =>
  (fraction.numerator * Q128) / fraction.denominator;

/**
 * Convert Q128 integer to fraction type
 */
export const q128ToFraction = (q128: bigint): Fraction =>
  createFraction(q128, Q128);

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

export const createTick = (tick: number): Tick => {
  invariant(
    tick >= MIN_TICK && tick <= MAX_TICK,
    "Uniswap V3 SDK: Tick in not within the valid range",
  );

  return { type: "tick", tick };
};

export const createPosition = (
  pool: UniswapV3Pool,
  owner: Address,
  tickLower: Tick,
  tickUpper: Tick,
): Position => ({
  type: "position",
  pool,
  owner,
  tickLower,
  tickUpper,
});
