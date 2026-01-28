import { Command, Options } from "@effect/cli"
import { Console, Effect } from "effect"
import { getCompanyFacts } from "../api/company"
import { getApiKey, printSubcommandHelp } from "./shared"

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
      const apiKey = yield* getApiKey()

      if (!ticker && !cik) {
        throw new Error("At least one of --ticker or --cik must be provided.")
      }

      const response = yield* getCompanyFacts(apiKey, { ticker, cik })

      yield* Console.log(JSON.stringify(response))
    })
)

const companyBase = Command.make("company", {}, () => Effect.succeed(undefined))
const companyWithSubcommands = companyBase.pipe(Command.withSubcommands([facts]))

export const companyCommand = companyWithSubcommands.pipe(
  Command.withHandler(() => printSubcommandHelp(companyWithSubcommands))
)
