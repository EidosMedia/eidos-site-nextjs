import Link from 'next/link';
import { ContentElement } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { ChevronRight } from 'lucide-react';
import { ArticleModel } from '@/types/models';
import { renderContent } from '@/utilities/content';

type CtaBoxProps = {
  title?: string;
  elements: ContentElement[];
  link?: { href: string; label: string };
  data: ArticleModel;
};

// Call to action box (e.g. "Download Complete Report") inside the article body.
const CtaBox = ({ title, elements, link, data }: CtaBoxProps) => (
  <section className="bg-canvas border border-line rounded-card shadow-lg p-space-2xl flex flex-col items-center gap-space-sm text-center">
    {title && <h3 className="text-h3 font-light text-heading">{title}</h3>}
    <div className="text-body text-copy [&_p]:m-0">{elements.map(el => renderContent(el, data))}</div>
    {link && (
      <Link
        href={link.href}
        className="mt-space-md inline-flex items-center gap-space-sm rounded-full bg-primary hover:bg-primary-hover text-inverse text-body px-space-lg py-space-xs no-underline shadow-lg transition-colors"
      >
        {link.label}
        <ChevronRight className="w-4 h-4" strokeWidth={3} aria-hidden="true" />
      </Link>
    )}
  </section>
);

export default CtaBox;
