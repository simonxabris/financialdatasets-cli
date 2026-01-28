import { Command, Options } from "@effect/cli"
import { Console, Effect } from "effect"
import { getEarningsPressReleases } from "../api/earnings"
import { getApiKey, printSubcommandHelp } from "./shared"

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

const earningsBase = Command.make("earnings", {}, () => Effect.succeed(undefined))
const earningsWithSubcommands = earningsBase.pipe(Command.withSubcommands([pressReleases]))

export const earningsCommand = earningsWithSubcommands.pipe(
  Command.withHandler(() => printSubcommandHelp(earningsWithSubcommands))
)
