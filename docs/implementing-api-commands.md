# Implementing a New API Command (Financial Datasets CLI)

This guide walks you through adding a new command that maps 1:1 to a Financial Datasets REST API endpoint. It assumes you are working in this repo and have zero prior context. Follow each step in order.

## Goal

Create a CLI subcommand that:

- Maps directly to a single API endpoint (1:1 with the REST API).
- Uses `FINANCIAL_DATASETS_API_KEY` from the environment for auth.
- Validates required parameters with the same constraints as the API docs.
- Prints the raw JSON response to stdout.
- Surfaces API errors cleanly with non-zero exit.

## 1) Identify the endpoint details

From the API docs, capture:

- HTTP method and path (e.g., `GET /prices`).
- Required query params and types.
- Optional query params, default values, and min/max.
- Any enums (e.g., `interval` choices).
- Response shape (for reference only; we print raw JSON).

Keep a short checklist with the names of params you must expose as CLI options, using the same naming as the API query params.

## 2) Add an API client wrapper (if it doesn’t exist)

Use `src/api/client.ts` to make HTTP calls. This repo already has a minimal `requestJson` wrapper you should reuse.

- Base URL: `https://api.financialdatasets.ai`
- Auth header: `X-API-KEY`
- Errors: non-2xx should throw a structured `ApiError` so CLI can display it.

If your endpoint uses JSON in the request body (not typical for GET), extend the client wrapper as needed, but keep the 1:1 behavior.

## 3) Add endpoint-specific API function

Create or update a file in `src/api/` for your endpoint group.

Example (existing) for historical prices:

```ts
// src/api/prices.ts
export const getHistoricalPrices = (apiKey: string, params: HistoricalPricesParams) =>
  requestJson("/prices", {
    apiKey,
    query: {
      ticker: params.ticker,
      interval: params.interval,
      interval_multiplier: params.intervalMultiplier,
      start_date: params.startDate,
      end_date: params.endDate,
      limit: params.limit
    }
  })
```

Guidelines:

- Function name should describe the endpoint (e.g., `getCompanyFacts`).
- Keep a typed `Params` object with the same required/optional fields.
- Convert CLI-friendly naming (kebab or camel) to API query param names here.

## 4) Create the CLI command

Commands live in `src/commands/`.

You’ll define:

- A top-level group command if needed (e.g., `prices`).
- A specific command for the endpoint (e.g., `historical`).
- Options for all required/optional query params.

Use `@effect/cli` `Options` to declare parameters and validation.

### Required pattern

```ts
import { Command, Options } from "@effect/cli"
import { Console, Effect } from "effect"
import { getHistoricalPrices } from "../api/prices"
import { isApiError } from "../api/client"

// validation helpers here

const historical = Command.make(
  "historical",
  { ticker, interval, intervalMultiplier, startDate, endDate, limit },
  ({ ticker, interval, intervalMultiplier, startDate, endDate, limit }) =>
    Effect.gen(function*() {
      const apiKey = yield* Effect.sync(() => {
        const value = process.env.FINANCIAL_DATASETS_API_KEY
        if (!value) {
          throw new Error("Missing FINANCIAL_DATASETS_API_KEY in environment.")
        }
        return value
      })

      const response = yield* getHistoricalPrices(apiKey, {
        ticker,
        interval,
        intervalMultiplier,
        startDate,
        endDate,
        limit
      })

      yield* Console.log(JSON.stringify(response))
    }).pipe(
      Effect.catchAll((error) =>
        Console.error(formatError(error)).pipe(Effect.andThen(Effect.fail(error)))
      )
    )
)
```

### Validation guidance

- Use `Options.choice` for enums.
- Use `Options.integer` + `Options.filterMap` for min/max checks.
- For date strings, validate `YYYY-MM-DD` using a regex.
- Use `Options.withDefault` for documented defaults (e.g., `limit`).

Example validators:

```ts
const datePattern = /^\d{4}-\d{2}-\d{2}$/
const ensureDate = (value: string) =>
  datePattern.test(value) ? Option.some(value) : Option.none()

const ensureRange = (value: number, min: number, max: number) =>
  value >= min && value <= max ? Option.some(value) : Option.none()
```

### Error formatting

Use the shared `ApiError` shape from `src/api/client.ts`:

```ts
const formatError = (error: unknown): string => {
  if (isApiError(error)) {
    const parts = [`Request failed (${error.status})`]
    if (error.error) parts.push(error.error)
    if (error.message) parts.push(error.message)
    return parts.join(": ")
  }
  return error instanceof Error ? error.message : String(error)
}
```

## 5) Wire the command into the root CLI

Open `index.ts` and attach your new command as a subcommand.

Example:

```ts
import { pricesCommand } from "./src/commands/prices"

const command = Command.make("financialdatasets", {}, () => Effect.succeed(undefined)).pipe(
  Command.withSubcommands([pricesCommand])
)
```

If you’re adding a new top-level group (e.g., `news`), include it in the array.

## 6) Run the command locally

Use Bun to execute:

```sh
FINANCIAL_DATASETS_API_KEY=... bun run index.ts prices historical \
  --ticker AAPL \
  --interval day \
  --interval-multiplier 5 \
  --start-date 2025-01-02 \
  --end-date 2025-01-05
```

Expected behavior:

- The CLI prints raw JSON to stdout.
- Missing or invalid params are rejected before the API call.
- API errors are printed to stderr with HTTP status and message.

## 7) Optional: add a test

If you add tests, use `bun test`.

Suggested tests:

- Date validation rejects invalid format.
- Limit validation enforces 1–5000.
- Enum options reject invalid values.

Avoid integration tests unless you mock the API or guard them with an env flag.

## Checklist for a new endpoint command

- [ ] Documented parameters mapped 1:1 to CLI options.
- [ ] Required parameters enforced.
- [ ] Enums validated via `Options.choice`.
- [ ] Min/max validated via `Options.filterMap`.
- [ ] Uses `FINANCIAL_DATASETS_API_KEY` only (no CLI flag).
- [ ] Raw JSON output to stdout.
- [ ] Proper error formatting for API responses.
- [ ] Command wired into `index.ts`.

## Notes

- Keep naming consistent with the REST API docs.
- Do not add extra behavior like pagination or retries unless the API docs say so.
- Output should remain a 1:1 representation of the API response.
