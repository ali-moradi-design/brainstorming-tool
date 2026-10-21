import { getNodesBounds, getViewportForBounds } from '@xyflow/react';
import { toPng, toSvg } from 'html-to-image';
import { getCanvasNodes } from '@/entities/idea';

export type ImageFormat = 'png' | 'svg';

const WIDTH = 2000;
const HEIGHT = 1400;

/** Renders the whole map (not just the visible part) to an image data URL. */
export const renderBoardImage = async (format: ImageFormat): Promise<string | null> => {
  const nodes = getCanvasNodes();
  const viewport = document.querySelector<HTMLElement>('.react-flow__viewport');
  if (!nodes?.length || !viewport) return null;

  const bounds = getNodesBounds(nodes);
  const { x, y, zoom } = getViewportForBounds(bounds, WIDTH, HEIGHT, 0.1, 2, 0.12);
  const background = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
  const options = {
    backgroundColor: background || '#ffffff',
    width: WIDTH,
    height: HEIGHT,
    style: {
      width: `${WIDTH}px`,
      height: `${HEIGHT}px`,
      transform: `translate(${x}px, ${y}px) scale(${zoom})`,
    },
  };
  return format === 'png' ? toPng(viewport, options) : toSvg(viewport, options);
};

export const downloadUrl = (url: string, fileName: string): void => {
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
};

export const downloadText = (text: string, fileName: string, type = 'text/markdown'): void => {
  const url = URL.createObjectURL(new Blob([text], { type }));
  downloadUrl(url, fileName);
  URL.revokeObjectURL(url);
};
