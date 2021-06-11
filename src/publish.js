import { getSchema, loadConfig } from "./config.js";
import { roverSubgraphPublish } from "./rover.js";

/**
 * @param {{ graphRef: string; config: string; profile?: string; log?: string; headers?: string[] }} params
 */
export async function publish({ graphRef, config, profile, log, headers }) {
  const { subgraphs, dirname } = await loadConfig(config);

  for await (const [name, subgraph] of Object.entries(subgraphs)) {
    const schema = await getSchema(subgraph.schema, dirname, headers);

    const exitCode = await roverSubgraphPublish({
      graphRef,
      name,
      profile,
      log,
      routingUrl: subgraph.routing_url,
      ...schema,
    });

    if (exitCode !== 0) {
      console.error("Halting");
      process.exit(exitCode || 1);
    }

    // add a 2 second delay between each publish to account for a concurrency issue in Studio
    await new Promise((r) => setTimeout(r, 2000));
  }
}
