import { buildQuery, requestJson } from "./client"

export type NewsParams = {
  readonly ticker: string
  readonly startDate?: string
  readonly endDate?: string
  readonly limit?: number
}

export const getNews = (apiKey: string, params: NewsParams) =>
  requestJson("/news", {
    apiKey,
    query: buildQuery({
      ticker: params.ticker,
      start_date: params.startDate,
      end_date: params.endDate,
      limit: params.limit
    })
  })
