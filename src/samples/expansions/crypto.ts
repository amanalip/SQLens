import { SampleQuery } from '../types';
import { sample, profileSamples } from './helpers';

export const cryptoExpansion: SampleQuery[] = [
  sample('crypto-11', 'Net Wallet Fund Flows', 'Calculates token inflows and outflows for each wallet.', `WITH flows AS (
    SELECT to_wallet_id AS wallet_id, token_id, amount AS signed_amount FROM transactions WHERE status = 'confirmed'
    UNION ALL
    SELECT from_wallet_id, token_id, -amount FROM transactions WHERE status = 'confirmed'
)
SELECT w.label, t.symbol, ROUND(SUM(f.signed_amount), 6) AS net_flow
FROM flows f JOIN wallets w ON f.wallet_id = w.wallet_id
JOIN tokens t ON f.token_id = t.token_id
GROUP BY f.wallet_id, w.label, f.token_id, t.symbol
ORDER BY ABS(net_flow) DESC;`),
    sample('crypto-12', 'Token Holder Concentration', 'Measures the largest wallet share of each token recorded balance.', `WITH token_balances AS (
    SELECT token_id, SUM(balance_amount) AS total_balance, MAX(balance_amount) AS largest_balance
    FROM balances GROUP BY token_id
)
SELECT t.symbol, ROUND(tb.total_balance, 6) AS total_balance,
       ROUND(100.0 * tb.largest_balance / NULLIF(tb.total_balance, 0), 2) AS largest_holder_pct
FROM token_balances tb JOIN tokens t ON tb.token_id = t.token_id
ORDER BY largest_holder_pct DESC;`),
    sample('crypto-13', 'Transaction Failure Rates', 'Compares confirmed and failed transaction counts for each token.', `SELECT t.symbol, COUNT(*) AS transactions,
       SUM(CASE WHEN tx.status = 'failed' THEN 1 ELSE 0 END) AS failed,
       ROUND(100.0 * SUM(CASE WHEN tx.status = 'failed' THEN 1 ELSE 0 END) / COUNT(*), 1) AS failure_rate_pct
FROM tokens t JOIN transactions tx ON t.token_id = tx.token_id
GROUP BY t.token_id, t.symbol
ORDER BY failure_rate_pct DESC;`),
    ...profileSamples({ key: 'crypto', table: 'tokens', subject: 'tokens', value: 'volume_24h_usd', valueLabel: 'Trading Volumes', category: 'consensus_type', categoryLabel: 'Consensus Type', id: 'token_id' })
];
