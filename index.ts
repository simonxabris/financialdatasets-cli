import { Command } from "@effect/cli"
import { NodeContext, NodeRuntime } from "@effect/platform-node"
import { Effect } from "effect"
import { pricesCommand } from "./src/commands/prices"
import { cryptoCommand } from "./src/commands/crypto"
import { companyCommand } from "./src/commands/company"
import { earningsCommand } from "./src/commands/earnings"
import { financialsCommand } from "./src/commands/financials"
import { newsCommand } from "./src/commands/news"
import { filingsCommand } from "./src/commands/filings"
import { insiderTradesCommand } from "./src/commands/insiderTrades"
import { institutionalOwnershipCommand } from "./src/commands/institutionalOwnership"
import { financialMetricsCommand } from "./src/commands/financialMetrics"

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

cli(process.argv).pipe(Effect.provide(NodeContext.layer), NodeRuntime.runMain)
