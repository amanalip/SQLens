import { describe, it, expect, beforeEach } from 'vitest';

describe('Error Boundary Session Reset Keys', () => {
  const mockStorage: Record<string, string> = {};

  beforeEach(() => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  });

  function resetSession() {
    delete mockStorage['sqlens_theme'];
    delete mockStorage['sqlens_editor_width'];
    delete mockStorage['sqlens_results_height'];
  }

  it('clears theme and panel layout dimensions from storage', () => {
    mockStorage['sqlens_theme'] = 'light';
    mockStorage['sqlens_editor_width'] = '650';
    mockStorage['sqlens_results_height'] = '320';
    mockStorage['unrelated_key'] = 'keep_me';

    resetSession();

    expect(mockStorage['sqlens_theme']).toBeUndefined();
    expect(mockStorage['sqlens_editor_width']).toBeUndefined();
    expect(mockStorage['sqlens_results_height']).toBeUndefined();
    expect(mockStorage['unrelated_key']).toBe('keep_me');
  });
});
