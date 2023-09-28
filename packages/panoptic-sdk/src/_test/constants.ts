import { createERC20 } from "reverse-mirage";
import { sepolia } from "viem/chains";
import { createPanopticCollateral } from "../utils/createPanopticCollateral.js";
import { baseParameters } from "./utils.js";

// Test accounts
export const ACCOUNTS = [
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
] as const;

// Named accounts
export const [ALICE, BOB] = ACCOUNTS;

export const token0 = createERC20(
  "0x0000000000000000000000000000000000000001",
  "name",
  "symbol",
  18,
  sepolia.id,
);

export const token1 = createERC20(
  "0x0000000000000000000000000000000000000002",
  "name",
  "symbol",
  18,
  sepolia.id,
);

export const collateralToken0 = createPanopticCollateral(
  "0x0000000000000000000000000000000000000003",
  token0,
  token1,
  500,
  baseParameters,
);

export const collateralToken1 = createPanopticCollateral(
  "0x0000000000000000000000000000000000000004",
  token1,
  token0,
  500,
  baseParameters,
);
