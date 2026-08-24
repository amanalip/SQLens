import { SampleQuery } from './chinook';

export const stocksSamples: SampleQuery[] = [
  {
    id: 'stk-1',
    name: 'Stock Daily Price Movement and Volume',
    description: 'Retrieves stock price quotes with daily percentage gain/loss and trading volumes.',
    sql: `SELECT
    t.ticker,
    c.company_name,
    c.sector,
    dp.trade_date,
    dp.open_price,
    dp.close_price,
    ROUND(((dp.close_price - dp.open_price) / dp.open_price) * 100.0, 2) AS pct_change,
    dp.volume
FROM daily_prices dp
INNER JOIN tickers t ON dp.ticker_id = t.ticker_id
INNER JOIN companies c ON t.company_id = c.company_id
ORDER BY dp.trade_date DESC, dp.volume DESC;`,
  },
  {
    id: 'stk-2',
    name: 'Sector Market Capitalization and Dividend Yield',
    description: 'Aggregates sector valuation and average dividend yields.',
    sql: `SELECT
    c.sector,
    COUNT(t.ticker_id) AS stock_count,
    ROUND(SUM(c.market_cap_billions), 2) AS total_market_cap_b,
    ROUND(AVG(c.dividend_yield_pct), 2) AS avg_dividend_yield
FROM companies c
INNER JOIN tickers t ON c.company_id = t.company_id
GROUP BY c.sector
ORDER BY total_market_cap_b DESC;`,
  },
  {
    id: 'stk-3',
    name: 'Investor Portfolio Current Value CTE',
    description: 'Calculates portfolio valuations and unrealized gains across investor holdings.',
    sql: `WITH latest_prices AS (
    SELECT
        ticker_id,
        close_price AS current_price
    FROM daily_prices
    WHERE trade_date = '2024-05-10'
)
SELECT
    p.portfolio_name,
    t.ticker,
    h.shares_owned,
    h.average_buy_price,
    lp.current_price,
    ROUND(h.shares_owned * lp.current_price, 2) AS market_value,
    ROUND((lp.current_price - h.average_buy_price) * h.shares_owned, 2) AS unrealized_gain
FROM holdings h
INNER JOIN portfolios p ON h.portfolio_id = p.portfolio_id
INNER JOIN tickers t ON h.ticker_id = t.ticker_id
INNER JOIN latest_prices lp ON t.ticker_id = lp.ticker_id
ORDER BY market_value DESC;`,
  },
];
