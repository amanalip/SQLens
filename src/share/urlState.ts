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
    let cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;
    cleanHash = cleanHash.trim();
    if (!cleanHash) return null;

    let decompressed = LZString.decompressFromEncodedURIComponent(cleanHash);

    // Fallback if hash was percent-encoded or pre-decoded
    if (!decompressed) {
      try {
        const unescaped = decodeURIComponent(cleanHash);
        decompressed = LZString.decompressFromEncodedURIComponent(unescaped);
      } catch {
        // Continue
      }
    }

    if (!decompressed) return null;

    return JSON.parse(decompressed) as AppUrlState;
  } catch (err) {
    console.error('Failed to decode URL state:', err);
    return null;
  }
}
