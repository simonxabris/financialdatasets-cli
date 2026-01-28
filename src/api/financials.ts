import { buildQuery, requestJson } from "./client"

export type FinancialsParams = {
  readonly ticker: string
  readonly period: "annual" | "quarterly" | "ttm"
  readonly limit?: number
  readonly cik?: string
}

export const getFinancials = (apiKey: string, params: FinancialsParams) =>
  requestJson("/financials", {
    apiKey,
    query: buildQuery({
      ticker: params.ticker,
      period: params.period,
      limit: params.limit,
      cik: params.cik
    })
  })

export const getIncomeStatements = (apiKey: string, params: FinancialsParams) =>
  requestJson("/financials/income-statements", {
    apiKey,
    query: buildQuery({
      ticker: params.ticker,
      period: params.period,
      limit: params.limit,
      cik: params.cik
    })
  })

export const getBalanceSheets = (apiKey: string, params: FinancialsParams) =>
  requestJson("/financials/balance-sheets", {
    apiKey,
    query: buildQuery({
      ticker: params.ticker,
      period: params.period,
      limit: params.limit,
      cik: params.cik
    })
  })

export const getCashFlowStatements = (apiKey: string, params: FinancialsParams) =>
  requestJson("/financials/cash-flow-statements", {
    apiKey,
    query: buildQuery({
      ticker: params.ticker,
      period: params.period,
      limit: params.limit,
      cik: params.cik
    })
  })
