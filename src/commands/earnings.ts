import { Command, Options } from "@effect/cli"
import { Console, Effect } from "effect"
import { getEarningsPressReleases } from "../api/earnings"
import { isApiError } from "../api/client"

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

const pressReleases = Command.make(
  "press-releases",
  { ticker },
  ({ ticker }) =>
    Effect.gen(function*() {
      const apiKey = yield* Effect.sync(() => {
        const value = process.env.FINANCIAL_DATASETS_API_KEY

        if (!value) {
          throw new Error("Missing FINANCIAL_DATASETS_API_KEY in environment.")
        }

        return value
      })

      const response = yield* getEarningsPressReleases(apiKey, { ticker })

      yield* Console.log(JSON.stringify(response))
    }).pipe(
      Effect.catchAll((error) =>
        Console.error(formatError(error)).pipe(Effect.andThen(Effect.fail(error)))
      )
    )
)

export const earningsCommand = Command.make("earnings", {}, () => Effect.succeed(undefined)).pipe(
  Command.withSubcommands([pressReleases])
)
