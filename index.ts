import { Command } from "@effect/cli"
import { NodeContext, NodeRuntime } from "@effect/platform-node"
import { Effect } from "effect"
import { pricesCommand } from "./src/commands/prices"

const command = Command.make("financialdatasets", {}, () => Effect.succeed(undefined)).pipe(
  Command.withSubcommands([pricesCommand])
)

const cli = Command.run(command, {
  name: "Financial Datasets CLI",
  version: "0.0.0"
})

cli(process.argv).pipe(Effect.provide(NodeContext.layer), NodeRuntime.runMain)
