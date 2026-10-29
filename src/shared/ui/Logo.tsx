import type { SVGProps } from 'react';

const PETALS = [0, 60, 120, 180, 240, 300];

/** Ideabloom mark: six petals (branches) around a center idea. Colors are fixed brand colors. */
export function Logo({ size = 32, ...rest }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden {...rest}>
      <rect width="64" height="64" rx="16" fill="#001f54" />
      <g transform="translate(32 32)">
        {PETALS.map((angle, i) => (
          <ellipse
            key={angle}
            cx="0"
            cy="-13"
            rx="6.2"
            ry="11"
            fill={i % 2 === 0 ? '#1282a2' : '#fefcfb'}
            transform={`rotate(${angle})`}
          />
        ))}
        <circle r="7.5" fill="#034078" />
        <circle r="3" fill="#fefcfb" />
      </g>
    </svg>
  );
}
