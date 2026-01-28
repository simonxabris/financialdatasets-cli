import { buildQuery, requestJson } from "./client"

export type InstitutionalOwnershipParams = {
  readonly investor?: string
  readonly ticker?: string
  readonly limit?: number
}

export const getInstitutionalOwnership = (apiKey: string, params: InstitutionalOwnershipParams) =>
  requestJson("/institutional-ownership", {
    apiKey,
    query: buildQuery({
      investor: params.investor,
      ticker: params.ticker,
      limit: params.limit
    })
  })
