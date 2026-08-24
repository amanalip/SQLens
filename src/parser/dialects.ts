export type SQLDialect = 'sqlite' | 'mysql' | 'postgresql';

export function detectDialect(sql: string): SQLDialect {
  const normalized = sql.toLowerCase();
  
  // PostgreSQL constructs
  if (
    normalized.includes('::') ||
    normalized.includes('ilike') ||
    normalized.includes('returning') ||
    normalized.includes('array_agg(') ||
    normalized.includes('string_agg(') ||
    normalized.includes('generate_series(')
  ) {
    return 'postgresql';
  }
  
  // MySQL constructs
  if (
    normalized.includes('auto_increment') ||
    normalized.includes('`') ||
    normalized.includes('straight_join') ||
    normalized.includes('ifnull(') ||
    normalized.includes('show tables') ||
    normalized.includes('show databases')
  ) {
    return 'mysql';
  }
  
  return 'sqlite';
}
