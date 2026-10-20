'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faXTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';

type Heading = { id: string; text: string };

type Props = {
  headings: Heading[];
  authorName?: string;
  readingTime?: number;
};

const socialBtnClass =
  'flex items-center justify-center text-copy-muted transition-colors duration-200 hover:text-primary';

const SocialLinks = ({ shareUrl }: { shareUrl: string }) => (
  <>
    <a
      href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
      target="_blank"
      rel="noopener noreferrer"
      className={socialBtnClass}
      aria-label="Share on Facebook"
    >
      <FontAwesomeIcon icon={faFacebook} className="text-h3" />
    </a>
    <a
      href={`https://twitter.com/intent/tweet?url=${shareUrl}`}
      target="_blank"
      rel="noopener noreferrer"
      className={socialBtnClass}
      aria-label="Share on X / Twitter"
    >
      <FontAwesomeIcon icon={faXTwitter} className="text-h3" />
    </a>
    <a
      href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
      target="_blank"
      rel="noopener noreferrer"
      className={socialBtnClass}
      aria-label="Share on LinkedIn"
    >
      <FontAwesomeIcon icon={faLinkedin} className="text-h3" />
    </a>
  </>
);

export default function TableOfContents({ headings, authorName, readingTime }: Props) {
  const [activeId, setActiveId] = useState('');
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    setShareUrl(encodeURIComponent(window.location.href));
  }, []);

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 },
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length && !authorName && !readingTime) return null;

  return (
    <div className="xl:sticky xl:top-space-lg xl:self-start">
      {/* Author / meta */}
      {(authorName || readingTime) && (
        <div className="mb-space-md pb-space-md border-b border-line">
          {/* Mobile: single line with vertical dividers */}
          <div className="flex xl:hidden items-center gap-space-sm text-body-sm text-copy-muted flex-wrap">
            {authorName && (
              <span>
                Written by{' '}
                <a href="#author-section" className="font-text text-primary hover:underline transition-colors">
                  {authorName}
                </a>
              </span>
            )}
            {authorName && !!readingTime && <span className="w-px h-4 bg-line shrink-0" />}
            {!!readingTime && <span>{readingTime} min read</span>}
            <span className="w-px h-4 bg-line shrink-0" />
            <div className="flex items-center gap-space-sm">
              <SocialLinks shareUrl={shareUrl} />
            </div>
          </div>
          {/* Desktop: stacked layout */}
          <div className="hidden xl:flex flex-col gap-space-sm">
            {authorName && (
              <p className="text-body-sm text-copy-muted">
                Written by{' '}
                <a href="#author-section" className="font-text text-primary hover:underline transition-colors">
                  {authorName}
                </a>
              </p>
            )}
            {!!readingTime && <p className="text-body-sm text-copy">{readingTime} min read</p>}
            <div className="flex items-center gap-space-sm pt-space-3xs">
              <SocialLinks shareUrl={shareUrl} />
            </div>
          </div>
        </div>
      )}

      {/* TOC */}
      {headings.length > 0 && (
        <>
          <p className="eyebrow text-copy mb-space-sm">Find in this page</p>
          <ul className="flex flex-col" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {headings.map(({ id, text }) => (
              <li key={id} style={{ listStyle: 'none' }} className="py-space-2xs">
                <a
                  href={`#${id}`}
                  className={`text-body-sm transition-colors block hover:text-primary ${
                    activeId === id ? 'text-primary font-text' : 'text-copy-muted'
                  }`}
                >
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
