# Panoptic SDK

Typescript SDK for Panoptic.

## Overview

This SDK aims to provide a developer friendly, performant, and robust way to access the Panoptic protocol. An extension is used to provide a seamless extension to Viem. The main entities of the SDK are:

- **get functions**: Gather data by reading from the blockchain
- **utility functions**: Perform off-chain calculations
- **simulate functions**: Estimate gas and return a formatted transaction for a specific action

## Example

```ts
import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'
import {
  publicActionsPanoptic,
  sepoliaPanoptic,
  createPanopticPosition
} from '@panoptic-xyz/sdk'

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
}).extend(publicActionsReverseMirage)

// Pass in or read a uniswap pool
const uniswapPool = ...

// Read the data from the corresponding panoptic pool
const panopticPool = await publicClient.getPanopticPool({
  uniswapPool,
  factory: sepoliaPanoptic.factory,
})

// Create a new position, specifying legs
const newPosition = createPanopticPosition(panopticPool, [
  {
    asset: "token0",
    optionRatio: 1,
    position: "long",
    tokenType: "token0",
    riskPartnerIndex: 0,
    tickLower: 0,
    tickUpper: 300
  },
  undefined,
  undefined,
  undefined,
])

// Mint the new position from the panoptic pool
const { result } = await publicClient.simulatePanopticMintOptions({
  position: newPosition,
  amount: 10n ** 18n
});

```

## API

- Entities

  - [x] `PanopticFactory`: The factory contract in the Panoptic protocol
  - [x] `PanopticSemiFungiblePositionManager`: The semi-fungible position manager in the Panoptic protocol
  - [x] `PanopticPool`: A pool created by `PanopticFactory`
  - [x] `PanopticPoolData`: The state of a `PanopticPool`
  - [x] `PanopticCollateral`: A collateral tracker in a `PanopticPool`
  - [x] `PanopticCollateralData`: The state of a `PanopticCollateral`
  - [x] `PanopticPosition`: A user position in a `PanopticPool`
  - [x] `PanopticPositionData`: The state of a `PanopticPosition`
  - [x] `PanopticCollateralPosition`: A user position in a `PanopticCollateral`
  - [x] `PanopticCollateralPositionData`: The state of a `PanopticCollateralPosition`

- Utilities

  - [x] `createPanopticPool`
  - [x] `createPanopticCollateral`
  - [x] `createPanopticPosition`
  - [x] `createPanopticSemiFungiblePosition`
  - [x] `calculatePanopticTokenID`
  - [x] `calculatePanopticPositionKey`

- Public Actions

  - [x] `getPanopticPool`
  - [x] `getPanopticPoolData`
  - [x] `getPanopticCollateralData`
  - [x] `getPanopticCollateralPositionData`
  - [x] `getPanoptionLegData`
  - [x] `getPanopticPositionData`
  - [x] `getPanopticSemiFungiblePositionData`
  - [x] `simulatePanopticDeployNewPool`
  - [x] `simulatePanopticMintOptions`
  - [x] `simulatePanopticBurnOptions`
  - [x] `simulatePanopticRollOptions`
  - [x] `simulatePanopticForceExercise`
  - [x] `simulatePanopticLiquidateAccount`
  - [x] `simulatePanopticCollateralMint`
  - [x] `simulatePanopticCollateralDeposit`
  - [x] `simulatePanopticCollateralRedeem`
  - [x] `simulatePanopticCollateralWithdraw`
  - [x] `simulatePanopticSFPMInitializeAMMPool`
  - [x] `simulatePanopticSFPMMintTokenizedPosition`
  - [x] `simulatePanopticSFPMBurnTokenizedPosition`
  - [x] `simulatePanopticSFPMRollTokenizedPositions`

- Chains

  - [x] `sepoliaPanoptic`

- ABIs

  - [x] `panopticFactoryABI`
  - [x] `panopticCollateralTrackerABI`
  - [x] `panopticPoolABI`
  - [x] `panopticSemiFuniblePositionManagerABI`
