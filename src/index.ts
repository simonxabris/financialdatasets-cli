#!/usr/bin/env node
import { Command, ValidationError } from "@effect/cli"
import { NodeContext, NodeRuntime } from "@effect/platform-node"
import { Effect } from "effect"
import { pricesCommand } from "./commands/prices"
import { cryptoCommand } from "./commands/crypto"
import { companyCommand } from "./commands/company"
import { earningsCommand } from "./commands/earnings"
import { financialsCommand } from "./commands/financials"
import { newsCommand } from "./commands/news"
import { filingsCommand } from "./commands/filings"
import { insiderTradesCommand } from "./commands/insiderTrades"
import { institutionalOwnershipCommand } from "./commands/institutionalOwnership"
import { financialMetricsCommand } from "./commands/financialMetrics"
import { formatError } from "./commands/shared"

const command = Command.make("financialdatasets", {}, () => Effect.succeed(undefined)).pipe(
  Command.withSubcommands([
    pricesCommand,
    cryptoCommand,
    companyCommand,
    earningsCommand,
    financialsCommand,
    newsCommand,
    filingsCommand,
    insiderTradesCommand,
    institutionalOwnershipCommand,
    financialMetricsCommand
  ])
)

const cli = Command.run(command, {
  name: "Financial Datasets CLI",
  version: "0.0.0"
})

const program = cli(process.argv).pipe(
  Effect.catchAll((error) =>
    Effect.sync(() => {
      if (!ValidationError.isValidationError(error)) {
        console.error(formatError(error))
      }

      process.exitCode = 1
    })
  )
)

program.pipe(Effect.provide(NodeContext.layer), NodeRuntime.runMain)
