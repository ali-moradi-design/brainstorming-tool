import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ShareIcon } from '@/shared/ui';
import { downloadText, downloadUrl, renderBoardImage, type ImageFormat } from './image';
import { boardToMarkdown } from './markdown';

const slug = (title: string) =>
  title
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '') || 'ideabloom';

/** Dropdown to export a board as PNG, SVG or Markdown (images need the map view). */
export function ExportMenu({
  boardId,
  title,
  canExportImage,
}: {
  boardId: string;
  title: string;
  canExportImage: boolean;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const image = async (format: ImageFormat) => {
    setOpen(false);
    const url = await renderBoardImage(format);
    if (url) downloadUrl(url, `${slug(title)}.${format}`);
  };
  const markdown = async () => {
    setOpen(false);
    downloadText(await boardToMarkdown(boardId), `${slug(title)}.md`);
  };

  return (
    <div ref={ref} className="relative">
      <Button
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        title={t('exportMenu.title')}
        aria-label={t('exportMenu.title')}
        data-testid="export-menu"
        className="w-9 px-0"
      >
        <ShareIcon />
      </Button>
      {open && (
        <div
          role="menu"
          className="absolute start-0 top-11 z-40 flex w-44 flex-col rounded-xl border border-border bg-surface p-1 shadow-xl"
        >
          {canExportImage && (
            <>
              <MenuItem onClick={() => void image('png')}>{t('exportMenu.png')}</MenuItem>
              <MenuItem onClick={() => void image('svg')}>{t('exportMenu.svg')}</MenuItem>
            </>
          )}
          <MenuItem onClick={() => void markdown()} testId="export-markdown">
            {t('exportMenu.markdown')}
          </MenuItem>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  onClick,
  children,
  testId,
}: {
  onClick: () => void;
  children: string;
  testId?: string;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      data-testid={testId}
      className="rounded-lg px-3 py-2 text-start text-sm hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent"
    >
      {children}
    </button>
  );
}
