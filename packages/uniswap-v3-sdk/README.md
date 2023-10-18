# Uniswap V3 SDK

Typescript SDK for Uniswap V3

## API

- Entities

  - [x] `UniswapV3Factory`: The factory contract in the Uniswap protocol
  - [x] `UniswapV3Pool`: A pool created by `UniswapV3Factory`
  - [x] `UniswapV3PoolData`: The state of a `UniswapV3Pool`
  - [x] `UniswapV3Tick`: A tick in a `UniswapV3Pool`
  - [x] `UniswapV3TickData`: The state of a `UniswapV3Tick`
  - [x] `UniswapV3Position`: A user position in a `UniswapV3Pool`
  - [x] `UniswapV3PositionData`: The state of a `UniswapV3Position`

- Utilities

  - [x] `createUniswapV3Pool`
  - [x] `createUniswapV3Tick`
  - [x] `createUniswapV3Position`
  - [x] `calculateUniswapV3PositionID`
  - [x] `calculateUniswapV3PoolMint`
  - [x] `calculateUniswapV3PoolBurn`
  - [x] `calculateUniswapV3PoolSwap`

- Public Actions

  - [x] `getUniswapV3PoolData`
  - [x] `getUniswapV3TickData`
  - [x] `getUniswapV3PositionData`

- Chains

  - [x] `mainnetUniswapV3`

- ABIs

  - [x] `uniswapV3FactoryABI`
  - [x] `uniswapV3PoolABI`

## Comparisons

Compared to the established `@uniswap/v3-sdk`, this package has some speed and size savings by using more modern TypeScript.

### Bundle size

### Benchmarking
