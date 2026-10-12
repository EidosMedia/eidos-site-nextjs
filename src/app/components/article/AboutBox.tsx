import { ContentElement } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { ArticleModel } from '@/types/models';
import { renderContent } from '@/utilities/content';

type AboutBoxProps = {
  title: string;
  elements: ContentElement[];
  data: ArticleModel;
};

// "About Eidosmedia" boilerplate at the end of the article.
const AboutBox = ({ title, elements, data }: AboutBoxProps) => (
  <section className="px-space-xl flex flex-col gap-space-sm">
    <p className="text-body text-heading">{title}</p>
    <div className="flex flex-col gap-space-sm text-body text-copy-muted [&_p]:m-0 [&_a]:text-primary">
      {elements.map(el => renderContent(el, data))}
    </div>
  </section>
);

export default AboutBox;
