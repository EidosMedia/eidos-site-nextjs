'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { Menu, X, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import type { MenuItem } from '@eidosmedia/neon-frontoffice-ts-sdk';
import Logo from './Logo';
import GetInTouchButton from './GetInTouchButton';
import SearchButton from './SearchButton';

export default function NavbarClient({ items, pathname }: { items: MenuItem[]; pathname: string | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mobileActiveIndex, setMobileActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isMenuOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const getItemPath = (item: MenuItem) => item.url || item.ref || '#';
  const isActiveLink = (item: MenuItem) => {
    const path = getItemPath(item);
    return path !== '#' && path.replace(/\/$/, '') === pathname?.replace(/\/$/, '');
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setMobileActiveIndex(null);
  };

  const mobileActiveItem = mobileActiveIndex !== null ? items[mobileActiveIndex] : null;
  const mobileHasGroups = mobileActiveItem?.items?.some(column => column.items?.length > 0) ?? false;

  const mobileLinkClasses = (isActive: boolean) =>
    clsx(
      'text-lead font-semibold text-primary no-underline hover:underline underline-offset-2 transition-colors',
      isActive && 'font-bold',
    );

  return (
    <nav className="w-full relative z-50 bg-canvas border-b border-line">
      {/* Backdrop blur behind the open mega menu; it also covers the nav row, so only the part inside the panel stays in focus */}
      <div
        className={clsx(
          'absolute inset-x-0 top-0 h-screen z-40 bg-canvas/50 backdrop-blur-md transition-opacity duration-200',
          openIndex !== null ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={() => setOpenIndex(null)}
      />

      <div
        className="relative max-w-page mx-auto px-space-md py-space-md md:py-0 flex items-center gap-x-space-sm"
        onMouseLeave={() => setOpenIndex(null)}
      >
        {/* Nav row content sits above the open panel (z-45), which extends up behind it */}
        <div className="relative z-50 flex items-center h-full">
          <Logo />
        </div>

        {/* Desktop nav items */}
        <div className="relative z-50 hidden md:flex items-center h-full">
          <ul className="flex list-none m-0 p-0 h-full">
            {items.map((item, index) => (
              <li
                key={`${getItemPath(item)}-${index}`}
                className="group static h-24 flex items-center"
                onMouseEnter={() => setOpenIndex(item.items?.length > 0 ? index : null)}
              >
                {item.items?.length > 0 ? (
                  <span
                    className={clsx(
                      'no-underline h-full flex items-center gap-space-3xs px-space-2xs cursor-pointer transition-colors',
                      openIndex === index
                        ? 'text-heading'
                        : openIndex !== null
                          ? 'text-copy-muted'
                          : 'text-heading group-hover:text-primary',
                    )}
                  >
                    <p className="text-body m-0">{item.label}</p>
                    <ChevronDown
                      className={clsx(
                        'w-4 h-4 transition-[transform,color] duration-200',
                        openIndex === index ? 'text-primary rotate-180' : 'text-copy-muted',
                      )}
                    />
                  </span>
                ) : (
                  <Link
                    href={getItemPath(item)}
                    className={clsx(
                      'no-underline h-full flex items-center px-space-2xs cursor-pointer transition-colors',
                      openIndex !== null
                        ? 'text-copy-muted'
                        : isActiveLink(item)
                          ? 'font-bold text-heading'
                          : 'text-heading hover:text-primary',
                    )}
                  >
                    <p className="text-body m-0">{item.label}</p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Mega menu panels: 1260px panel centered on the nav row; content (max-w-page) aligns with the nav items, right after the logo.
            The panel starts at the top of the nav and runs behind the nav row, so nav and dropdown read as one focused card */}
        {items.map((item, index) => {
          if (!(item.items?.length > 0)) return null;
          const hasGroups = item.items.some(column => column.items?.length > 0);
          const linkClasses = (isActive: boolean) =>
            clsx(
              'text-body font-semibold text-primary no-underline hover:underline underline-offset-2 transition-colors',
              isActive && 'font-bold',
            );

          return (
            <div
              key={`dropdown-${getItemPath(item)}-${index}`}
              className={clsx(
                'absolute top-0 left-1/2 -translate-x-1/2 w-screen max-w-dropdown z-45 bg-canvas shadow-xl overflow-hidden rounded-xl transition-opacity duration-200',
                openIndex === index ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
              )}
            >
              {/* Same height as the nav row (li h-24) plus its bottom border, which this redraws inside the panel */}
              <div className="h-24 box-content border-b border-line" />
              {/* Vertical padding lives on the columns, so the column dividers span the full panel height */}
              <div className="max-w-page mx-auto px-space-md flex gap-x-space-sm">
                {/* Spacer as wide as the logo plus the nav items' px-space-2xs, so content lines up with the first nav label */}
                <div className="invisible pointer-events-none shrink-0 flex items-center pr-space-2xs" aria-hidden="true">
                  <Logo />
                </div>

                {hasGroups ? (
                  <div className="flex-1 flex gap-x-space-xl divide-x divide-line">
                    {item.items.map((column, colIndex) => (
                      <div key={`${getItemPath(column)}-${colIndex}`} className={clsx('min-w-50 flex-1 py-space-xl', colIndex > 0 && 'pl-space-xl')}>
                        {column.items?.length > 0 ? (
                          <>
                            <p className="eyebrow text-heading mb-space-sm">
                              {column.label}
                            </p>
                            <div className="flex flex-col gap-space-xs">
                              {column.items.map((link, linkIndex) => (
                                <Link
                                  key={`${getItemPath(link)}-${linkIndex}`}
                                  href={getItemPath(link)}
                                  onClick={() => setOpenIndex(null)}
                                  className={linkClasses(isActiveLink(link))}
                                >
                                  {link.label}
                                </Link>
                              ))}
                            </div>
                          </>
                        ) : (
                          <Link
                            href={getItemPath(column)}
                            onClick={() => setOpenIndex(null)}
                            className={linkClasses(isActiveLink(column))}
                          >
                            {column.label}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col gap-space-xs py-space-xl">
                    {item.items.map((link, linkIndex) => (
                      <Link
                        key={`${getItemPath(link)}-${linkIndex}`}
                        href={getItemPath(link)}
                        onClick={() => setOpenIndex(null)}
                        className={linkClasses(isActiveLink(link))}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div className="hidden md:block flex-1" />

        {/* Desktop Right Side */}
        <div className="relative z-50 hidden md:flex items-center gap-space-xs">
          <SearchButton iconOnly />
          <GetInTouchButton />
        </div>

        {/* Mobile menu button */}
        <div className="relative z-50 flex-1 md:hidden flex items-center justify-end">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="w-10 h-10 rounded-lg bg-ink hover:bg-ink-deep flex items-center justify-center border-none cursor-pointer transition-colors shrink-0"
            aria-label="Open Menu"
          >
            <Menu className="w-5 h-5 text-inverse" />
          </button>
        </div>
      </div>

      {/* Mobile Fullscreen Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-canvas z-[100] flex flex-col md:hidden h-screen w-full">
          <div className="container mx-auto py-space-md px-space-md flex justify-between items-center shrink-0">
            {mobileActiveItem ? (
              <button
                onClick={() => setMobileActiveIndex(null)}
                className="border-none bg-transparent cursor-pointer p-0 flex items-center gap-space-3xs text-lead font-medium text-heading"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            ) : (
              <Logo />
            )}
            <button
              onClick={closeMobileMenu}
              className="w-10 h-10 rounded-lg bg-surface hover:bg-line flex items-center justify-center border-none cursor-pointer transition-colors shrink-0"
              aria-label="Close Menu"
            >
              <X className="w-5 h-5 text-heading" />
            </button>
          </div>

          <div className="container mx-auto px-space-md flex-1 overflow-y-auto">
            {mobileActiveItem ? (
              <>
                {mobileHasGroups ? (
                  <div className="flex flex-col gap-space-lg pt-space-md pb-space-md">
                    {mobileActiveItem.items.map((column, colIndex) => (
                      <div key={`${getItemPath(column)}-${colIndex}`} className="flex flex-col gap-space-xs">
                        {column.items?.length > 0 ? (
                          <>
                            <p className="eyebrow text-heading m-0 pb-space-xs border-b border-line">
                              {column.label}
                            </p>
                            {column.items.map((link, linkIndex) => (
                              <Link
                                key={`${getItemPath(link)}-${linkIndex}`}
                                href={getItemPath(link)}
                                onClick={closeMobileMenu}
                                className={mobileLinkClasses(isActiveLink(link))}
                              >
                                {link.label}
                              </Link>
                            ))}
                          </>
                        ) : (
                          <Link
                            href={getItemPath(column)}
                            onClick={closeMobileMenu}
                            className={mobileLinkClasses(isActiveLink(column))}
                          >
                            {column.label}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-space-xs py-space-md">
                    {mobileActiveItem.items.map((link, linkIndex) => (
                      <Link
                        key={`${getItemPath(link)}-${linkIndex}`}
                        href={getItemPath(link)}
                        onClick={closeMobileMenu}
                        className={mobileLinkClasses(isActiveLink(link))}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}

                <div className="border-t border-line py-space-md flex justify-center">
                  <SearchButton onClick={closeMobileMenu} />
                </div>
              </>
            ) : (
              <>
                <ul className="flex flex-col divide-y divide-line list-none m-0 p-0 py-space-md">
                  {items.map((item, index) => (
                    <li key={`${getItemPath(item)}-${index}`} className="py-space-md first:pt-0 last:pb-0">
                      {item.items?.length > 0 ? (
                        <button
                          onClick={() => setMobileActiveIndex(index)}
                          className="w-full border-none bg-transparent cursor-pointer p-0 flex items-center justify-between text-left"
                        >
                          <span className="text-h3 font-normal text-heading">{item.label}</span>
                          <ChevronRight className="w-5 h-5 text-primary shrink-0" />
                        </button>
                      ) : (
                        <Link
                          href={getItemPath(item)}
                          onClick={closeMobileMenu}
                          className={clsx(
                            'text-h3 no-underline block',
                            isActiveLink(item) ? 'font-bold text-heading' : 'font-normal text-heading',
                          )}
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="border-t border-line py-space-md flex justify-center">
                  <SearchButton onClick={closeMobileMenu} />
                </div>
              </>
            )}
          </div>

          <div className="container mx-auto px-space-md py-space-md flex justify-center shrink-0">
            <GetInTouchButton />
          </div>
        </div>
      )}
    </nav>
  );
}
