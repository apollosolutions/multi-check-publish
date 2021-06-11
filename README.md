# roverx ⚠️ Experimental ⚠️

Experimental wrapper around Apollo Rover.

Currently provides:

- Performing schema checks for all subgraphs of a federated graph
  with `roverx supergraph check --config config.yaml`.
- Publishing all subgraph schemas in a federated graph with
  `roverx supergraph publish --config config.yaml`.

## Usage

Until this is published to a registry, you can use it from GitHub:

```sh
npx github:apollosolutions/roverx --help
```

## Notes

- You probably want to run `rover supergraph compose` before running either
  `roverx supergraph publish`. Publishing subgraphs with composition errors
  will not update your gateway when using managed federation.
