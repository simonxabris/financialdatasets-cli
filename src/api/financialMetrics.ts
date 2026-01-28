import { buildQuery, requestJson } from "./client"

export type FinancialMetricsParams = {
  readonly ticker: string
  readonly period: "annual" | "quarterly" | "ttm"
  readonly limit?: number
}

export type FinancialMetricsSnapshotParams = {
  readonly ticker: string
}

export const getFinancialMetrics = (apiKey: string, params: FinancialMetricsParams) =>
  requestJson("/financial-metrics", {
    apiKey,
    query: buildQuery({
      ticker: params.ticker,
      period: params.period,
      limit: params.limit
    })
  })

export const getFinancialMetricsSnapshot = (
  apiKey: string,
  params: FinancialMetricsSnapshotParams
) =>
  requestJson("/financial-metrics/snapshot", {
    apiKey,
    query: {
      ticker: params.ticker
    }
  })
