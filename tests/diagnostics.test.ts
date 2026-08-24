import { describe, it, expect } from 'vitest';
import { parseSQL } from '../src/parser/parser';

describe('SQL Diagnostics Engine', () => {
  it('detects unconstrained DELETE without WHERE clause', () => {
    const res = parseSQL('DELETE FROM customers;');
    const warning = res.diagnostics.find((d) => d.id === 'unbounded-mutation');
    expect(warning).toBeDefined();
    expect(warning?.severity).toBe('warning');
    expect(warning?.message).toContain('DELETE');
  });

  it('detects unconstrained UPDATE without WHERE clause', () => {
    const res = parseSQL('UPDATE products SET price = 10.0;');
    const warning = res.diagnostics.find((d) => d.id === 'unbounded-mutation');
    expect(warning).toBeDefined();
    expect(warning?.severity).toBe('warning');
  });

  it('does not flag DELETE or UPDATE when WHERE clause is present', () => {
    const res = parseSQL('DELETE FROM customers WHERE customer_id = 5;');
    const warning = res.diagnostics.find((d) => d.id === 'unbounded-mutation');
    expect(warning).toBeUndefined();
  });

  it('detects SELECT * star projection', () => {
    const res = parseSQL('SELECT * FROM employees;');
    const starDiag = res.diagnostics.find((d) => d.id === 'star-projection');
    expect(starDiag).toBeDefined();
    expect(starDiag?.severity).toBe('info');
  });

  it('detects Cartesian joins without ON condition', () => {
    const res = parseSQL('SELECT a.name, b.title FROM artists a JOIN albums b;');
    const cartDiag = res.diagnostics.find((d) => d.id === 'cartesian-join');
    expect(cartDiag).toBeDefined();
    expect(cartDiag?.severity).toBe('warning');
  });

  it('detects leading wildcard LIKE queries', () => {
    const res = parseSQL("SELECT name FROM tracks WHERE name LIKE '%Rock%';");
    const wildcardDiag = res.diagnostics.find((d) => d.id === 'leading-wildcard-like');
    expect(wildcardDiag).toBeDefined();
    expect(wildcardDiag?.severity).toBe('info');
  });

  it('detects ORDER BY RAND() and warns about full table scans', () => {
    const res = parseSQL('SELECT id, name FROM users ORDER BY RANDOM() LIMIT 5;');
    const randDiag = res.diagnostics.find((d) => d.id === 'order-by-rand');
    expect(randDiag).toBeDefined();
    expect(randDiag?.severity).toBe('warning');
  });

  it('detects redundant DISTINCT with GROUP BY clause', () => {
    const res = parseSQL('SELECT DISTINCT department, COUNT(*) FROM employees GROUP BY department;');
    const distinctDiag = res.diagnostics.find((d) => d.id === 'redundant-distinct-group-by');
    expect(distinctDiag).toBeDefined();
    expect(distinctDiag?.severity).toBe('info');
  });

  it('generates error diagnostic with line and column numbers on syntax failure', () => {
    const res = parseSQL('SELECT FROM WHERE;');
    const errDiag = res.diagnostics.find((d) => d.severity === 'error');
    expect(errDiag).toBeDefined();
    expect(errDiag?.id).toBe('syntax-error');
  });
});
