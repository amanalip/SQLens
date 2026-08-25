import { SampleQuery } from './types';

export const realEstateSamples: SampleQuery[] = [
  {
    "id": "real-estate-1",
    "name": "Neighborhood Price per Square Foot",
    "description": "Calculates average property prices and square footage rates by neighborhood.",
    "sql": "SELECT\n    n.neighborhood_name,\n    n.city,\n    COUNT(p.property_id) AS total_listings,\n    ROUND(AVG(p.price), 0) AS avg_listing_price,\n    ROUND(AVG(p.price * 1.0 / p.square_feet), 2) AS avg_price_per_sqft\nFROM neighborhoods n\nINNER JOIN properties p ON n.neighborhood_id = p.neighborhood_id\nGROUP BY n.neighborhood_id, n.neighborhood_name, n.city\nORDER BY avg_price_per_sqft DESC;"
  },
  {
    "id": "real-estate-2",
    "name": "Agent Sales Portfolio and Commissions",
    "description": "Aggregates listed property valuations and commission potential per agent.",
    "sql": "SELECT\n    a.first_name || ' ' || a.last_name AS agent_name,\n    a.agency_name,\n    COUNT(p.property_id) AS active_properties,\n    ROUND(SUM(p.price), 0) AS total_portfolio_value,\n    ROUND(SUM(p.price * a.commission_rate), 0) AS potential_commission\nFROM agents a\nINNER JOIN properties p ON a.agent_id = p.agent_id\nGROUP BY a.agent_id, a.first_name, a.last_name, a.agency_name\nORDER BY total_portfolio_value DESC;"
  },
  {
    "id": "real-estate-3",
    "name": "Luxury Homes Above Average",
    "description": "Finds single-family homes with prices exceeding market average.",
    "sql": "SELECT\n    address,\n    bedrooms,\n    bathrooms,\n    square_feet,\n    price\nFROM properties\nWHERE property_type = 'Single Family'\n  AND price > (SELECT AVG(price) FROM properties)\nORDER BY price DESC\nLIMIT 20;"
  },
  {
    "id": "real-estate-4",
    "name": "Property Type Valuation CTE",
    "description": "Aggregates market metrics across residential property categories.",
    "sql": "WITH type_summary AS (\n    SELECT\n        property_type,\n        COUNT(property_id) AS listing_count,\n        AVG(price) AS avg_price,\n        AVG(square_feet) AS avg_sqft\n    FROM properties\n    GROUP BY property_type\n)\nSELECT\n    property_type,\n    listing_count,\n    ROUND(avg_price, 0) AS avg_price,\n    ROUND(avg_sqft, 0) AS avg_sqft,\n    ROUND(avg_price / avg_sqft, 2) AS price_per_sqft\nFROM type_summary\nORDER BY avg_price DESC;"
  },
  {
    "id": "real-estate-5",
    "name": "Price Rank by Neighborhood",
    "description": "Ranks listing prices within each neighborhood using RANK().",
    "sql": "SELECT\n    neighborhood_id,\n    address,\n    price,\n    square_feet,\n    RANK() OVER (PARTITION BY neighborhood_id ORDER BY price DESC) AS price_rank\nFROM properties\nLIMIT 30;"
  },
  {
    "id": "real-estate-6",
    "name": "Property Status Breakdown Matrix",
    "description": "Summarizes active vs pending vs sold property counts.",
    "sql": "SELECT\n    status,\n    COUNT(property_id) AS property_count,\n    ROUND(AVG(price), 0) AS avg_price\nFROM properties\nGROUP BY status;"
  },
  {
    "id": "real-estate-7",
    "name": "Cumulative Agent Portfolio Value",
    "description": "Calculates running sum of listing values for each real estate agent.",
    "sql": "SELECT\n    agent_id,\n    property_id,\n    price,\n    SUM(price) OVER (PARTITION BY agent_id ORDER BY price DESC) AS cumulative_portfolio\nFROM properties\nLIMIT 25;"
  },
  {
    "id": "real-estate-8",
    "name": "Insert New Property Listing (Add Data)",
    "description": "Adds a newly listed penthouse apartment.",
    "sql": "INSERT INTO properties (property_id, address, neighborhood_id, agent_id, property_type, bedrooms, bathrooms, square_feet, price, status, listed_date)\nVALUES (9901, '742 Evergreen Terrace', 1, 1, 'Single Family', 4, 3, 2800, 650000, 'Active', '2024-03-01');"
  },
  {
    "id": "real-estate-9",
    "name": "Update Property Status (Modify Data)",
    "description": "Marks active listing as pending escrow.",
    "sql": "UPDATE properties\nSET status = 'Pending'\nWHERE property_id = 1;"
  },
  {
    "id": "real-estate-10",
    "name": "Delete Test Property (Remove Data)",
    "description": "Removes the test property listing.",
    "sql": "DELETE FROM properties\nWHERE property_id = 9901;"
  }
];
