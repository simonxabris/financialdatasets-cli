import { buildQuery, requestJson } from "./client"

export type FilingsParams = {
  readonly cik?: string
  readonly ticker?: string
  readonly filingType?: "10-K" | "10-Q" | "8-K" | "4" | "144"
}

export type FilingItemsParams = {
  readonly ticker: string
  readonly filingType: "10-K" | "10-Q"
  readonly year: number
  readonly quarter?: number
  readonly item?:
    | "Item-1"
    | "Item-1A"
    | "Item-1B"
    | "Item-2"
    | "Item-3"
    | "Item-4"
    | "Item-5"
    | "Item-6"
    | "Item-7"
    | "Item-7A"
    | "Item-8"
    | "Item-9"
    | "Item-9A"
    | "Item-9B"
    | "Item-10"
    | "Item-11"
    | "Item-12"
    | "Item-13"
    | "Item-14"
    | "Item-15"
    | "Item-16"
}

export const getFilings = (apiKey: string, params: FilingsParams) =>
  requestJson("/filings", {
    apiKey,
    query: buildQuery({
      cik: params.cik,
      ticker: params.ticker,
      filing_type: params.filingType
    })
  })

export const getFilingItems = (apiKey: string, params: FilingItemsParams) =>
  requestJson("/filings/items", {
    apiKey,
    query: buildQuery({
      ticker: params.ticker,
      filing_type: params.filingType,
      year: params.year,
      quarter: params.quarter,
      item: params.item
    })
  })
