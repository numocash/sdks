# SDK

The Numoen© software development kit (SDK) offers developer tools to interact with various automated market makers and liquidity management protocols on the Ethereum Virtual Machine (EVM).

- [x] Uniswap V3
- [ ] Panoptic V1

## Panoptic SDK

Typescript SDK for Panoptic

### API

- Entities

  - [x] `PanopticFactory`: The factory contract in the Panoptic protocol
  - [x] `PanopticSemiFungiblePositionManager`: The semi-fungible position manager in the Panoptic protocol
  - [x] `PanopticPool`
  - [x] `PanopticPoolData`
  - [x] `PanopticCollateral`
  - [x] `PanopticCollateralData`
  - [x] `PanopticPosition`
  - [x] `PanopticPositionData`
  - [x] `PanopticCollateralPosition`
  - [x] `PanopticCollateralPositionData`

- Utilities

  - [x] `createPanopticPool`
  - [x] `createPanopticCollateral`
  - [x] `createPanopticPosition`
  - [x] `calculatePanopticTokenID`
  - [x] `calculatePanopticPositionKey`
  - [ ] `calculatePanopticDeployNewPool`
  - [ ] `calculatePanopticMintOptions`
  - [ ] `calculatePanopticRollOptions`
  - [ ] `calculatePanopticBurnOptions`
  - [ ] `calculatePanopticForceExercise`
  - [ ] `calcuatePanopticLiquidateAccount`
  - [ ] `calculatePanopticCollateralMint`
  - [x] `calculatePanopticCollateralDeposit`
  - [ ] `calculatePanopticCollateralRedeem`
  - [ ] `calculatePanopticCollateralWithdraw`
  - [ ] `calculateSFPMInitializeAMMPool`
  - [ ] `calculateSFPMMintTokenizedPosition`
  - [ ] `calculateSFPMRollTokenizedPosition`
  - [ ] `calculateSFPMBurnTokenizedPosition`

- Public Actions

  - [x] `getPanopticPoolData`
  - [x] `getPanopticCollateralData`
  - [x] `getPanopticCollateralPositionData`
  - [x] `getPanopticPositionData`
  - [ ] `simulatePanopticDeployNewPool`
  - [x] `simulatePanopticMintOptions`
  - [x] `simulatePanopticRollOptions`
  - [x] `simulatePanopticBurnOptions`
  - [x] `simulatePanopticForceExercise`
  - [x] `simulatePanopticLiquidateAccount`
  - [x] `simulatePanopticCollateralMint`
  - [x] `simulatePanopticCollateralDeposit`
  - [x] `simulatePanopticCollateralRedeem`
  - [x] `simulatePanopticCollateralWithdraw`
  - [ ] `simulateSFPMInitializeAMMPool`
  - [ ] `simulateSFPMMintTokenizedPosition`
  - [ ] `simulateSFPMRollTokenizedPosition`
  - [ ] `simulateSFPMBurnTokenizedPosition`

- Chains

  - [x] `sepoliaPanoptic`

- ABIs

  - [x] `panopticFactoryABI`
  - [x] `panopticCollateralTrackerABI`
  - [x] `panopticPoolABI`
  - [x] `panopticSemiFuniblePositionManagerABI`
