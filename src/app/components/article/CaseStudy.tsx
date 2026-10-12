import { ContentElement } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { ArticleModel } from '@/types/models';
import { renderContent } from '@/utilities/content';

type CaseStudyProps = {
  title?: string;
  elements: ContentElement[];
  data: ArticleModel;
  label?: string;
};

// Boxed case study inside the article body.
const CaseStudy = ({ title, elements, data, label = 'Case study' }: CaseStudyProps) => (
  <section className="bg-surface-muted border border-line rounded-card shadow-lg p-space-2xl flex flex-col gap-space-sm">
    <p className="text-body text-primary mb-space-sm">{label}</p>
    {title && <h3 className="text-lead text-heading">{title}</h3>}
    <div className="flex flex-col gap-space-md text-body text-copy-muted [&_p]:m-0">
      {elements.map(el => renderContent(el, data))}
    </div>
  </section>
);

export default CaseStudy;
