'use client';

import { useRef, useState, ReactNode } from 'react';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

type AccordionProps = {
  title: ReactNode;
  children: ReactNode;
};

export default function Accordion({ title, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border border-line rounded-xl hover:border-primary transition-colors">
      <button
        className="w-full flex justify-between items-center p-space-sm text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="font-semibold text-heading text-body pr-space-sm">{title}</div>
        <div className="flex-shrink-0 text-primary transition-transform duration-300">
          {isOpen ? <MinusIcon className="w-6 h-6" /> : <PlusIcon className="w-6 h-6" />}
        </div>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out"
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight ?? 1000}px` : '0px',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="px-space-sm pb-space-sm text-copy-muted text-body">{children}</div>
      </div>
    </div>
  );
}
