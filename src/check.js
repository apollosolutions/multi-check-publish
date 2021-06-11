import { loadConfig, getSchema } from "./config.js";
import { roverSubgraphCheck } from "./rover.js";

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
