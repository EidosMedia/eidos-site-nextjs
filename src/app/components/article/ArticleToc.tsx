'use client';
import { MouseEvent, useEffect, useState } from 'react';

type ArticleTocProps = {
  headings: { id: string; text: string }[];
  title?: string;
  className?: string;
};

// Article index ("Read at this point"): anchor links to the section headings; the section being read
// is highlighted while scrolling.
const ArticleToc = ({ headings, title = 'Read at this point', className = '' }: ArticleTocProps) => {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? '');

  useEffect(() => {
    // The active section is the last heading scrolled past the top third of the viewport
    const update = () => {
      const threshold = window.innerHeight / 3;
      let current = headings[0]?.id ?? '';
      headings.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= threshold) current = id;
      });
      setActiveId(current);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [headings]);

  const scrollTo = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    event.preventDefault();
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${id}`);
  };

  if (headings.length === 0) return null;

  return (
    <nav className={className} aria-label={title}>
      <p className="text-body-sm uppercase text-copy mb-space-md">{title}</p>
      <ul className="relative flex flex-col gap-space-md list-none m-0 p-0 before:absolute before:left-1.5 before:top-0 before:bottom-0 before:w-px before:bg-line">
        {headings.map(({ id, text }) => {
          const isActive = id === activeId;
          return (
            <li key={id} className="relative flex items-start gap-space-xs">
              <span
                className={`relative mt-space-3xs w-3 h-3 shrink-0 rounded-full transition-colors ${isActive ? 'bg-primary' : 'bg-line'}`}
                aria-hidden="true"
              />
              <a
                href={`#${id}`}
                onClick={event => scrollTo(event, id)}
                aria-current={isActive ? 'location' : undefined}
                className={`text-body no-underline transition-colors ${
                  isActive ? 'text-primary' : 'text-copy-muted hover:text-primary'
                }`}
              >
                {text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default ArticleToc;
