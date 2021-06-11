import execa from "execa";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function roverBin() {
  return resolve(__dirname, "../node_modules/.bin/rover");
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
 *  log?: string
 * }} params
 */
export async function roverSubgraphCheck({
  graphRef,
  name,
  schema,
  stdin,
  profile,
  log,
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
 *  log?: string
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
