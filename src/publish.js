import { getSchema, loadConfig } from "./config.js";
import { roverSubgraphPublish } from "./rover.js";
import { Command, Option } from "clipanion";

export class PublishCommand extends Command {
  static paths = [["supergraph", "publish"]];

  static usage = Command.Usage({
    category: `Subgraph Publishes`,
    description: `Run a subgraph publish for each subgraph in the supergraph config.`,
  });

  graphRef = Option.String({ required: true });

  config = Option.String("--config", { required: true });

  profile = Option.String("--profile");

  log = Option.String("--log,-l");

  convert = Option.Boolean("--convert");

  timeout = Option.String("--client-timeout");

  async execute() {
    await publish({ ...this });
  }
}

/**
 * @param {{ graphRef: string; config: string; profile?: string; log?: string; headers?: string[], convert?: boolean }} params
 */
export async function publish({
  graphRef,
  config,
  profile,
  log,
  headers,
  convert,
  timeout,
}) {
  const { subgraphs, dirname } = await loadConfig(config);

  for await (const [name, subgraph] of Object.entries(subgraphs)) {
    const schema = await getSchema(subgraph.schema, dirname, headers);

    const exitCode = await roverSubgraphPublish({
      graphRef,
      name,
      profile,
      log,
      routingUrl: subgraph.routing_url,
      convert,
      timeout,
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
