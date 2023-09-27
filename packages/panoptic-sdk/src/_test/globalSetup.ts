import { startProxy } from "@viem/anvil";
import { testClient } from "./utils.js";

export default async function () {
  const shutdown = await startProxy({
    options: {
      forkUrl: "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
    },
  });

  await testClient.setAutomine(true);

  return shutdown;
}
