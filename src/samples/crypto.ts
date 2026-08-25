import { SampleQuery } from './types';

export const cryptoSamples: SampleQuery[] = [
  {
    "id": "crypto-1",
    "name": "Token Market Cap & 24h Volume",
    "description": "Calculates total market capitalization and trading volume by token.",
    "sql": "SELECT\n    symbol,\n    name,\n    consensus_type,\n    current_price_usd,\n    volume_24h_usd,\n    ROUND(current_price_usd * circulating_supply, 2) AS estimated_market_cap_usd\nFROM tokens\nORDER BY estimated_market_cap_usd DESC;"
  },
  {
    "id": "crypto-2",
    "name": "Wallet Portfolio Holdings & USD Values",
    "description": "Calculates token balances and aggregate USD valuations per wallet address.",
    "sql": "SELECT\n    w.wallet_address,\n    w.label,\n    t.symbol,\n    b.balance_amount,\n    t.current_price_usd,\n    ROUND(b.balance_amount * t.current_price_usd, 2) AS balance_usd_value\nFROM wallets w\nINNER JOIN balances b ON w.wallet_id = b.wallet_id\nINNER JOIN tokens t ON b.token_id = t.token_id\nORDER BY balance_usd_value DESC\nLIMIT 15;"
  },
  {
    "id": "crypto-3",
    "name": "High Value Whale Transactions",
    "description": "Finds transfers with transaction amounts exceeding average network size.",
    "sql": "SELECT\n    tx.tx_hash,\n    t.symbol,\n    tx.amount,\n    tx.gas_fee_usd,\n    tx.status,\n    tx.timestamp\nFROM transactions tx\nINNER JOIN tokens t ON tx.token_id = t.token_id\nWHERE tx.amount > (SELECT AVG(amount) FROM transactions)\nORDER BY tx.amount DESC\nLIMIT 20;"
  },
  {
    "id": "crypto-4",
    "name": "Consensus Mechanism Stats CTE",
    "description": "Aggregates token valuations by consensus algorithm.",
    "sql": "WITH consensus_summary AS (\n    SELECT\n        consensus_type,\n        COUNT(token_id) AS token_count,\n        SUM(volume_24h_usd) AS total_24h_volume,\n        AVG(current_price_usd) AS avg_token_price\n    FROM tokens\n    GROUP BY consensus_type\n)\nSELECT\n    consensus_type,\n    token_count,\n    ROUND(total_24h_volume, 2) AS total_24h_volume,\n    ROUND(avg_token_price, 2) AS avg_token_price\nFROM consensus_summary\nORDER BY total_24h_volume DESC;"
  },
  {
    "id": "crypto-5",
    "name": "Token Price Rank by Consensus Type",
    "description": "Ranks token prices within each consensus type.",
    "sql": "SELECT\n    consensus_type,\n    symbol,\n    current_price_usd,\n    RANK() OVER (PARTITION BY consensus_type ORDER BY current_price_usd DESC) AS price_rank\nFROM tokens\nORDER BY consensus_type, price_rank;"
  },
  {
    "id": "crypto-6",
    "name": "Transaction Status Breakdown",
    "description": "Summarizes completed vs pending on-chain transaction volumes.",
    "sql": "SELECT\n    status,\n    COUNT(tx_id) AS tx_count,\n    ROUND(SUM(gas_fee_usd), 2) AS total_gas_spent\nFROM transactions\nGROUP BY status;"
  },
  {
    "id": "crypto-7",
    "name": "Cumulative Wallet Transaction Volume",
    "description": "Calculates running sum of transfer amounts per sender wallet.",
    "sql": "SELECT\n    from_wallet_id,\n    timestamp,\n    amount,\n    SUM(amount) OVER (PARTITION BY from_wallet_id ORDER BY timestamp) AS cumulative_sent\nFROM transactions\nLIMIT 25;"
  },
  {
    "id": "crypto-8",
    "name": "Insert New Token (Add Data)",
    "description": "Lists a newly deployed crypto token asset.",
    "sql": "INSERT INTO tokens (token_id, symbol, name, consensus_type, current_price_usd, circulating_supply, volume_24h_usd)\nVALUES (9901, 'SOLA', 'Solaris Protocol', 'Proof of Stake', 4.85, 50000000, 12000000);"
  },
  {
    "id": "crypto-9",
    "name": "Update Token Price (Modify Data)",
    "description": "Applies market spot price update.",
    "sql": "UPDATE tokens\nSET current_price_usd = ROUND(current_price_usd * 1.08, 2)\nWHERE symbol = 'BTC';"
  },
  {
    "id": "crypto-10",
    "name": "Delete Test Token (Remove Data)",
    "description": "Removes the test token listing.",
    "sql": "DELETE FROM tokens\nWHERE token_id = 9901;"
  }
];
