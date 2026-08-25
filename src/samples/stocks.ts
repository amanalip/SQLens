import { SampleQuery } from './types';

export const stocksSamples: SampleQuery[] = [
  {
    "id": "stocks-1",
    "name": "Sector Market Valuation",
    "description": "Calculates total market capitalization and average dividend yield by sector.",
    "sql": "SELECT\n    sector,\n    COUNT(company_id) AS company_count,\n    ROUND(SUM(market_cap_billions), 2) AS total_market_cap_billions,\n    ROUND(AVG(dividend_yield_pct), 2) AS avg_dividend_yield\nFROM companies\nGROUP BY sector\nORDER BY total_market_cap_billions DESC;"
  },
  {
    "id": "stocks-2",
    "name": "Portfolio Holdings and Valuations",
    "description": "Calculates total investment value and shares owned per investor portfolio.",
    "sql": "SELECT\n    p.portfolio_name,\n    p.investor_name,\n    t.ticker,\n    c.company_name,\n    h.shares_owned,\n    h.average_buy_price,\n    ROUND(h.shares_owned * h.average_buy_price, 2) AS total_invested\nFROM portfolios p\nINNER JOIN holdings h ON p.portfolio_id = h.portfolio_id\nINNER JOIN tickers t ON h.ticker_id = t.ticker_id\nINNER JOIN companies c ON t.company_id = c.company_id\nORDER BY total_invested DESC;"
  },
  {
    "id": "stocks-3",
    "name": "High Volume Trading Days",
    "description": "Finds daily trading sessions where volume exceeded historical average.",
    "sql": "SELECT\n    dp.trade_date,\n    t.ticker,\n    dp.close_price,\n    dp.volume\nFROM daily_prices dp\nINNER JOIN tickers t ON dp.ticker_id = t.ticker_id\nWHERE dp.volume > (SELECT AVG(volume) FROM daily_prices)\nORDER BY dp.volume DESC\nLIMIT 20;"
  },
  {
    "id": "stocks-4",
    "name": "Company Capitalization Tiers CTE",
    "description": "Classifies equities by market valuation brackets.",
    "sql": "WITH market_tiers AS (\n    SELECT\n        company_name,\n        sector,\n        market_cap_billions,\n        CASE\n            WHEN market_cap_billions >= 500 THEN 'Mega Cap (>500B)'\n            WHEN market_cap_billions >= 100 THEN 'Large Cap (100-500B)'\n            ELSE 'Mid Cap (<100B)'\n        END AS cap_tier\n    FROM companies\n)\nSELECT\n    cap_tier,\n    COUNT(*) AS total_companies,\n    ROUND(AVG(market_cap_billions), 1) AS avg_cap_billions\nFROM market_tiers\nGROUP BY cap_tier\nORDER BY avg_cap_billions DESC;"
  },
  {
    "id": "stocks-5",
    "name": "Close Price Rank by Ticker",
    "description": "Ranks historical daily closing prices for each ticker.",
    "sql": "SELECT\n    ticker_id,\n    trade_date,\n    close_price,\n    RANK() OVER (PARTITION BY ticker_id ORDER BY close_price DESC) AS price_rank\nFROM daily_prices\nLIMIT 30;"
  },
  {
    "id": "stocks-6",
    "name": "Exchange Listing Distribution",
    "description": "Summarizes ticker counts across financial exchanges.",
    "sql": "SELECT\n    exchange,\n    COUNT(ticker_id) AS listed_tickers\nFROM tickers\nGROUP BY exchange;"
  },
  {
    "id": "stocks-7",
    "name": "Cumulative Daily Trading Volume",
    "description": "Calculates running trading volume per ticker across historical dates.",
    "sql": "SELECT\n    ticker_id,\n    trade_date,\n    volume,\n    SUM(volume) OVER (PARTITION BY ticker_id ORDER BY trade_date) AS cumulative_volume\nFROM daily_prices\nLIMIT 25;"
  },
  {
    "id": "stocks-8",
    "name": "Insert New Company (Add Data)",
    "description": "Adds a newly listed public company.",
    "sql": "INSERT INTO companies (company_id, company_name, sector, market_cap_billions, dividend_yield_pct)\nVALUES (9901, 'Quantum BioHealth', 'Healthcare', 45.8, 1.85);"
  },
  {
    "id": "stocks-9",
    "name": "Update Dividend Yield (Modify Data)",
    "description": "Adjusts dividend yield percentages for Energy sector.",
    "sql": "UPDATE companies\nSET dividend_yield_pct = 4.25\nWHERE sector = 'Energy';"
  },
  {
    "id": "stocks-10",
    "name": "Delete Test Company (Remove Data)",
    "description": "Removes the test company record.",
    "sql": "DELETE FROM companies\nWHERE company_id = 9901;"
  }
];
