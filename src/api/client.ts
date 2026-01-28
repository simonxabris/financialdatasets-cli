import { Effect } from "effect"

export type ApiError = {
  readonly _tag: "ApiError"
  readonly status: number
  readonly error?: string
  readonly message?: string
  readonly body?: unknown
}

export const baseUrl = "https://api.financialdatasets.ai"

export const isApiError = (value: unknown): value is ApiError =>
  typeof value === "object" &&
  value !== null &&
  "_tag" in value &&
  (value as { _tag?: string })._tag === "ApiError"

const toError = (error: unknown): Error | ApiError =>
  isApiError(error)
    ? error
    : error instanceof Error
      ? error
      : new Error(String(error))

const parseJson = (text: string): unknown => {
  if (text.trim().length === 0) {
    return undefined
  }

  return JSON.parse(text)
}

const makeApiError = (status: number, body: unknown): ApiError => {
  const record = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : undefined

  return {
    _tag: "ApiError",
    status,
    error: typeof record?.error === "string" ? record.error : undefined,
    message: typeof record?.message === "string" ? record.message : undefined,
    body
  }
}

export const requestJson = (path: string, options: { apiKey: string; query?: Record<string, string | number> }) =>
  Effect.tryPromise({
    try: async () => {
      const url = new URL(path, baseUrl)

      if (options.query) {
        for (const [key, value] of Object.entries(options.query)) {
          url.searchParams.set(key, String(value))
        }
      }

      const response = await fetch(url.toString(), {
        headers: {
          "X-API-KEY": options.apiKey
        }
      })

      const text = await response.text()
      const body = parseJson(text)

      if (!response.ok) {
        throw makeApiError(response.status, body)
      }

      return body
    },
    catch: toError
  })

export const buildQuery = (params: Record<string, string | number | undefined>) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  ) as Record<string, string | number>
