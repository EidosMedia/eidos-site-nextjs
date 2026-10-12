import React from 'react';

export type BadgeTone = 'blue' | 'green' | 'indigo' | 'rose' | 'sky' | 'mint';

type BadgeProps = {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
};

// Colors come from the --color-badge-* tokens in globals.css
const TONE_CLASSES: Record<BadgeTone, string> = {
  blue: 'bg-badge-blue-soft text-badge-blue',
  green: 'bg-badge-green-soft text-badge-green',
  indigo: 'bg-badge-indigo-soft text-badge-indigo',
  rose: 'bg-badge-rose-soft text-badge-rose',
  sky: 'bg-badge-sky-soft text-badge-sky',
  mint: 'bg-badge-mint-soft text-badge-mint',
};

// Pill label (uppercase, tracked): categories, tags, statuses.
const Badge = ({ tone = 'indigo', className = '', children }: BadgeProps) => (
  <span
    className={`inline-block eyebrow font-medium rounded-full px-space-sm py-space-2xs ${TONE_CLASSES[tone]} ${className}`}
  >
    {children}
  </span>
);

export default Badge;
