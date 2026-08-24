import { describe, it, expect } from 'vitest';
import { themes } from '../src/theme';

describe('Theme System Configuration', () => {
  it('defines dark and light palettes with all required CSS color tokens', () => {
    const requiredKeys = [
      'bgPrimary',
      'bgSecondary',
      'bgTertiary',
      'bgCard',
      'border',
      'borderSubtle',
      'textPrimary',
      'textSecondary',
      'textMuted',
      'accent',
      'accentHover',
      'accentMuted',
      'success',
      'warning',
      'error',
      'nodeTable',
      'nodeJoin',
      'nodeFilter',
      'nodeAggregate',
      'nodeSort',
      'nodeOutput',
      'nodeCte',
    ];

    expect(themes.dark).toBeDefined();
    expect(themes.light).toBeDefined();

    requiredKeys.forEach((key) => {
      expect(themes.dark[key as keyof typeof themes.dark]).toBeDefined();
      expect(themes.light[key as keyof typeof themes.light]).toBeDefined();
    });
  });

  it('ensures dark mode background colors are distinct from text colors', () => {
    expect(themes.dark.bgPrimary).not.toBe(themes.dark.textPrimary);
    expect(themes.light.bgPrimary).not.toBe(themes.light.textPrimary);
  });
});
