import { SampleQuery } from './chinook';

export const cryptoSamples: SampleQuery[] = [
  {
    id: 'cry-1',
    name: 'Top Digital Assets by Market Capitalization',
    description: 'Lists cryptocurrency tokens with current prices, supply, and 24h trading volumes.',
    sql: `SELECT
    t.symbol,
    t.name AS token_name,
    t.consensus_type,
    t.current_price_usd,
    t.circulating_supply,
    ROUND(t.current_price_usd * t.circulating_supply, 0) AS market_cap_usd,
    t.volume_24h_usd
FROM tokens t
ORDER BY market_cap_usd DESC;`,
  },
  {
    id: 'cry-2',
    name: 'Wallet Account Token Balances and Total Value',
    description: 'Calculates wallet balances converted to current USD market values.',
    sql: `SELECT
    w.wallet_address,
    w.label AS wallet_label,
    t.symbol,
    b.balance_amount,
    ROUND(b.balance_amount * t.current_price_usd, 2) AS value_usd
FROM balances b
INNER JOIN wallets w ON b.wallet_id = w.wallet_id
INNER JOIN tokens t ON b.token_id = t.token_id
ORDER BY value_usd DESC;`,
  },
  {
    id: 'cry-3',
    name: 'Transaction Volume and Gas Fee Metrics CTE',
    description: 'Computes daily blockchain transfer volume and network transaction fees.',
    sql: `WITH daily_tx_metrics AS (
    SELECT
        token_id,
        COUNT(tx_id) AS transfer_count,
        SUM(amount) AS gross_tokens_transferred,
        ROUND(SUM(gas_fee_usd), 2) AS total_network_fees
    FROM transactions
    WHERE status = 'confirmed'
    GROUP BY token_id
)
SELECT
    t.symbol,
    t.name AS token_name,
    dtm.transfer_count,
    dtm.gross_tokens_transferred,
    dtm.total_network_fees
FROM daily_tx_metrics dtm
INNER JOIN tokens t ON dtm.token_id = t.token_id
ORDER BY dtm.transfer_count DESC;`,
  },
];
