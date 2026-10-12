import { ContentElement } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { ArticleModel } from '@/types/models';
import { renderContent } from '@/utilities/content';

type PullQuoteProps = {
  quote: ContentElement[];
  source?: string;
  data: ArticleModel;
  // Bold quote text (news releases); regular weight otherwise (Updater articles)
  bold?: boolean;
};

// Highlighted quotation with its source, marked by a quote sign and a primary vertical rule.
const PullQuote = ({ quote, source, data, bold = false }: PullQuoteProps) => (
  <figure className="flex gap-space-xl m-0 py-space-md">
    <div className="flex flex-col items-center gap-space-2xs shrink-0" aria-hidden="true">
      <span className="text-h1 leading-none font-black text-primary">&rdquo;</span>
      <span className="flex-1 w-1 rounded-full bg-primary" />
    </div>
    <div className="flex flex-col gap-space-md pt-space-sm">
      <blockquote className={`m-0 text-lead italic text-heading [&_p]:m-0 ${bold ? 'font-bold' : ''}`}>
        {quote.map(el => renderContent(el, data))}
      </blockquote>
      {source && <figcaption className="text-body text-copy-muted">{source}</figcaption>}
    </div>
  </figure>
);

export default PullQuote;
