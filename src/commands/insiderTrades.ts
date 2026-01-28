import { Command, Options } from "@effect/cli"
import { Console, Effect } from "effect"
import { getInsiderTrades } from "../api/insiderTrades"
import { formatError, getApiKey } from "./shared"

const ticker = Options.text("ticker").pipe(
  Options.withDescription("The ticker symbol of the company."),
  Options.withPseudoName("string")
)

const limit = Options.integer("limit").pipe(
  Options.withDescription("The maximum number of transactions to return (default: 10)."),
  Options.withPseudoName("integer"),
  Options.withDefault(10)
)

export const insiderTradesCommand = Command.make(
  "insider-trades",
  { ticker, limit },
  ({ ticker, limit }) =>
    Effect.gen(function*() {
      const apiKey = yield* getApiKey()

      const response = yield* getInsiderTrades(apiKey, { ticker, limit })

      yield* Console.log(JSON.stringify(response))
    }).pipe(
      Effect.catchAll((error) =>
        Console.error(formatError(error)).pipe(Effect.andThen(Effect.fail(error)))
      )
    )
)
