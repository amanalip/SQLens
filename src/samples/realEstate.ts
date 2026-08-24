import { SampleQuery } from './chinook';

export const realEstateSamples: SampleQuery[] = [
  {
    id: 're-1',
    name: 'Active Property Listings with Agent Contacts',
    description: 'Lists residential and commercial properties with listing agents and neighborhoods.',
    sql: `SELECT
    p.address,
    n.neighborhood_name,
    n.city,
    p.property_type,
    p.bedrooms,
    p.bathrooms,
    p.square_feet,
    p.price,
    a.first_name || ' ' || a.last_name AS listing_agent
FROM properties p
INNER JOIN neighborhoods n ON p.neighborhood_id = n.neighborhood_id
INNER JOIN agents a ON p.agent_id = a.agent_id
WHERE p.status = 'for_sale'
ORDER BY p.price DESC;`,
  },
  {
    id: 're-2',
    name: 'Neighborhood Price per Square Foot Averages',
    description: 'Calculates average property price, square footage, and price per sqft across neighborhoods.',
    sql: `SELECT
    n.neighborhood_name,
    n.city,
    COUNT(p.property_id) AS total_properties,
    ROUND(AVG(p.price), 0) AS avg_price,
    ROUND(AVG(p.square_feet), 0) AS avg_sqft,
    ROUND(AVG(p.price * 1.0 / p.square_feet), 2) AS avg_price_per_sqft
FROM neighborhoods n
INNER JOIN properties p ON n.neighborhood_id = p.neighborhood_id
GROUP BY n.neighborhood_id, n.neighborhood_name, n.city
ORDER BY avg_price_per_sqft DESC;`,
  },
  {
    id: 're-3',
    name: 'Top Real Estate Agents by Sales Volume CTE',
    description: 'Ranks agents by total transaction volume and commission earned using CTEs.',
    sql: `WITH agent_sales AS (
    SELECT
        p.agent_id,
        COUNT(p.property_id) AS sold_count,
        SUM(p.price) AS total_volume
    FROM properties p
    WHERE p.status = 'sold'
    GROUP BY p.agent_id
)
SELECT
    a.first_name || ' ' || a.last_name AS agent_name,
    a.agency_name,
    COALESCE(s.sold_count, 0) AS properties_sold,
    COALESCE(s.total_volume, 0) AS total_sales_volume,
    ROUND(COALESCE(s.total_volume, 0) * (a.commission_rate / 100.0), 2) AS commission_earned
FROM agents a
LEFT JOIN agent_sales s ON a.agent_id = s.agent_id
ORDER BY total_sales_volume DESC;`,
  },
];
