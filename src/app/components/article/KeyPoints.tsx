import { ContentElement } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { Check } from 'lucide-react';
import { ArticleModel } from '@/types/models';
import { renderContent } from '@/utilities/content';

type KeyPointsProps = {
  items: ContentElement[];
  data: ArticleModel;
  title?: string;
};

// "Key points" box: checked list summarizing the article.
const KeyPoints = ({ items, data, title = 'Key points' }: KeyPointsProps) => (
  <section className="bg-surface-muted border border-line rounded-card p-space-lg">
    <p className="text-body uppercase text-primary mb-space-md">{title}</p>
    <ul className="flex flex-col gap-space-sm list-none m-0 p-0">
      {items.map((item, index) => (
        <li key={item.attributes?.id ?? index} className="flex items-start gap-space-xs text-body text-copy-muted">
          <Check className="w-5 h-5 shrink-0 mt-space-3xs text-primary-dark" strokeWidth={3} aria-hidden="true" />
          <div className="[&_p]:m-0">{(item.elements ?? []).map(child => renderContent(child, data))}</div>
        </li>
      ))}
    </ul>
  </section>
);

export default KeyPoints;
