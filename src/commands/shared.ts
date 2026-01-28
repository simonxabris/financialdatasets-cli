import { CliConfig, Command, HelpDoc } from "@effect/cli"
import { Console, Effect, Option } from "effect"
import { isApiError } from "../api/client"

const datePattern = /^\d{4}-\d{2}-\d{2}$/

export const ensureDate = (value: string) =>
  datePattern.test(value)
    ? Option.some(value)
    : Option.none()

export const ensureMin = (value: number, min: number) =>
  value >= min ? Option.some(value) : Option.none()

export const ensureRange = (value: number, min: number, max: number) =>
  value >= min && value <= max ? Option.some(value) : Option.none()

export const formatError = (error: unknown): string => {
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

export const getApiKey = () =>
  Effect.try({
    try: () => {
      const value = process.env.FINANCIAL_DATASETS_API_KEY

      if (!value) {
        throw new Error("Missing FINANCIAL_DATASETS_API_KEY in environment.")
      }

      return value
    },
    catch: (error) => (error instanceof Error ? error : new Error(String(error)))
  })

export const printSubcommandHelp = <Name extends string, R, E, A>(
  command: Command.Command<Name, R, E, A>
) =>
  Effect.gen(function*() {
    yield* Console.log("Please use one of the available subcommands:")
    const help = Command.getHelp(command, CliConfig.defaultConfig)
    yield* Console.log(HelpDoc.toAnsiText(help).trimEnd())
  })
