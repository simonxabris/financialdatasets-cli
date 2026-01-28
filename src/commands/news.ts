import { Command, Options } from "@effect/cli"
import { Console, Effect } from "effect"
import { getNews } from "../api/news"
import { ensureDate, ensureRange, formatError, getApiKey } from "./shared"

const ticker = Options.text("ticker").pipe(
  Options.withDescription("The ticker symbol."),
  Options.withPseudoName("string")
)

const startDate = Options.text("start-date").pipe(
  Options.filterMap((value) => ensureDate(value), "start-date must be in YYYY-MM-DD format"),
  Options.withDescription("The start date for the news data (format: YYYY-MM-DD)."),
  Options.withPseudoName("YYYY-MM-DD"),
  Options.withDefault(undefined)
)

const endDate = Options.text("end-date").pipe(
  Options.filterMap((value) => ensureDate(value), "end-date must be in YYYY-MM-DD format"),
  Options.withDescription("The end date for the news data (format: YYYY-MM-DD)."),
  Options.withPseudoName("YYYY-MM-DD"),
  Options.withDefault(undefined)
)

const limit = Options.integer("limit").pipe(
  Options.filterMap((value) => ensureRange(value, 1, 100), "limit must be between 1 and 100"),
  Options.withDefault(100),
  Options.withDescription("The maximum number of news articles to return (default: 100, max: 100)."),
  Options.withPseudoName("integer")
)

export const newsCommand = Command.make(
  "news",
  { ticker, startDate, endDate, limit },
  ({ ticker, startDate, endDate, limit }) =>
    Effect.gen(function*() {
      const apiKey = yield* getApiKey()

      const response = yield* getNews(apiKey, { ticker, startDate, endDate, limit })

      yield* Console.log(JSON.stringify(response))
    }).pipe(
      Effect.catchAll((error) =>
        Console.error(formatError(error)).pipe(Effect.andThen(Effect.fail(error)))
      )
    )
)
