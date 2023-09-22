import {
  amountAdd,
  createAmountFromRaw,
  fractionMultiply,
  fractionQuotient,
  fractionSubtract,
} from "reverse-mirage";
import type { Address } from "viem";
import type { UniswapV3PoolData } from "../../types/uniswapV3Pool.js";
import type { UniswapV3Tick } from "../../types/uniswapV3Tick.js";
import { calculateUniswapV3PositionID } from "../calculateUniswapV3PositionID.js";
import { createUniswapV3Position } from "../createUniswapV3Position.js";
import { getFeeGrowthInside } from "./getFeeGrowthInside.js";
import { updateTick } from "./updateTick.js";

export const updatePosition = (
  poolData: UniswapV3PoolData,
  owner: Address,
  tickLower: UniswapV3Tick,
  tickUpper: UniswapV3Tick,
  liquidity: bigint,
) => {
  if (liquidity !== 0n) {
    updateTick(poolData, tickLower, liquidity, false);
    updateTick(poolData, tickUpper, liquidity, true);
  }

  const [feeGrowthInside0, feeGrowthInside1] = getFeeGrowthInside(
    poolData,
    poolData.ticks[tickLower.tick]!,
    poolData.ticks[tickUpper.tick]!,
  );

  const position = createUniswapV3Position(
    poolData.uniswapV3Pool,
    owner,
    tickLower,
    tickUpper,
  );

  if (poolData.positions[calculateUniswapV3PositionID(position)] === undefined)
    poolData.positions[calculateUniswapV3PositionID(position)] = {
      type: "uniswapV3PositionData",
      position,
      feeGrowthInside0,
      feeGrowthInside1,
      tokensOwed0: createAmountFromRaw(poolData.uniswapV3Pool.token0, 0n),
      tokensOwed1: createAmountFromRaw(poolData.uniswapV3Pool.token1, 0n),
      liquidity: 0n,
    };

  const liquidityNext =
    poolData.positions[calculateUniswapV3PositionID(position)]!.liquidity +
    liquidity;

  const tokensOwed0 = fractionQuotient(
    fractionMultiply(
      fractionSubtract(
        feeGrowthInside0,
        poolData.positions[calculateUniswapV3PositionID(position)]!
          .feeGrowthInside0,
      ),
      poolData.positions[calculateUniswapV3PositionID(position)]!.liquidity,
    ),
  );

  const tokensOwed1 = fractionQuotient(
    fractionMultiply(
      fractionSubtract(
        feeGrowthInside1,
        poolData.positions[calculateUniswapV3PositionID(position)]!
          .feeGrowthInside1,
      ),
      poolData.positions[calculateUniswapV3PositionID(position)]!.liquidity,
    ),
  );

  poolData.positions[calculateUniswapV3PositionID(position)]!.liquidity =
    liquidityNext;
  poolData.positions[calculateUniswapV3PositionID(position)]!.feeGrowthInside0 =
    feeGrowthInside0;
  poolData.positions[calculateUniswapV3PositionID(position)]!.feeGrowthInside1 =
    feeGrowthInside1;
  poolData.positions[calculateUniswapV3PositionID(position)]!.tokensOwed0 =
    amountAdd(
      poolData.positions[calculateUniswapV3PositionID(position)]!.tokensOwed0,
      tokensOwed0,
    );
  poolData.positions[calculateUniswapV3PositionID(position)]!.tokensOwed1 =
    amountAdd(
      poolData.positions[calculateUniswapV3PositionID(position)]!.tokensOwed1,
      tokensOwed1,
    );
};
