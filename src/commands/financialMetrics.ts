import { Command, Options } from "@effect/cli"
import { Console, Effect } from "effect"
import { getFinancialMetrics, getFinancialMetricsSnapshot } from "../api/financialMetrics"
import { getApiKey } from "./shared"

const ticker = Options.text("ticker").pipe(
  Options.withDescription("The ticker symbol of the company."),
  Options.withPseudoName("string")
)

const period = Options.choice("period", ["annual", "quarterly", "ttm"] as const).pipe(
  Options.withDescription("The time period for the financial data."),
  Options.withPseudoName("annual|quarterly|ttm")
)

const limit = Options.integer("limit").pipe(
  Options.withDescription("The maximum number of results to return."),
  Options.withPseudoName("integer"),
  Options.withDefault(undefined)
)

const historical = Command.make(
  "historical",
  { ticker, period, limit },
  ({ ticker, period, limit }) =>
    Effect.gen(function*() {
      const apiKey = yield* getApiKey()

      const response = yield* getFinancialMetrics(apiKey, { ticker, period, limit })

      yield* Console.log(JSON.stringify(response))
    })
)

const snapshot = Command.make(
  "snapshot",
  { ticker },
  ({ ticker }) =>
    Effect.gen(function*() {
      const apiKey = yield* getApiKey()

      const response = yield* getFinancialMetricsSnapshot(apiKey, { ticker })

      yield* Console.log(JSON.stringify(response))
    })
)

export const financialMetricsCommand = Command.make(
  "financial-metrics",
  {},
  () => Effect.succeed(undefined)
).pipe(Command.withSubcommands([historical, snapshot]))
