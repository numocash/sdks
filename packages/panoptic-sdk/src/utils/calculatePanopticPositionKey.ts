import { encodeAbiParameters, keccak256 } from "viem";
import type { Address } from "viem/accounts";
import type { PanopticPool } from "../types/PanopticPool.js";
import type { PanoptionLeg } from "../types/PanopticPosition.js";

export const calculatePanopticPositionKey = (
  owner: Address,
  pool: PanopticPool,
  leg: PanoptionLeg | undefined,
) =>
  keccak256(
    encodeAbiParameters(
      [
        { type: "address" },
        { type: "address" },
        { type: "uint256" },
        { type: "int24" },
        { type: "int24" },
      ],
      [
        pool.address,
        owner,
        leg?.tokenType ? (leg.tokenType === "token0" ? 0n : 1n) : 0n,
        leg?.tickLower.tick ?? 0,
        leg?.tickUpper.tick ?? 0,
      ],
    ),
  );
