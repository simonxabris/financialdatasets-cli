import { Command, Options } from "@effect/cli"
import { Console, Effect } from "effect"
import {
  getBalanceSheets,
  getCashFlowStatements,
  getFinancials,
  getIncomeStatements
} from "../api/financials"
import { getApiKey } from "./shared"

const ticker = Options.text("ticker").pipe(
  Options.withDescription("The ticker symbol."),
  Options.withPseudoName("string")
)

const period = Options.choice("period", ["annual", "quarterly", "ttm"] as const).pipe(
  Options.withDescription("The time period of the financial statements."),
  Options.withPseudoName("annual|quarterly|ttm")
)

const limit = Options.integer("limit").pipe(
  Options.withDescription("The maximum number of financial statements to return."),
  Options.withPseudoName("integer"),
  Options.withDefault(undefined)
)

const cik = Options.text("cik").pipe(
  Options.withDescription("The Central Index Key (CIK) of the company."),
  Options.withPseudoName("string"),
  Options.withDefault(undefined)
)

const all = Command.make(
  "all",
  { ticker, period, limit, cik },
  ({ ticker, period, limit, cik }) =>
    Effect.gen(function*() {
      const apiKey = yield* getApiKey()

      const response = yield* getFinancials(apiKey, { ticker, period, limit, cik })

      yield* Console.log(JSON.stringify(response))
    })
)

const incomeStatements = Command.make(
  "income-statements",
  { ticker, period, limit, cik },
  ({ ticker, period, limit, cik }) =>
    Effect.gen(function*() {
      const apiKey = yield* getApiKey()

      const response = yield* getIncomeStatements(apiKey, { ticker, period, limit, cik })

      yield* Console.log(JSON.stringify(response))
    })
)

const balanceSheets = Command.make(
  "balance-sheets",
  { ticker, period, limit, cik },
  ({ ticker, period, limit, cik }) =>
    Effect.gen(function*() {
      const apiKey = yield* getApiKey()

      const response = yield* getBalanceSheets(apiKey, { ticker, period, limit, cik })

      yield* Console.log(JSON.stringify(response))
    })
)

const cashFlowStatements = Command.make(
  "cash-flow-statements",
  { ticker, period, limit, cik },
  ({ ticker, period, limit, cik }) =>
    Effect.gen(function*() {
      const apiKey = yield* getApiKey()

      const response = yield* getCashFlowStatements(apiKey, { ticker, period, limit, cik })

      yield* Console.log(JSON.stringify(response))
    })
)

export const financialsCommand = Command.make("financials", {}, () => Effect.succeed(undefined)).pipe(
  Command.withSubcommands([all, incomeStatements, balanceSheets, cashFlowStatements])
)
