import { requestJson } from "./client"

export type EarningsPressReleasesParams = {
  readonly ticker: string
}

export const getEarningsPressReleases = (apiKey: string, params: EarningsPressReleasesParams) =>
  requestJson("/earnings/press-releases", {
    apiKey,
    query: {
      ticker: params.ticker
    }
  })
