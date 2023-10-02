# Panoptic SDK

Typescript SDK for Panoptic

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
  - [x] `calculatePanopticTokenID`
  - [x] `calculatePanopticPositionKey`
  - [ ] `calculatePanopticDeployNewPool`
  - [ ] `calculatePanopticMintOptions`
  - [ ] `calculatePanopticBurnOptions`
  - [ ] `calculatePanopticRollOptions`
  - [ ] `calculatePanopticForceExercise`
  - [ ] `calcuatePanopticLiquidateAccount`
  - [x] `calculatePanopticCollateralMint`
  - [x] `calculatePanopticCollateralDeposit`
  - [x] `calculatePanopticCollateralRedeem`
  - [x] `calculatePanopticCollateralWithdraw`
  - [ ] `calculateSFPMInitializeAMMPool`
  - [ ] `calculateSFPMMintTokenizedPosition`
  - [ ] `calculateSFPMBurnTokenizedPosition`
  - [ ] `calculateSFPMRollTokenizedPosition`

- Public Actions

  - [x] `getPanopticPool`
  - [x] `getPanopticPoolData`
  - [x] `getPanopticCollateralData`
  - [x] `getPanopticCollateralPositionData`
  - [x] `getPanopticPositionData`
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
  - [x] `simulateSFPMInitializeAMMPool`
  - [x] `simulateSFPMMintTokenizedPosition`
  - [x] `simulateSFPMBurnTokenizedPosition`
  - [ ] `simulateSFPMRollTokenizedPosition`

- Chains

  - [x] `sepoliaPanoptic`

- ABIs

  - [x] `panopticFactoryABI`
  - [x] `panopticCollateralTrackerABI`
  - [x] `panopticPoolABI`
  - [x] `panopticSemiFuniblePositionManagerABI`
