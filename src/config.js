import { resolve, dirname } from "path";
import { stat, readFile } from "fs/promises";
import { load } from "js-yaml";
import { roverSubgraphFetch, roverSubgraphIntrospect } from "./rover.js";

/**
 * @param {string} path
 * @returns {Promise<import("./typings").Config & { dirname: string }>}
 */
export async function loadConfig(path, cwd = process.cwd()) {
  const fullPath = resolve(cwd, path);
  const file = await stat(fullPath);

  if (!file.isFile) {
    console.error(`config file ${path} not found`);
    process.exit(1);
  }

  const yaml = load(await readFile(fullPath, "utf-8"));

  if (!isValidConfig(yaml)) {
    console.error(`Config at ${path} is invalid`);
    process.exit(1);
  }

  return { ...yaml, dirname: dirname(fullPath) };
}

/**
 * @param {any} config
 * @returns {config is import("./typings").Config}
 */
function isValidConfig(config) {
  return "subgraphs" in config;
}

/**
 * @param {import("./typings").SubgraphSchemaConfig} subgraph
 * @param {string} cwd
 * @param {string[] | undefined} [headers]
 * @returns {Promise<{schema: string | '-'; stdin: string | undefined;}>}
 */
export async function getSchema(subgraph, cwd, headers) {
  if ("file" in subgraph) {
    return { schema: resolve(cwd, subgraph.file), stdin: undefined };
  } else if ("subgraph_url" in subgraph) {
    const stdin = await roverSubgraphIntrospect(subgraph.subgraph_url, headers);
    return { schema: "-", stdin };
  } else {
    const stdin = await roverSubgraphFetch(
      subgraph.graphref,
      subgraph.subgraph
    );
    return { schema: "-", stdin };
  }
}
