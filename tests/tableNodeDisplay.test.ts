import { describe, it, expect } from 'vitest';

function getTableNodeSummary(data: {
  name: string;
  alias?: string;
  schema?: string;
}): string {
  if (data.alias && data.schema) return `${data.schema}.${data.name} AS ${data.alias}`;
  if (data.alias) return `${data.name} AS ${data.alias}`;
  if (data.schema) return `${data.schema}.${data.name}`;
  return data.name;
}

describe('Table Node Summary Description', () => {
  it('formats schema qualified table name with alias', () => {
    expect(getTableNodeSummary({ name: 'users', alias: 'u', schema: 'public' })).toBe('public.users AS u');
  });

  it('formats table name without schema or alias', () => {
    expect(getTableNodeSummary({ name: 'customers' })).toBe('customers');
  });
});
