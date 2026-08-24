import { describe, it, expect } from 'vitest';
import { encodeStateToHash, decodeStateFromHash, AppUrlState } from '../src/share/urlState';

describe('URL State Codec', () => {
  it('encodes and decodes state cleanly', () => {
    const original: AppUrlState = {
      sql: 'SELECT * FROM users JOIN orders ON users.id = orders.user_id;',
      dbId: 'chinook',
      mode: 'query',
    };

    const hash = encodeStateToHash(original);
    expect(typeof hash).toBe('string');
    expect(hash.length).toBeGreaterThan(0);

    const decoded = decodeStateFromHash(hash);
    expect(decoded).toEqual(original);
  });

  it('decodes hash with leading hash symbol and whitespace', () => {
    const original: AppUrlState = {
      sql: 'SELECT 1;',
      dbId: 'world',
      mode: 'schema',
    };
    const hash = `#${encodeStateToHash(original)} `;
    const decoded = decodeStateFromHash(hash);
    expect(decoded).toEqual(original);
  });

  it('returns null for empty or corrupted hash', () => {
    expect(decodeStateFromHash('')).toBeNull();
    expect(decodeStateFromHash('#')).toBeNull();
    expect(decodeStateFromHash('invalid_corrupted_hash_data_12345')).toBeNull();
  });

  it('normalizes empty or whitespace dbId to undefined', () => {
    const original: AppUrlState = {
      sql: 'SELECT 1;',
      dbId: '   ',
      mode: 'query',
    };
    const hash = encodeStateToHash(original);
    const decoded = decodeStateFromHash(hash);
    expect(decoded?.dbId).toBeUndefined();
    expect(decoded?.sql).toBe('SELECT 1;');
  });

  it('handles percent-encoded hashes gracefully', () => {
    const original: AppUrlState = {
      sql: 'SELECT 42;',
      dbId: 'chinook',
      mode: 'query',
    };
    const hash = encodeStateToHash(original);
    const encodedHash = encodeURIComponent(hash);
    const decoded = decodeStateFromHash(encodedHash);
    expect(decoded).toEqual(original);
  });
});
