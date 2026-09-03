import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { EditorPane } from '../src/ui/EditorPane/EditorPane';

describe('Editor word wrapping', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('starts enabled and saves changes from the toolbar control', () => {
    render(
      <EditorPane
        value="SELECT * FROM artists;"
        onChange={vi.fn()}
        onRunQuery={vi.fn()}
        diagnostics={[]}
      />
    );

    const wrapButton = screen.getByRole('button', { name: 'Disable SQL editor word wrap' });
    expect(wrapButton.getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(wrapButton);

    expect(screen.getByRole('button', { name: 'Enable SQL editor word wrap' }).getAttribute('aria-pressed'))
      .toBe('false');
    expect(localStorage.getItem('sqlens_editor_wrap')).toBe('false');
  });

  it('restores a disabled wrapping preference', () => {
    localStorage.setItem('sqlens_editor_wrap', 'false');

    render(
      <EditorPane
        value="SELECT * FROM artists;"
        onChange={vi.fn()}
        onRunQuery={vi.fn()}
        diagnostics={[]}
      />
    );

    expect(screen.getByRole('button', { name: 'Enable SQL editor word wrap' }).getAttribute('aria-pressed'))
      .toBe('false');
  });
});
