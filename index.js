#!/usr/bin/env node

import { Builtins, Cli } from "clipanion";
import { CheckCommand } from "./src/check.js";
import { InitCommand } from "./src/init.js";
import { PublishCommand } from "./src/publish.js";

const [_, __, ...args] = process.argv;

const cli = new Cli({
  binaryLabel: `multi-check-publish`,
  binaryName: `multi-check-publish`,
  binaryVersion: `1.0.0`,
});

cli.register(Builtins.HelpCommand);
cli.register(CheckCommand);
cli.register(InitCommand);
cli.register(PublishCommand);
cli.runExit(args);
