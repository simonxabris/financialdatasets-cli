import { requestJson } from "./client"

export type HistoricalPricesParams = {
  readonly ticker: string
  readonly interval: "day" | "week" | "month" | "year"
  readonly intervalMultiplier: number
  readonly startDate: string
  readonly endDate: string
  readonly limit: number
}

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
