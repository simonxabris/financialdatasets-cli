import { Command, Options } from "@effect/cli"
import { Console, Effect } from "effect"
import { getInstitutionalOwnership } from "../api/institutionalOwnership"
import { formatError, getApiKey } from "./shared"

const investor = Options.text("investor").pipe(
  Options.withDescription("The name of the investment manager."),
  Options.withPseudoName("string"),
  Options.withDefault(undefined)
)

const ticker = Options.text("ticker").pipe(
  Options.withDescription("The ticker symbol."),
  Options.withPseudoName("string"),
  Options.withDefault(undefined)
)

const limit = Options.integer("limit").pipe(
  Options.withDescription("The maximum number of holdings to return (default: 10)."),
  Options.withPseudoName("integer"),
  Options.withDefault(10)
)

export const institutionalOwnershipCommand = Command.make(
  "institutional-ownership",
  { investor, ticker, limit },
  ({ investor, ticker, limit }) =>
    Effect.gen(function*() {
      const apiKey = yield* getApiKey()

      if (!investor && !ticker) {
        throw new Error("Either --investor or --ticker must be provided.")
      }

      if (investor && ticker) {
        throw new Error("Only one of --investor or --ticker can be provided.")
      }

      const response = yield* getInstitutionalOwnership(apiKey, { investor, ticker, limit })

      yield* Console.log(JSON.stringify(response))
    }).pipe(
      Effect.catchAll((error) =>
        Console.error(formatError(error)).pipe(Effect.andThen(Effect.fail(error)))
      )
    )
)
