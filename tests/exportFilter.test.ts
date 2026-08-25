import { describe, it, expect } from 'vitest';

function exportFilter(node: unknown): boolean {
  const el = node as HTMLElement;
  if (el.getAttribute && el.getAttribute('data-export-ignore') === 'true') {
    return false;
  }

  const cls =
    typeof el.className === 'string'
      ? el.className
      : (node as unknown as SVGElement).className?.baseVal || '';

  if (
    cls.includes('react-flow__controls') ||
    cls.includes('react-flow__minimap') ||
    cls.includes('react-flow__panel')
  ) {
    return false;
  }
  return true;
}

describe('Graph Export Node Filtering', () => {
  it('excludes elements marked with data-export-ignore', () => {
    const el = {
      className: 'searchBar',
      getAttribute: (attr: string) => (attr === 'data-export-ignore' ? 'true' : null),
    };
    expect(exportFilter(el)).toBe(false);
  });

  it('excludes react-flow__controls and react-flow__minimap elements', () => {
    const controls = { className: 'react-flow__controls custom-style', getAttribute: () => null };
    const minimap = { className: 'react-flow__minimap-wrapper', getAttribute: () => null };
    expect(exportFilter(controls)).toBe(false);
    expect(exportFilter(minimap)).toBe(false);
  });

  it('excludes react-flow__panel overlay panels', () => {
    const panel = { className: 'react-flow__panel top left', getAttribute: () => null };
    expect(exportFilter(panel)).toBe(false);
  });

  it('preserves graph nodes, cards, and edges', () => {
    const tableCard = { className: 'tableCardNode selected', getAttribute: () => null };
    const edge = { className: 'react-flow__edge-path', getAttribute: () => null };
    expect(exportFilter(tableCard)).toBe(true);
    expect(exportFilter(edge)).toBe(true);
  });
});
