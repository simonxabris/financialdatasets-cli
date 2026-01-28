import { Command, Options } from "@effect/cli"
import { Console, Effect } from "effect"
import { getEarningsPressReleases } from "../api/earnings"
import { getApiKey } from "./shared"

const ticker = Options.text("ticker").pipe(
  Options.withDescription("The ticker symbol."),
  Options.withPseudoName("string")
)

const pressReleases = Command.make(
  "press-releases",
  { ticker },
  ({ ticker }) =>
    Effect.gen(function*() {
      const apiKey = yield* getApiKey()

      const response = yield* getEarningsPressReleases(apiKey, { ticker })

      yield* Console.log(JSON.stringify(response))
    })
)

export const earningsCommand = Command.make("earnings", {}, () => Effect.succeed(undefined)).pipe(
  Command.withSubcommands([pressReleases])
)
