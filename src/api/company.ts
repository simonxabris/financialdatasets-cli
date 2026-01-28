import { buildQuery, requestJson } from "./client"

export type CompanyFactsParams = {
  readonly ticker?: string
  readonly cik?: string
}

export const getCompanyFacts = (apiKey: string, params: CompanyFactsParams) =>
  requestJson("/company/facts", {
    apiKey,
    query: buildQuery({
      ticker: params.ticker,
      cik: params.cik
    })
  })
