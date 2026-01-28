import { Command, Options } from "@effect/cli"
import { Console, Effect, Option } from "effect"
import { getHistoricalPrices } from "../api/prices"
import { isApiError } from "../api/client"

const datePattern = /^\d{4}-\d{2}-\d{2}$/

const ensureDate = (value: string) =>
  datePattern.test(value)
    ? Option.some(value)
    : Option.none()

const ensureMin = (value: number, min: number) =>
  value >= min ? Option.some(value) : Option.none()

const ensureRange = (value: number, min: number, max: number) =>
  value >= min && value <= max ? Option.some(value) : Option.none()

const formatError = (error: unknown): string => {
  if (isApiError(error)) {
    const parts = [`Request failed (${error.status})`]

    if (error.error) {
      parts.push(error.error)
    }

    if (error.message) {
      parts.push(error.message)
    }

    return parts.join(": ")
  }

  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

const ticker = Options.text("ticker").pipe(
  Options.withDescription("The ticker symbol."),
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
      const apiKey = yield* Effect.sync(() => {
        const value = process.env.FINANCIAL_DATASETS_API_KEY

        if (!value) {
          throw new Error("Missing FINANCIAL_DATASETS_API_KEY in environment.")
        }

        return value
      })

      const response = yield*
        getHistoricalPrices(apiKey, {
          ticker,
          interval,
          intervalMultiplier,
          startDate,
          endDate,
          limit
        })

      yield* Console.log(JSON.stringify(response))
    }).pipe(
      Effect.catchAll((error) =>
        Console.error(formatError(error)).pipe(Effect.andThen(Effect.fail(error)))
      )
    )
)

export const pricesCommand = Command.make("prices", {}, () => Effect.succeed(undefined)).pipe(
  Command.withSubcommands([historical])
)
