import { Command, Options } from "@effect/cli"
import { Console, Effect } from "effect"
import { getCryptoHistoricalPrices, getCryptoPriceSnapshot } from "../api/crypto"
import { ensureDate, ensureMin, ensureRange, getApiKey, printSubcommandHelp } from "./shared"

const ticker = Options.text("ticker").pipe(
  Options.withDescription("The cryptocurrency ticker symbol."),
  Options.withPseudoName("string")
)

const interval = Options.choice("interval", ["day", "week", "month", "year"] as const).pipe(
  Options.withDescription("The time interval for the price data."),
  Options.withPseudoName("day|week|month|year")
)

const intervalMultiplier = Options.integer("interval-multiplier").pipe(
  Options.filterMap((value) => ensureMin(value, 1), "interval-multiplier must be >= 1"),
  Options.withDescription("The multiplier for the interval."),
  Options.withPseudoName("integer")
)

const startDate = Options.text("start-date").pipe(
  Options.filterMap((value) => ensureDate(value), "start-date must be in YYYY-MM-DD format"),
  Options.withDescription("The start date for the price data (format: YYYY-MM-DD)."),
  Options.withPseudoName("YYYY-MM-DD")
)

const endDate = Options.text("end-date").pipe(
  Options.filterMap((value) => ensureDate(value), "end-date must be in YYYY-MM-DD format"),
  Options.withDescription("The end date for the price data (format: YYYY-MM-DD)."),
  Options.withPseudoName("YYYY-MM-DD")
)

const limit = Options.integer("limit").pipe(
  Options.filterMap((value) => ensureRange(value, 1, 5000), "limit must be between 1 and 5000"),
  Options.withDefault(5000),
  Options.withDescription("The maximum number of price records to return (default: 5000, max: 5000)."),
  Options.withPseudoName("integer")
)

const historical = Command.make(
  "historical",
  { ticker, interval, intervalMultiplier, startDate, endDate, limit },
  ({ ticker, interval, intervalMultiplier, startDate, endDate, limit }) =>
    Effect.gen(function*() {
      const apiKey = yield* getApiKey()

      const response = yield*
        getCryptoHistoricalPrices(apiKey, {
          ticker,
          interval,
          intervalMultiplier,
          startDate,
          endDate,
          limit
        })

      yield* Console.log(JSON.stringify(response))
    })
)

const snapshot = Command.make(
  "snapshot",
  { ticker },
  ({ ticker }) =>
    Effect.gen(function*() {
      const apiKey = yield* getApiKey()

      const response = yield* getCryptoPriceSnapshot(apiKey, { ticker })

      yield* Console.log(JSON.stringify(response))
    })
)

let cryptoWithSubcommands: Command.Command<string, unknown, unknown, unknown>
const cryptoBase = Command.make("crypto", {}, () => Effect.succeed(undefined)).pipe(
  Command.withHandler(() => printSubcommandHelp(cryptoWithSubcommands))
)
cryptoWithSubcommands = cryptoBase.pipe(Command.withSubcommands([historical, snapshot]))

export const cryptoCommand = cryptoWithSubcommands
