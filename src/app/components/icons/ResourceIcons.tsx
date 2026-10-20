import { ReactNode, useId } from 'react';

// Duotone resource icons (mail, insight, chat) used in the Resources and Subscribe bands.

// Soft tinted back shape + front shape filled with the DS icon gradient
const ResourceIcon = ({ children }: { children: (fill: string) => ReactNode }) => {
  const gradientId = useId();
  return (
    <svg viewBox="0 0 48 48" className="w-12 h-12 mb-space-md" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-primary-light)" />
          <stop offset="100%" stopColor="var(--color-primary)" />
        </linearGradient>
      </defs>
      {children(`url(#${gradientId})`)}
    </svg>
  );
};

export const MailIcon = () => (
  <ResourceIcon>
    {fill => (
      <>
        <path d="M6 20 24 8l18 12v18a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4Z" fill="var(--color-primary-lightest)" />
        <rect x="12" y="4" width="24" height="22" rx="3" fill={fill} />
        <path d="M17 11h14M17 16h14" stroke="var(--color-inverse)" strokeWidth="2" strokeLinecap="round" />
        <path d="M6 22l18 11 18-11v16a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4Z" fill="var(--color-icon-gradient-to)" />
      </>
    )}
  </ResourceIcon>
);

export const InsightIcon = () => (
  <ResourceIcon>
    {fill => (
      <>
        <rect x="4" y="14" width="24" height="30" rx="3" fill="var(--color-primary-lightest)" />
        <path d="M9 24h12M9 30h12M9 36h8" stroke="var(--color-icon-gradient-from)" strokeWidth="2" strokeLinecap="round" />
        <path d="M32 4a12 12 0 0 0-7 21.7V30a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4.3A12 12 0 0 0 32 4Z" fill={fill} />
        <path d="M28 36h8" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M29 14l3 4 3-4M32 18v9" stroke="var(--color-inverse)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </>
    )}
  </ResourceIcon>
);

export const ChatIcon = () => (
  <ResourceIcon>
    {fill => (
      <>
        <rect x="2" y="18" width="30" height="22" rx="6" fill="var(--color-primary-lightest)" />
        <path d="M18 6h22a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H26l-6 5v-5h-2a6 6 0 0 1-6-6V12a6 6 0 0 1 6-6Z" fill={fill} />
        <circle cx="22" cy="18" r="2" fill="var(--color-inverse)" />
        <circle cx="29" cy="18" r="2" fill="var(--color-inverse)" />
        <circle cx="36" cy="18" r="2" fill="var(--color-inverse)" />
      </>
    )}
  </ResourceIcon>
);

// Link style of the resource blocks (email, "Contact us", "Read The Updater")
export const RESOURCE_LINK_CLASS =
  'inline-flex items-center gap-space-3xs text-body-sm font-text text-primary no-underline hover:underline';
