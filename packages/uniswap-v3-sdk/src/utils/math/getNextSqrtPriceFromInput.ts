import { type Fraction, fractionGreaterThan } from "reverse-mirage";
import invariant from "tiny-invariant";
import { getNextSqrtPriceFromAmount0RoundingUp } from "./getNextSqrtPriceFromAmount0.js";
import { getNextSqrtPriceFromAmount1RoundingDown } from "./getNextSqrtPriceFromAmount1.js";

export const getNextSqrtPriceFromInput = (
  sqrtPrice: Fraction,
  liquidity: bigint,
  amountIn: bigint,
  zeroForOne: boolean,
) => {
  invariant(fractionGreaterThan(sqrtPrice, 0));
  invariant(liquidity > 0n);

  return zeroForOne
    ? getNextSqrtPriceFromAmount0RoundingUp(
        sqrtPrice,
        liquidity,
        amountIn,
        true,
      )
    : getNextSqrtPriceFromAmount1RoundingDown(
        sqrtPrice,
        liquidity,
        amountIn,
        true,
      );
};
