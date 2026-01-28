import { requestJson } from "./client"

export type CompanyFactsParams = {
  readonly ticker?: string
  readonly cik?: string
}

export const getCompanyFacts = (apiKey: string, params: CompanyFactsParams) =>
  requestJson("/company/facts", {
    apiKey,
    query: Object.fromEntries(
      Object.entries({
        ticker: params.ticker,
        cik: params.cik
      }).filter(([, value]) => value !== undefined)
    ) as Record<string, string | number>
  })
