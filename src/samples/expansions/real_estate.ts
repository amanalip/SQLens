import { SampleQuery } from '../types';
import { sample, profileSamples } from './helpers';

export const real_estateExpansion: SampleQuery[] = [
  sample('real-estate-11', 'Neighborhood Price Outliers', 'Finds homes priced well above the local average per square foot.', `SELECT p.address, n.neighborhood_name,
       ROUND(p.price / p.square_feet, 2) AS price_per_sqft
FROM properties p JOIN neighborhoods n ON p.neighborhood_id = n.neighborhood_id
WHERE p.square_feet > 0 AND p.price / p.square_feet > (
    SELECT AVG(p2.price / p2.square_feet) * 1.2
    FROM properties p2 WHERE p2.neighborhood_id = p.neighborhood_id AND p2.square_feet > 0
)
ORDER BY price_per_sqft DESC;`),
    sample('real-estate-12', 'Agent Listing Mix', 'Breaks down each agent inventory by listing status.', `SELECT a.first_name || ' ' || a.last_name AS agent, p.status,
       COUNT(*) AS properties, ROUND(SUM(p.price), 2) AS listed_value
FROM agents a JOIN properties p ON a.agent_id = p.agent_id
GROUP BY a.agent_id, agent, p.status
ORDER BY agent, properties DESC;`),
    sample('real-estate-13', 'Bedroom Price Premiums', 'Compares average property price and floor area by bedroom count.', `SELECT bedrooms, COUNT(*) AS properties, ROUND(AVG(price), 2) AS avg_price,
       ROUND(AVG(square_feet), 0) AS avg_square_feet,
       ROUND(AVG(price / square_feet), 2) AS avg_price_per_sqft
FROM properties
WHERE square_feet > 0
GROUP BY bedrooms
ORDER BY bedrooms;`),
    ...profileSamples({ key: 'real-estate', table: 'properties', subject: 'properties', value: 'price', valueLabel: 'Property Prices', category: 'property_type', categoryLabel: 'Property Type', id: 'property_id' })
];
