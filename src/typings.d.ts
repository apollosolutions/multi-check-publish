export interface Config {
  subgraphs: {
    [subgraphName: string]: {
      routing_url: string;
      schema: SubgraphSchemaConfig;
    };
  };
}

export type SubgraphSchemaConfig =
  | { file: string }
  | { subgraph_url: string }
  | { graphref: string; subgraph: string };
