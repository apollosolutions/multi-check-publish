# multi-check-publish

Experimental wrapper around Apollo Rover.

**The code in this repository is experimental and has been provided for reference purposes only. Community feedback is welcome but this project may not be supported in the same way that repositories in the official [Apollo GraphQL GitHub organization](https://github.com/apollographql) are. If you need help you can file an issue on this repository, [contact Apollo](https://www.apollographql.com/contact-sales) to talk to an expert, or create a ticket directly in Apollo Studio.**

Currently provides:

- Performing schema checks for all subgraphs of a federated graph
  with `multi-check-publish supergraph check --config config.yaml`.
- Publishing all subgraph schemas in a federated graph with
  `multi-check-publish supergraph publish --config config.yaml`.
- Generating a supergraph config file from a graph in Apollo Studio with
  `multi-check-publish supergraph init mygraph@current`.

## Usage

Until this is published to a registry, you can use it from GitHub:

```sh
npx github:@apollosolutions/multi-check-publish --help
```

## Recipes

### Duplicating a variant

```sh
npx github:@apollosolutions/multi-check-publish supergraph init mygraph@current | \
  npx github:@apollosolutions/multi-check-publish supergraph publish mygraph@new-variant --config -
```

## Notes

- You probably want to run `rover supergraph compose` before running either
  `multi-check-publish supergraph publish`. Publishing subgraphs with composition errors
  will not update your gateway when using managed federation.
