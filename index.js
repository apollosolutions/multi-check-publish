#!/usr/bin/env node

import meow from "meow";
import { check } from "./src/check.js";
import { publish } from "./src/publish.js";

const cli = meow(
  `
  Experimental wrapper around Apollo Rover.

  USAGE
      $ @apollosolutions/roverx supergraph check mygraph@current --config config.yaml
      $ @apollosolutions/roverx supergraph publish mygraph@current --config config.yaml

  FLAGS
        --config <config-path>      The relative path to the supergraph configuration file. See
                                    https://www.apollographql.com/docs/rover/supergraphs/#configuration
    -l, --log <log-level>           Specify Rover's log level [possible values: error, warn, info,
                                    debug, trace]
        --profile <profile-name>    Name of configuration profile to use [default: default]
    -H, --header <key:value>...     Headers to pass to the endpoint if using subgraph_url in your
                                    config. Values must be key:value pairs. If a value has a space 
                                    in it, use quotes around the pair, ex. -H "Auth:some key"

  CHECK FLAGS
        --query-count-threshold <query-count-threshold>
        --query-percentage-threshold <query-percentage-threshold>
        --validation-period <validation-period>
`,
  {
    importMeta: import.meta,
    flags: {
      config: {
        type: "string",
        isRequired: true,
      },
      log: {
        type: "string",
        alias: "l",
      },
      profile: {
        type: "string",
      },
      header: {
        type: "string",
        alias: "H",
        isMultiple: true,
      },
      queryCountThreshold: {
        type: "string",
      },
      queryPercentageThreshold: {
        type: "string",
      },
      validationPeriod: {
        type: "string",
      },
    },
  }
);

switch (cli.input[0]) {
  case "supergraph":
    switch (cli.input[1]) {
      case "check": {
        if (!cli.input[2]) {
          console.error(`<graphRef> missing`);
          process.exit(1);
        }
        check({ graphRef: cli.input[2], ...cli.flags });
        break;
      }

      case "publish": {
        if (!cli.input[2]) {
          console.error(`<graphRef> missing`);
          process.exit(1);
        }
        publish({ graphRef: cli.input[2], ...cli.flags });
        break;
      }

      default:
        console.error(`Invalid command ${cli.input[1]}`);
        process.exit(1);
    }
    break;
  default:
    console.error(`Invalid command ${cli.input[0]}`);
    process.exit(1);
}
