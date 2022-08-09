import { dump } from "js-yaml";
import { roverSubgraphList } from "./rover.js";
import { Command, Option } from "clipanion";

export class InitCommand extends Command {
  static paths = [["supergraph", "init"]];

  static usage = Command.Usage({
    category: `Supergraph Config Init`,
    description: `Generate a supergraph config for a federated graph in Apollo Studio.`,
    examples: [
      [`A basic example`, `$0 supergraph init mygraph@current`],
      [
        `Duplicate a variant`,
        `$0 supergraph init mygraph@current | $0 supergraph publish mygraph@new-variant --config -`,
      ],
    ],
  });

  graphRef = Option.String({ required: true });

  profile = Option.String("--profile");

  log = Option.String("--log,-l");

  timeout = Option.String("--client-timeout");

  async execute() {
    await init({ ...this });
  }
}

/**
 * @param {{
 *  graphRef: string;
 *  profile?: string;
 *  log?: string;
 * }} params
 */
export async function init({ graphRef, profile, log, timeout }) {
  const subgraphs = await roverSubgraphList({
    graphRef,
    profile,
    log,
    timeout,
  });

  if (subgraphs.data) {
    console.log(dump(createConfig(subgraphs.data, graphRef)));
  } else {
    console.log("invalid data");
    console.log(subgraphs);
    process.exit(1);
  }
}

/**
 * @param {{ subgraphs: { name: string; url: string; }[] }} data
 * @param {string} graphRef
 * @returns {{ subgraphs: { [key: string]: { routing_url: string; schema: { graphref: string; subgraph: string; }}}}}
 */
function createConfig(data, graphRef) {
  return {
    subgraphs: Object.fromEntries(
      data.subgraphs.map((subgraph) => {
        return [
          subgraph.name,
          {
            routing_url: subgraph.url,
            schema: {
              graphref: graphRef,
              subgraph: subgraph.name,
            },
          },
        ];
      })
    ),
  };
}
