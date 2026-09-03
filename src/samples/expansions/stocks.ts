import { SampleQuery } from '../types';
import { sample, profileSamples } from './helpers';

export const stocksExpansion: SampleQuery[] = [
  sample('stocks-11', 'Largest Daily Trading Ranges', 'Finds sessions with the widest gap between intraday high and low prices.', `SELECT t.ticker, dp.trade_date, dp.low_price, dp.high_price,
       ROUND((dp.high_price - dp.low_price) * 100.0 / dp.open_price, 2) AS range_pct,
       dp.volume
FROM daily_prices dp JOIN tickers t ON dp.ticker_id = t.ticker_id
WHERE dp.open_price > 0
ORDER BY range_pct DESC
LIMIT 25;`),
    sample('stocks-12', 'Portfolio Concentration', 'Calculates each holding share of its portfolio current market value.', `WITH latest_prices AS (
    SELECT ticker_id, close_price,
           ROW_NUMBER() OVER (PARTITION BY ticker_id ORDER BY trade_date DESC) AS recency
    FROM daily_prices
), valued AS (
    SELECT h.portfolio_id, h.ticker_id, h.shares_owned * lp.close_price AS market_value
    FROM holdings h JOIN latest_prices lp ON h.ticker_id = lp.ticker_id AND lp.recency = 1
)
SELECT p.portfolio_name, t.ticker, ROUND(v.market_value, 2) AS market_value,
       ROUND(100.0 * v.market_value / SUM(v.market_value) OVER (PARTITION BY v.portfolio_id), 1) AS portfolio_pct
FROM valued v JOIN portfolios p ON v.portfolio_id = p.portfolio_id
JOIN tickers t ON v.ticker_id = t.ticker_id
ORDER BY p.portfolio_name, portfolio_pct DESC;`),
    sample('stocks-13', 'Sector Income Profile', 'Summarizes market value and dividend yield across company sectors.', `SELECT sector, COUNT(*) AS companies,
       ROUND(SUM(market_cap_billions), 2) AS market_cap_billions,
       ROUND(AVG(dividend_yield_pct), 2) AS avg_dividend_yield
FROM companies
GROUP BY sector
ORDER BY market_cap_billions DESC;`),
    ...profileSamples({ key: 'stocks', table: 'daily_prices', subject: 'daily prices', value: 'close_price', valueLabel: 'Closing Prices', category: 'ticker_id', categoryLabel: 'Ticker', id: 'price_id' })
];
