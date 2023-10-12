import { sepoliaUniswapV3 } from "@panoptic-xyz/uniswap-v3-sdk";
import { sepoliaTokens } from "reverse-mirage";
import type { PanopticFactory } from "../types/PanopticFactory.js";
import type { PanopticHelper } from "../types/PanopticHelper.js";

export const sepoliaPanoptic = {
  factory: {
    type: "panopticFactory",
    address: "0x96A75826485c5B993114F72Eb79C718cF06DF56E",
    owner: "0x5c7a7b47739e8aa5b13fba45d7c43d508d0d2fc3",
    weth: sepoliaTokens.weth,
    collateralTrackerReference: "0x9E34995E520E438c4520Cd55941f0869EDDD6822",
    panopticPoolReference: "0xEEb093D6Cb13db88F342c868Ad97574F077fB62C",
    semiFungiblePositionManager: {
      type: "panopticSemiFungiblePositionManager",
      address: "0x928eCD2e55E7042B5b920B352A84f156AdeDB037",
      blockCreated: 4199935n,
    },
    uniswapFactory: sepoliaUniswapV3.factory,
    blockCreated: 4199935n,
  },
  helper: {
    type: "panopticHelper",
    address: "0x7e26c7b22f116eec0fd0d99e976499b303a92b94",
    blockCreated: 4199989n,
    semiFungiblePositionManager: {
      type: "panopticSemiFungiblePositionManager",
      address: "0x928eCD2e55E7042B5b920B352A84f156AdeDB037",
      blockCreated: 4199935n,
    },
  },
} as const satisfies { factory: PanopticFactory; helper: PanopticHelper };
