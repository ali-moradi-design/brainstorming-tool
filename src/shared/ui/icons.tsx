/* eslint-disable react-refresh/only-export-components -- icon factory */
import type { SVGProps } from 'react';

const base: SVGProps<SVGSVGElement> = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const icon = (d: string) =>
  function Icon(props: SVGProps<SVGSVGElement>) {
    return (
      <svg {...base} {...props}>
        <path d={d} />
      </svg>
    );
  };

export const SunIcon = icon(
  'M12 3v2M12 19v2M5 5l1.4 1.4M17.6 17.6 19 19M3 12h2M19 12h2M5 19l1.4-1.4M17.6 6.4 19 5M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
);
export const MoonIcon = icon('M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z');
export const PlusIcon = icon('M12 5v14M5 12h14');
export const TrashIcon = icon('M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3');
export const DownloadIcon = icon('M12 4v11M7 11l5 5 5-5M5 20h14');
export const UploadIcon = icon('M12 16V5M7 9l5-5 5 5M5 20h14');
export const LayoutIcon = icon('M4 5h6v5H4zM14 3h6v5h-6zM14 14h6v5h-6zM10 8h2v9h2');
export const BranchIcon = icon('M6 4v10a4 4 0 0 0 4 4h8M14 14l4 4-4 4');
export const ArrowIcon = icon('M19 12H5M11 6l-6 6 6 6');
export const LogoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...props} strokeWidth={1.8}>
    <circle cx="12" cy="12" r="3" fill="currentColor" />
    <circle cx="4.5" cy="6" r="1.8" />
    <circle cx="19.5" cy="6" r="1.8" />
    <circle cx="12" cy="20" r="1.8" />
    <path d="M6 7.2 10 10.5M18 7.2 14 10.5M12 15v3" />
  </svg>
);
