import { execa } from "execa";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

function roverBin() {
  const rover = require.resolve("@apollo/rover/run.js");
  if (!rover) {
    throw new Error("cannot find @apollo/rover NPM package");
  }
  return rover;
}

/**
 * @param {{
 *  graphRef: string;
 *  profile?: string;
 *  log?: string;
 * }} params
 */
export async function roverSubgraphList({ graphRef, profile, log, timeout }) {
  const proc = execa("node", [
    roverBin(),
    "subgraph",
    "list",
    graphRef,
    "--output",
    "json",
    ...(profile ? ["--profile", profile] : []),
    ...(log ? ["--log", log] : []),
    ...(timeout ? ["--client-timeout", timeout] : []),
  ]);

  return JSON.parse((await proc).stdout);
}

/**
 * @param {string} url
 * @param {string[] | undefined} [headers]
 */
export async function roverSubgraphIntrospect(url, headers) {
  const proc = execa("node", [
    roverBin(),
    "subgraph",
    "introspect",
    url,
    ...(headers ? headers.map((h) => ["--header", h]).flat() : []),
  ]);

  return (await proc).stdout;
}

/**
 * @param {string} graphRef
 * @param {string} subgraph
 */
export async function roverSubgraphFetch(graphRef, subgraph) {
  const proc = execa("node", [
    roverBin(),
    "subgraph",
    "fetch",
    graphRef,
    "--name",
    subgraph,
  ]);

  return (await proc).stdout;
}

/**
 * @param {{
 *  graphRef: string;
 *  name: string;
 *  schema: string | '-';
 *  stdin: string | undefined;
 *  profile?: string;
 *  log?: string;
 *  queryCountThreshold?: string;
 *  queryPercentageThreshold?: string;
 *  validationPeriod?: string;
 * }} params
 */
export async function roverSubgraphCheck({
  graphRef,
  name,
  schema,
  stdin,
  profile,
  log,
  queryCountThreshold,
  queryPercentageThreshold,
  validationPeriod,
  timeout,
}) {
  const proc = execa(
    "node",
    [
      roverBin(),
      "subgraph",
      "check",
      graphRef,
      "--name",
      name,
      "--schema",
      schema,
      ...(profile ? ["--profile", profile] : []),
      ...(log ? ["--log", log] : []),
      ...(queryCountThreshold
        ? ["--query-count-threshold", queryCountThreshold]
        : []),
      ...(queryPercentageThreshold
        ? ["--query-percentage-threshold", queryPercentageThreshold]
        : []),
      ...(validationPeriod ? ["--validation-period", validationPeriod] : []),
      ...(timeout ? ["--client-timeout", timeout] : []),
    ],
    {
      input: stdin,
      env: { APOLLO_KEY: process.env.APOLLO_KEY },
    }
  );

  proc.stdout?.pipe(process.stdout);
  proc.stderr?.pipe(process.stderr);
  await proc;

  return proc.exitCode;
}

/**
 * @param {{
 *  graphRef: string;
 *  name: string;
 *  routingUrl: string;
 *  schema: string | '-';
 *  stdin: string | undefined;
 *  profile?: string;
 *  log?: string;
 *  convert?: boolean;
 * }} params
 */
export async function roverSubgraphPublish({
  graphRef,
  name,
  routingUrl,
  schema,
  stdin,
  profile,
  log,
  convert,
  timeout,
}) {
  const proc = execa(
    "node",
    [
      roverBin(),
      "subgraph",
      "publish",
      graphRef,
      "--name",
      name,
      "--routing-url",
      routingUrl,
      "--schema",
      schema,
      ...(profile ? ["--profile", profile] : []),
      ...(log ? ["--log", log] : []),
      ...(convert ? ["--convert"] : []),
      ...(timeout ? ["--client-timeout", timeout] : []),
    ],
    {
      input: stdin,
      env: { APOLLO_KEY: process.env.APOLLO_KEY },
    }
  );

  proc.stdout?.pipe(process.stdout);
  proc.stderr?.pipe(process.stderr);
  await proc;
  return proc.exitCode;
}
