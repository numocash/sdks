import type { Hex } from "viem";
import { encodePacked } from "viem/utils";
import type { UniswapV3Position } from "../types/uniswapV3Position.js";

export const calculateUniswapV3PositionID = (
  position: UniswapV3Position,
): Hex =>
  encodePacked(
    ["address", "int24", "int24"],
    [position.owner, position.tickLower.tick, position.tickUpper.tick],
  );
