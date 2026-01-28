import { requestJson } from "./client"

export type CryptoHistoricalPricesParams = {
  readonly ticker: string
  readonly interval: "day" | "week" | "month" | "year"
  readonly intervalMultiplier: number
  readonly startDate: string
  readonly endDate: string
  readonly limit: number
}

export type CryptoPriceSnapshotParams = {
  readonly ticker: string
}

export const getCryptoHistoricalPrices = (apiKey: string, params: CryptoHistoricalPricesParams) =>
  requestJson("/crypto/prices", {
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

export const getCryptoPriceSnapshot = (apiKey: string, params: CryptoPriceSnapshotParams) =>
  requestJson("/crypto/prices/snapshot", {
    apiKey,
    query: {
      ticker: params.ticker
    }
  })
