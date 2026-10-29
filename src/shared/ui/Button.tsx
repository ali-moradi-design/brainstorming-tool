import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'ghost' | 'danger';

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-accent-fg hover:bg-accent-strong',
  ghost: 'bg-transparent text-text hover:bg-surface-2 border border-border',
  danger:
    'bg-transparent text-text hover:bg-accent-strong hover:text-accent-fg border border-border',
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

// Two utilities for the same property (e.g. `px-3` and `px-0`) do not override each other by
// class order, so a default size is dropped when the caller passes its own.
const defaultSize = ['h-9', 'px-3'];
const propertyOf = (utility: string) => utility.split('-')[0];

const sizeClasses = (className: string) => {
  const own = new Set(
    className
      .split(/\s+/)
      .filter((c) => !c.includes(':'))
      .map(propertyOf),
  );
  return defaultSize.filter((d) => !own.has(propertyOf(d))).join(' ');
};

export function Button({ variant = 'ghost', className = '', type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      className={`inline-flex ${sizeClasses(className)} items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 ${variants[variant]} ${className}`}
      {...rest}
    />
  );
}
