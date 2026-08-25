import { describe, it, expect } from 'vitest';

function formatSQL(sqlText: string): string {
  if (!sqlText.trim()) return '';

  const stringLiterals: string[] = [];
  const placeholder = (idx: number) => `__SQLENS_STR_LITERAL_${idx}__`;

  const protectedSql = sqlText.replace(/'(?:''|[^'])*'|"(?:""|[^"])*"/g, (match) => {
    const idx = stringLiterals.length;
    stringLiterals.push(match);
    return placeholder(idx);
  });

  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY',
    'LIMIT', 'OFFSET', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN',
    'FULL JOIN', 'CROSS JOIN', 'JOIN', 'ON', 'AND', 'OR', 'UNION ALL',
    'UNION', 'WITH', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
    'AS', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'
  ];

  let formatted = protectedSql;

  keywords.forEach((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`, 'gi');
    formatted = formatted.replace(regex, kw);
  });

  const majorClauses = [
    'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY',
    'LIMIT', 'OFFSET', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN',
    'FULL JOIN', 'CROSS JOIN', 'UNION ALL', 'UNION', 'WITH', 'SET', 'VALUES'
  ];

  majorClauses.forEach((clause) => {
    const regex = new RegExp(`\\s*\\b(${clause})\\b`, 'g');
    formatted = formatted.replace(regex, '\n$1');
  });

  stringLiterals.forEach((literal, idx) => {
    formatted = formatted.replace(placeholder(idx), literal);
  });

  return formatted.trim();
}

describe('SQL Formatter with String Literal Protection', () => {
  it('uppercases keywords outside string literals', () => {
    const raw = 'select id, name from users where status = 1';
    const formatted = formatSQL(raw);
    expect(formatted).toContain('SELECT');
    expect(formatted).toContain('FROM');
    expect(formatted).toContain('WHERE');
  });

  it('preserves exact casing and whitespace inside single-quoted string literals', () => {
    const raw = "select id from tracks where genre = 'Rock and Roll and Pop'";
    const formatted = formatSQL(raw);
    expect(formatted).toContain("'Rock and Roll and Pop'");
    expect(formatted).not.toContain("'Rock AND Roll AND Pop'");
  });

  it('does not split clauses inside string literals', () => {
    const raw = "select * from logs where message = 'error: select from table failed'";
    const formatted = formatSQL(raw);
    expect(formatted).toContain("'error: select from table failed'");
  });

  it('formats complex multi-clause queries cleanly', () => {
    const raw = "select artist_id, count(*) as c from tracks where milliseconds > 1000 group by artist_id order by c desc limit 10";
    const formatted = formatSQL(raw);
    expect(formatted).toContain('GROUP BY');
    expect(formatted).toContain('ORDER BY');
    expect(formatted).toContain('LIMIT');
  });
});
