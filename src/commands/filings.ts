import { Command, Options } from "@effect/cli"
import { Console, Effect } from "effect"
import { getFilingItems, getFilings } from "../api/filings"
import { getApiKey, printSubcommandHelp } from "./shared"

const cik = Options.text("cik").pipe(
  Options.withDescription("The Central Index Key (CIK) of the company."),
  Options.withPseudoName("string"),
  Options.withDefault(undefined)
)

const ticker = Options.text("ticker").pipe(
  Options.withDescription("The ticker symbol."),
  Options.withPseudoName("string"),
  Options.withDefault(undefined)
)

const filingType = Options.choice("filing-type", ["10-K", "10-Q", "8-K", "4", "144"] as const).pipe(
  Options.withDescription("The type of filing."),
  Options.withPseudoName("10-K|10-Q|8-K|4|144"),
  Options.withDefault(undefined)
)

const itemsTicker = Options.text("ticker").pipe(
  Options.withDescription("The ticker symbol."),
  Options.withPseudoName("string")
)

const itemsFilingType = Options.choice("filing-type", ["10-K", "10-Q"] as const).pipe(
  Options.withDescription("The type of filing."),
  Options.withPseudoName("10-K|10-Q")
)

const year = Options.integer("year").pipe(
  Options.withDescription("The year of the filing."),
  Options.withPseudoName("integer")
)

const quarter = Options.integer("quarter").pipe(
  Options.withDescription("The quarter of the filing if 10-Q."),
  Options.withPseudoName("integer"),
  Options.withDefault(undefined)
)

const filingItems = [
  "Item-1",
  "Item-1A",
  "Item-1B",
  "Item-2",
  "Item-3",
  "Item-4",
  "Item-5",
  "Item-6",
  "Item-7",
  "Item-7A",
  "Item-8",
  "Item-9",
  "Item-9A",
  "Item-9B",
  "Item-10",
  "Item-11",
  "Item-12",
  "Item-13",
  "Item-14",
  "Item-15",
  "Item-16"
] as const

const item = Options.choice("item", filingItems).pipe(
  Options.withDescription("The item to get."),
  Options.withPseudoName(filingItems.join("|")),
  Options.withDefault(undefined)
)

const list = Command.make(
  "list",
  { cik, ticker, filingType },
  ({ cik, ticker, filingType }) =>
    Effect.gen(function*() {
      const apiKey = yield* getApiKey()

      const response = yield* getFilings(apiKey, { cik, ticker, filingType })

      yield* Console.log(JSON.stringify(response))
    })
)

const items = Command.make(
  "items",
  { ticker: itemsTicker, filingType: itemsFilingType, year, quarter, item },
  ({ ticker: tickerValue, filingType: filingTypeValue, year, quarter, item: itemValue }) =>
    Effect.gen(function*() {
      const apiKey = yield* getApiKey()

      const response = yield* getFilingItems(apiKey, {
        ticker: tickerValue,
        filingType: filingTypeValue,
        year,
        quarter,
        item: itemValue
      })

      yield* Console.log(JSON.stringify(response))
    })
)

const filingsBase = Command.make("filings", {}, () => Effect.succeed(undefined))
const filingsWithSubcommands = filingsBase.pipe(Command.withSubcommands([list, items]))

export const filingsCommand = filingsWithSubcommands.pipe(
  Command.withHandler(() => printSubcommandHelp(filingsWithSubcommands))
)
