import { useId } from 'react';
import { IconDefinition, faLinkedin, faYoutube } from '@fortawesome/free-brands-svg-icons';

type ShareLinksProps = {
  url: string;
  title?: string;
  className?: string;
};

type IconPath = { viewBox: string; path: string };

const toIconPath = ({ icon }: IconDefinition): IconPath => ({
  viewBox: `0 0 ${icon[0]} ${icon[1]}`,
  path: Array.isArray(icon[4]) ? icon[4].join(' ') : icon[4],
});

// Solid envelope (Font Awesome "envelope", free solid)
const ENVELOPE: IconPath = {
  viewBox: '0 0 512 512',
  path: 'M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z',
};

// Brand glyph filled with the DS soft icon gradient
const GradientIcon = ({ icon }: { icon: IconPath }) => {
  const gradientId = useId();
  return (
    <svg viewBox={icon.viewBox} className="w-5 h-5" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-icon-gradient-from)" />
          <stop offset="100%" stopColor="var(--color-icon-gradient-to)" />
        </linearGradient>
      </defs>
      <path d={icon.path} fill={`url(#${gradientId})`} />
    </svg>
  );
};

// Share buttons for articles: LinkedIn share, Eidosmedia YouTube channel, share by email.
const ShareLinks = ({ url, title = '', className = '' }: ShareLinksProps) => {
  const links = [
    {
      label: 'Share on LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      icon: toIconPath(faLinkedin),
    },
    { label: 'Eidosmedia on YouTube', href: 'https://www.youtube.com/@Eidosmedia', icon: toIconPath(faYoutube) },
    {
      label: 'Share by email',
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
      icon: ENVELOPE,
    },
  ];

  return (
    <div className={`flex items-center gap-space-2xs ${className}`}>
      {links.map(({ label, href, icon }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 rounded-full bg-surface flex items-center justify-center hover:bg-line transition-colors"
        >
          <GradientIcon icon={icon} />
        </a>
      ))}
    </div>
  );
};

export default ShareLinks;
