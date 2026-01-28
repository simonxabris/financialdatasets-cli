import { buildQuery, requestJson } from "./client"

export type InsiderTradesParams = {
  readonly ticker: string
  readonly limit?: number
}

export const getInsiderTrades = (apiKey: string, params: InsiderTradesParams) =>
  requestJson("/insider-trades", {
    apiKey,
    query: buildQuery({
      ticker: params.ticker,
      limit: params.limit
    })
  })
