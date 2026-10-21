import type { SVGProps } from 'react';

const PETALS = [0, 60, 120, 180, 240, 300];

/** Ideabloom mark: six petals (branches) around a center idea. Colors are fixed brand colors. */
export function Logo({ size = 32, ...rest }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden {...rest}>
      <rect width="64" height="64" rx="16" fill="#124e78" />
      <g transform="translate(32 32)">
        {PETALS.map((angle, i) => (
          <ellipse
            key={angle}
            cx="0"
            cy="-13"
            rx="6.2"
            ry="11"
            fill={i % 2 === 0 ? '#f2bb05' : '#d74e09'}
            transform={`rotate(${angle})`}
          />
        ))}
        <circle r="7.5" fill="#f0f0c9" />
        <circle r="3" fill="#124e78" />
      </g>
    </svg>
  );
}
