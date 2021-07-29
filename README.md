# multi-check-publish ⚠️ Experimental ⚠️

Experimental wrapper around Apollo Rover.

Currently provides:

- Performing schema checks for all subgraphs of a federated graph
  with `multi-check-publish supergraph check --config config.yaml`.
- Publishing all subgraph schemas in a federated graph with
  `multi-check-publish supergraph publish --config config.yaml`.

## Usage

Until this is published to a registry, you can use it from GitHub:

```sh
npx github:apollosolutions/multi-check-publish --help
```

## Notes

- You probably want to run `rover supergraph compose` before running either
  `multi-check-publish supergraph publish`. Publishing subgraphs with composition errors
  will not update your gateway when using managed federation.
