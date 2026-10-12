'use client';
import { ReactNode, useState } from 'react';
import { Plus, X } from 'lucide-react';

type FaqListProps = {
  id: string;
  title: string;
  // Answers are rendered server side (rich text) and passed in
  items: { question: string; answer: ReactNode }[];
};

// Numbered FAQ accordion (Q.01, Q.02, ...): each question opens independently.
const FaqList = ({ id, title, items }: FaqListProps) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const toggle = (index: number) =>
    setOpenItems(current => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  return (
    <section>
      {/* Same spacing as the body h2: margin above, the first question's padding below */}
      <h2 id={id} className="text-h3 font-light text-heading mt-space-md scroll-mt-space-lg">
        {title}
      </h2>
      <div className="divide-y divide-line">
        {items.map(({ question, answer }, index) => {
          const isOpen = openItems.has(index);
          const answerId = `${id}-answer-${index}`;
          return (
            <div key={question} className="py-space-md">
              <button
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                aria-controls={answerId}
                className="w-full flex items-start gap-space-sm bg-transparent border-none p-0 text-left cursor-pointer"
              >
                <span className="text-caption text-primary pt-space-3xs shrink-0">
                  Q.{String(index + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 text-body text-primary">{question}</span>
                <span
                  className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center transition-colors ${
                    isOpen ? 'bg-primary text-inverse' : 'bg-canvas border border-line text-primary'
                  }`}
                  aria-hidden="true"
                >
                  {isOpen ? <X className="w-4 h-4" strokeWidth={3} /> : <Plus className="w-4 h-4" strokeWidth={3} />}
                </span>
              </button>
              {isOpen && (
                <div
                  id={answerId}
                  className="pt-space-sm pl-space-2xl pr-space-2xl text-body-sm text-copy-muted [&_p]:m-0"
                >
                  {answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FaqList;
