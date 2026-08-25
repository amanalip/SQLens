export type SQLDialect = 'sqlite' | 'mysql' | 'postgresql';

export function detectDialect(sql: string): SQLDialect {
  // Strip string literals to prevent URLs or text content from triggering false positives
  const stripped = sql.replace(/'(?:''|[^'])*'|"(?:""|[^"])*"/g, '');
  const normalized = stripped.toLowerCase();
  
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
    normalized.includes('show tables') ||
    normalized.includes('show databases') ||
    normalized.includes('curdate()') ||
    normalized.includes('unix_timestamp(')
  ) {
    return 'mysql';
  }
  
  return 'sqlite';
}
