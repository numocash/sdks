import {
    type Fraction,
    createFraction,
    fractionGreaterThan,
    fractionSubtract,
  } from "reverse-mirage";
  import invariant from "tiny-invariant";
  import { Q96, Q128 } from "./constants.js";
  import type {
    PanopticPoolData,
    Tick,
    PanopticTickData,
  } from "./types.js";
  import { fractionToQ96, q96ToFraction } from "./utils.js";
  

  // TODO: add panoptic math here

  export const getGrossPremia = (
    tickLower: PanopticTickData,
    tickUpper: PanopticTickData,
    poolData: Pick<PanopticPoolData, "feeGrowth0" | "feeGrowth1" | "tick">,
  ) => {
//     const [feeGrowthBelow0, feeGrowthBelow1] =
//       poolData.tick.tick >= tickUpper.tick.tick
//         ? [tickLower.feeGrowthOutside0, tickLower.feeGrowthOutside1]
//         : [
//             fractionSubtract(poolData.feeGrowth0, tickLower.feeGrowthOutside0),
//             fractionSubtract(poolData.feeGrowth1, tickLower.feeGrowthOutside1),
//           ];
  
//     const [feeGrowthAbove0, feeGrowthAbove1] =
//       poolData.tick.tick < tickUpper.tick.tick
//         ? [tickUpper.feeGrowthOutside0, tickUpper.feeGrowthOutside1]
//         : [
//             fractionSubtract(poolData.feeGrowth0, tickUpper.feeGrowthOutside0),
//             fractionSubtract(poolData.feeGrowth1, tickUpper.feeGrowthOutside1),
//           ];
  
//     return {
//       feeGrowthInside0: fractionSubtract(
//         fractionSubtract(poolData.feeGrowth0, feeGrowthBelow0),
//         feeGrowthAbove0,
//       ),
//       feeGrowthAbove1: fractionSubtract(
//         fractionSubtract(poolData.feeGrowth1, feeGrowthBelow1),
//         feeGrowthAbove1,
//       ),
//     };
  };
