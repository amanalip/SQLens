export type SQLDialect = 'sqlite' | 'mysql' | 'postgresql';

export function detectDialect(sql: string): SQLDialect {
  const normalized = sql.toLowerCase();
  
  if (normalized.includes('::') || normalized.includes('ilike') || normalized.includes('returning')) {
    return 'postgresql';
  }
  
  if (
    normalized.includes('auto_increment') ||
    normalized.includes('`') ||
    normalized.includes('group_concat(')
  ) {
    return 'mysql';
  }
  
  return 'sqlite';
}
