import { type ReverseMirage, createERC20, getERC20 } from "reverse-mirage";
import type { Address, Client, ReadContractParameters, Transport } from "viem";
import { readContract } from "viem/actions";
import type { Chain } from "viem/chains";
import { collateralTrackerABI } from "../generated.js";
import type { PanopticCollateral } from "../types/PanopticCollateral.js";
import { createPanopticCollateral } from "../utils/createPanopticCollateral.js";

export type GetPanopticCollateralParameters = Omit<
  ReadContractParameters<typeof collateralTrackerABI, "asset">,
  "address" | "abi" | "functionName" | "args"
> & {
  panopticCollateral: Pick<PanopticCollateral, "address" | "chainID"> &
    Partial<Pick<PanopticCollateral, "blockCreated">>;
};

export type GetPanopticCollateralReturnType = PanopticCollateral;

export const getPanopticCollateral = <
  TChain extends Chain | undefined,
  T extends "select" | undefined,
>(
  client: Client<Transport, TChain>,
  { panopticCollateral, ...request }: GetPanopticCollateralParameters,
  type?: T,
) =>
  (type === undefined
    ? Promise.all([
        readContract(client, {
          address: panopticCollateral.address,
          abi: collateralTrackerABI,
          functionName: "asset",
          ...request,
        }).then((data) =>
          getERC20(client, {
            erc20: { address: data, chainID: panopticCollateral.chainID },
            ...request,
          }),
        ),
        getERC20(client, {
          erc20: {
            address: panopticCollateral.address,
            chainID: panopticCollateral.chainID,
          },
          ...request,
        }),
      ] as const).then((data) =>
        createPanopticCollateral(
          panopticCollateral.address,
          data[1].name,
          data[1].symbol,
          data[1].decimals,
          panopticCollateral.chainID,
          data[0],
          panopticCollateral.blockCreated,
        ),
      )
    : {
        read: () =>
          Promise.all([
            readContract(client, {
              address: panopticCollateral.address,
              abi: collateralTrackerABI,
              functionName: "asset",
              ...request,
            }).then((data) =>
              Promise.all([
                data,
                getERC20(
                  client,
                  {
                    erc20: {
                      address: data,
                      chainID: panopticCollateral.chainID,
                    },
                    ...request,
                  },
                  "select",
                ).read(),
              ]),
            ),
            getERC20(
              client,
              {
                erc20: {
                  address: panopticCollateral.address,
                  chainID: panopticCollateral.chainID,
                },
                ...request,
              },
              "select",
            ).read(),
          ]),
        parse: ([[address, underlying], token]) =>
          createPanopticCollateral(
            panopticCollateral.address,
            token[0],
            token[1],
            token[2],
            panopticCollateral.chainID,
            createERC20(
              address,
              underlying[0],
              underlying[1],
              underlying[2],
              panopticCollateral.chainID,
              panopticCollateral.blockCreated,
            ),
            panopticCollateral.blockCreated,
          ),
      }) as ReverseMirage<
    [[Address, [string, string, number]], [string, string, number]],
    GetPanopticCollateralReturnType,
    T
  >;
