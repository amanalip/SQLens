import { SampleQuery } from '../types';

export const sample = (id: string, name: string, description: string, sql: string): SampleQuery => ({
  id,
  name,
  description,
  sql,
});

interface ProfileOptions {
  key: string;
  table: string;
  subject: string;
  value: string;
  valueLabel: string;
  category: string;
  categoryLabel: string;
  id: string;
}

export const profileSamples = ({ key, table, subject, value, valueLabel, category, categoryLabel, id }: ProfileOptions): SampleQuery[] => [
  sample(`${key}-14`, `Highest ${valueLabel}`, `Ranks ${subject} by ${valueLabel.toLowerCase()}.`,
    `SELECT ${id}, ${category}, ${value} FROM ${table} WHERE ${value} IS NOT NULL ORDER BY ${value} DESC LIMIT 20;`),
  sample(`${key}-15`, `${categoryLabel} Summary`, `Compares record counts and average ${valueLabel.toLowerCase()} by ${categoryLabel.toLowerCase()}.`,
    `SELECT ${category}, COUNT(*) AS records, ROUND(AVG(${value}), 2) AS average_value, MIN(${value}) AS minimum_value, MAX(${value}) AS maximum_value FROM ${table} GROUP BY ${category} ORDER BY average_value DESC;`),
  sample(`${key}-16`, `Above Average ${subject}`, `Finds ${subject} above the overall ${valueLabel.toLowerCase()} average.`,
    `SELECT ${id}, ${category}, ${value} FROM ${table} WHERE ${value} > (SELECT AVG(${value}) FROM ${table}) ORDER BY ${value} DESC;`),
  sample(`${key}-17`, `Running ${valueLabel}`, `Keeps a running ${valueLabel.toLowerCase()} total in record order.`,
    `SELECT ${id}, ${value}, SUM(${value}) OVER (ORDER BY ${id}) AS running_total FROM ${table} ORDER BY ${id};`),
  sample(`${key}-18`, `${categoryLabel} Rankings`, `Ranks ${subject} within each ${categoryLabel.toLowerCase()}.`,
    `SELECT ${id}, ${category}, ${value}, DENSE_RANK() OVER (PARTITION BY ${category} ORDER BY ${value} DESC) AS category_rank FROM ${table} ORDER BY ${category}, category_rank;`),
  sample(`${key}-19`, `${valueLabel} Share`, `Calculates each record share of total ${valueLabel.toLowerCase()}.`,
    `SELECT ${id}, ${value}, ROUND(100.0 * ${value} / NULLIF(SUM(${value}) OVER (), 0), 2) AS total_share_pct FROM ${table} WHERE ${value} IS NOT NULL ORDER BY total_share_pct DESC;`),
  sample(`${key}-20`, `${valueLabel} Bands`, `Groups ${subject} into low, middle, and high ${valueLabel.toLowerCase()} bands.`,
    `SELECT CASE WHEN ${value} < (SELECT AVG(${value}) * 0.75 FROM ${table}) THEN 'Low' WHEN ${value} > (SELECT AVG(${value}) * 1.25 FROM ${table}) THEN 'High' ELSE 'Middle' END AS value_band, COUNT(*) AS records, ROUND(AVG(${value}), 2) AS average_value FROM ${table} GROUP BY value_band ORDER BY average_value DESC;`),
];
