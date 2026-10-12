'use client';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';

type InPageSearchProps = {
  placeholder: string;
  // true when the field sits on a white page: white fill with border; false: tinted fill
  bordered?: boolean;
};

const MATCH_HIGHLIGHT = 'in-page-search';
const CURRENT_HIGHLIGHT = 'in-page-search-current';
const SKIPPED_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'INPUT', 'TEXTAREA', 'SVG']);

// CSS Custom Highlight API (highlights text ranges without touching the DOM React renders)
type HighlightRegistry = { set: (name: string, highlight: unknown) => void; delete: (name: string) => void };
const getHighlights = () =>
  typeof CSS !== 'undefined' &&
  'highlights' in CSS &&
  typeof (window as { Highlight?: unknown }).Highlight === 'function'
    ? {
        registry: (CSS as unknown as { highlights: HighlightRegistry }).highlights,
        Highlight: (window as unknown as { Highlight: new (...ranges: Range[]) => unknown }).Highlight,
      }
    : undefined;

// All visible text matches of `query` (case insensitive) in the page content (<main>), outside the search field.
const findMatches = (query: string): Range[] => {
  const root = document.querySelector('main');
  if (!root || !query) return [];
  const needle = query.toLowerCase();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: node => {
      const parent = node.parentElement;
      if (!parent || SKIPPED_TAGS.has(parent.tagName.toUpperCase())) return NodeFilter.FILTER_REJECT;
      if (parent.closest('[data-in-page-search-ignore]')) return NodeFilter.FILTER_REJECT;
      // Skip text hidden by layout (e.g. desktop-only sidebar on mobile)
      if (!parent.getClientRects().length) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const ranges: Range[] = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const value = node.nodeValue?.toLowerCase() ?? '';
    for (let index = value.indexOf(needle); index !== -1; index = value.indexOf(needle, index + needle.length)) {
      const range = document.createRange();
      range.setStart(node, index);
      range.setEnd(node, index + needle.length);
      ranges.push(range);
    }
  }
  return ranges;
};

// "Find in page" field (like cmd+F): highlights every occurrence in the page content, shows
// "current/total" and moves between them with Enter / Shift+Enter or the arrows; Esc or × clears.
// While a search is active and its place is scrolled out of view, the field floats top right.
const InPageSearch = ({ placeholder, bordered = true }: InPageSearchProps) => {
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState<Range[]>([]);
  const [current, setCurrent] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  // Whether the field's original place is on screen; while searching and scrolled away, the field floats
  const [inPlace, setInPlace] = useState(true);
  const [slotSize, setSlotSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;
    const observer = new IntersectionObserver(([entry]) => setInPlace(entry.isIntersecting));
    observer.observe(slot);
    return () => observer.disconnect();
  }, []);

  // Size of the field while in place, kept by the slot when the field floats
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const observer = new ResizeObserver(() => {
      if (getComputedStyle(box).position !== 'fixed') {
        setSlotSize({ width: box.offsetWidth, height: box.offsetHeight });
      }
    });
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  // Recompute the matches while typing (debounced)
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const found = findMatches(query.trim());
      setMatches(found);
      setCurrent(0);
    }, 150);
    return () => window.clearTimeout(timer);
  }, [query]);

  // Paint the highlights and scroll the current match into view
  useEffect(() => {
    const highlights = getHighlights();
    const currentRange = matches[current];
    if (highlights) {
      highlights.registry.set(MATCH_HIGHLIGHT, new highlights.Highlight(...matches));
      if (currentRange) highlights.registry.set(CURRENT_HIGHLIGHT, new highlights.Highlight(currentRange));
      else highlights.registry.delete(CURRENT_HIGHLIGHT);
    } else if (currentRange) {
      // Fallback for browsers without the Highlight API: select the current match
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(currentRange);
    }
    if (currentRange) {
      const rect = currentRange.getBoundingClientRect();
      window.scrollTo({ top: rect.top + window.scrollY - window.innerHeight / 3, behavior: 'smooth' });
    }
  }, [matches, current]);

  // Clear the highlights when leaving the page
  useEffect(
    () => () => {
      const highlights = getHighlights();
      highlights?.registry.delete(MATCH_HIGHLIGHT);
      highlights?.registry.delete(CURRENT_HIGHLIGHT);
    },
    [],
  );

  const move = (step: number) => {
    // Content may have changed (e.g. an FAQ answer opened): search again before moving
    const found = matches.some(range => !range.startContainer.isConnected) ? findMatches(query.trim()) : matches;
    if (found !== matches) setMatches(found);
    if (found.length) setCurrent(index => (index + step + found.length) % found.length);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      move(event.shiftKey ? -1 : 1);
    } else if (event.key === 'Escape') {
      clear();
    }
  };

  const hasQuery = query.trim().length > 0;
  const floating = hasQuery && !inPlace;

  const clear = () => {
    setQuery('');
    inputRef.current?.blur();
  };

  return (
    // In-flow slot keeping the field's size, so the layout doesn't move while the field floats
    <div
      ref={slotRef}
      className="shrink-0"
      style={floating ? { width: slotSize.width, height: slotSize.height } : undefined}
    >
      <div
        ref={boxRef}
        role="search"
        data-in-page-search-ignore
        className={`flex items-center gap-space-3xs rounded-full pl-space-lg pr-space-2xs focus-within:ring-2 focus-within:ring-primary-lightest ${
          floating
            ? 'fixed top-space-sm right-space-md z-50 bg-canvas border border-line shadow-lg'
            : `relative ${bordered ? 'bg-canvas border border-line' : 'bg-surface-muted'}`
        }`}
      >
        <Search
          className="w-4 h-4 text-copy-muted absolute left-space-xs top-1/2 -translate-y-1/2"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-40 py-space-2xs bg-transparent border-none outline-none text-caption text-copy placeholder:text-copy-muted"
        />
        {hasQuery && (
          <>
            <span className="text-caption text-copy-muted whitespace-nowrap" aria-live="polite">
              {matches.length ? `${current + 1}/${matches.length}` : '0/0'}
            </span>
            <button
              type="button"
              onClick={() => move(-1)}
              disabled={!matches.length}
              aria-label="Previous match"
              className="flex p-0 bg-transparent border-none text-copy-muted hover:text-primary disabled:opacity-40 cursor-pointer"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              disabled={!matches.length}
              aria-label="Next match"
              className="flex p-0 bg-transparent border-none text-copy-muted hover:text-primary disabled:opacity-40 cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={clear}
              aria-label="Clear search"
              className="flex p-0 bg-transparent border-none text-copy-muted hover:text-primary cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default InPageSearch;
