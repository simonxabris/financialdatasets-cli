import { Command, Options } from "@effect/cli"
import { Console, Effect } from "effect"
import { getCompanyFacts } from "../api/company"
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
  Options.withPseudoName("string"),
  Options.withDefault(undefined)
)

const cik = Options.text("cik").pipe(
  Options.withDescription("The CIK of the company."),
  Options.withPseudoName("string"),
  Options.withDefault(undefined)
)

const facts = Command.make(
  "facts",
  { ticker, cik },
  ({ ticker, cik }: { ticker?: string; cik?: string }) =>
    Effect.gen(function*() {
      const apiKey = yield* Effect.sync(() => {
        const value = process.env.FINANCIAL_DATASETS_API_KEY

        if (!value) {
          throw new Error("Missing FINANCIAL_DATASETS_API_KEY in environment.")
        }

        return value
      })

      if (!ticker && !cik) {
        throw new Error("At least one of --ticker or --cik must be provided.")
      }

      const response = yield* getCompanyFacts(apiKey, { ticker, cik })

      yield* Console.log(JSON.stringify(response))
    }).pipe(
      Effect.catchAll((error) =>
        Console.error(formatError(error)).pipe(Effect.andThen(Effect.fail(error)))
      )
    )
)

export const companyCommand = Command.make("company", {}, () => Effect.succeed(undefined)).pipe(
  Command.withSubcommands([facts])
)
