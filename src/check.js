import { loadConfig, getSchema } from "./config.js";
import { roverSubgraphCheck } from "./rover.js";

import { Command, Option } from "clipanion";

export class CheckCommand extends Command {
  static paths = [["supergraph", "check"]];

  static usage = Command.Usage({
    category: `Subgraph Checks`,
    description: `Run a schema check for each subgraph in the supergraph config.`,
  });

  graphRef = Option.String({ required: true });

  config = Option.String("--config", { required: true });

  profile = Option.String("--profile");

  log = Option.String("--log,-l");

  headers = Option.Array("--header,-H");

  queryCountThreshold = Option.String("--query-count-threshold");

  queryPercentageThreshold = Option.String("--query-percentage-threshold");

  validationPeriod = Option.String("--validation-period");

  async execute() {
    await check({ ...this });
  }
}

/**
 * @param {{
 *  graphRef: string;
 *  config: string;
 *  profile?: string;
 *  log?: string;
 *  headers?: string[];
 *  queryCountThreshold?: string;
 *  queryPercentageThreshold?: string;
 *  validationPeriod?: string;
 * }} params
 */
export async function check({
  graphRef,
  config,
  profile,
  log,
  headers,
  ...rest
}) {
  const { subgraphs, dirname } = await loadConfig(config);

  for await (const [name, subgraph] of Object.entries(subgraphs)) {
    const schema = await getSchema(subgraph.schema, dirname, headers);

    const exitCode = await roverSubgraphCheck({
      graphRef,
      name,
      profile,
      log,
      ...schema,
      ...rest,
    });

    if (exitCode !== 0) {
      console.error("Halting");
      process.exit(exitCode || 1);
    }
  }
}
