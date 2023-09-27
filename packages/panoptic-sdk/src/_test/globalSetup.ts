import { startProxy } from "@viem/anvil";
import { testClient } from "./utils.js";

export default async function () {
  const shutdown = await startProxy({
    options: {
      forkUrl:
        "https://eth-sepolia.g.alchemy.com/v2/kw-ycolm1dq00fqT_Y-b-FkV-Ai6h38m",
    },
  });

  await testClient.setAutomine(true);

  return shutdown;
}
