import { toPng } from 'html-to-image';

export async function exportGraphToPng(containerElement: HTMLElement, filename = 'sqlens-graph.png'): Promise<void> {
  try {
    const dataUrl = await toPng(containerElement, {
      backgroundColor: '#0f141c',
      quality: 0.95,
      filter: (node) => {
        // Exclude minimap or controls from screenshot if needed
        const className = (node as HTMLElement).className || '';
        if (typeof className === 'string' && className.includes('react-flow__controls')) {
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
