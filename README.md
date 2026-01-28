# @simonxabris/financialdatasets-cli

A command-line interface for the [Financial Datasets API](https://financialdatasets.ai). Query stock prices, crypto data, financial statements, earnings reports, news, SEC filings, insider trades, and more.

## Installation

```bash
# npm
npm install -g @simonxabris/financialdatasets-cli

# pnpm
pnpm add -g @simonxabris/financialdatasets-cli

# bun
bun add -g @simonxabris/financialdatasets-cli
```

## Setup

Get an API key at [financialdatasets.ai](https://financialdatasets.ai).

Make sure it's available in the environment as `FINANCIAL_DATASETS_API_KEY`

## Usage

```bash
financialdatasets <command> [options]
```

## Commands

### Prices
```bash
# Historical stock prices
financialdatasets prices historical --ticker AAPL --start-date 2024-01-01 --end-date 2024-01-31

# Latest price snapshot
financialdatasets prices snapshot --ticker AAPL
```

### Crypto
```bash
# Historical crypto prices
financialdatasets crypto historical --ticker BTC-USD --start-date 2024-01-01 --end-date 2024-01-31

# Latest crypto snapshot
financialdatasets crypto snapshot --ticker BTC-USD
```

### Company
```bash
# Company facts and information
financialdatasets company facts --ticker AAPL
```

### Earnings
```bash
# Earnings press releases
financialdatasets earnings press-releases --ticker AAPL
```

### Financials
```bash
# All financial statements
financialdatasets financials all --ticker AAPL --period annual --limit 5

# Income statements only
financialdatasets financials income-statements --ticker AAPL --period annual --limit 5

# Balance sheets
financialdatasets financials balance-sheets --ticker AAPL --period quarterly

# Cash flow statements
financialdatasets financials cash-flow-statements --ticker AAPL --period ttm
```

### News
```bash
# Company news
financialdatasets news --ticker AAPL --limit 20
```

### SEC Filings
```bash
# List filings
financialdatasets filings list --ticker AAPL --filing-type 10-K

# Get specific filing items
financialdatasets filings items --ticker AAPL --filing-type 10-K --year 2024 --item Item-1
```

### Insider Trades
```bash
financialdatasets insider-trades --ticker AAPL --limit 50
```

### Institutional Ownership
```bash
financialdatasets institutional-ownership --ticker AAPL --limit 20
```

### Financial Metrics
```bash
# Historical metrics
financialdatasets financial-metrics historical --ticker AAPL --period annual --limit 5

# Latest metrics snapshot
financialdatasets financial-metrics snapshot --ticker AAPL
```

## Help

Get help for any command:

```bash
financialdatasets --help
financialdatasets prices --help
financialdatasets prices historical --help
```

## Output

All commands return raw JSON responses from the API.

## Requirements

- Node.js >= 18.0.0
- FINANCIAL_DATASETS_API_KEY environment variable

## Links

- [GitHub](https://github.com/simonxabris/financialdatasets-cli)
- [Issues](https://github.com/simonxabris/financialdatasets-cli/issues)
- [API Documentation](https://financialdatasets.ai)
