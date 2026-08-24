import LZString from 'lz-string';

export interface AppUrlState {
  sql: string;
  dbId?: string;
  mode?: 'query' | 'schema';
}

export function encodeStateToHash(state: AppUrlState): string {
  try {
    const json = JSON.stringify(state);
    const compressed = LZString.compressToEncodedURIComponent(json);
    return compressed;
  } catch (err) {
    console.error('Failed to encode URL state:', err);
    return '';
  }
}

export function decodeStateFromHash(hash: string): AppUrlState | null {
  try {
    const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;
    if (!cleanHash) return null;

    const decompressed = LZString.decompressFromEncodedURIComponent(cleanHash);
    if (!decompressed) return null;

    return JSON.parse(decompressed) as AppUrlState;
  } catch (err) {
    console.error('Failed to decode URL state:', err);
    return null;
  }
}
