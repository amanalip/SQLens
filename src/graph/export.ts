import { toPng } from 'html-to-image';

export async function exportGraphToPng(containerElement: HTMLElement, filename = 'sqlens-graph.png'): Promise<void> {
  try {
    const computedBg =
      getComputedStyle(containerElement).getPropertyValue('--bg-primary').trim() ||
      getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim() ||
      '#0f141c';

    const dataUrl = await toPng(containerElement, {
      backgroundColor: computedBg,
      quality: 0.95,
      filter: (node) => {
        // Exclude minimap and controls from screenshot
        const el = node as HTMLElement;
        const cls =
          typeof el.className === 'string'
            ? el.className
            : (node as unknown as SVGElement).className?.baseVal || '';

        if (cls.includes('react-flow__controls') || cls.includes('react-flow__minimap')) {
          return false;
        }
        return true;
      },
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Failed to export graph image:', error);
  }
}
