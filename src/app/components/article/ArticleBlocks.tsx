import { ContentElement } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { ArticleModel } from '@/types/models';
import { renderContent } from '@/utilities/content';
import { ArticleBlock, parseNumberedCards } from '@/utilities/articleBlocks';
import KeyPoints from './KeyPoints';
import PullQuote from './PullQuote';
import NumbersBox from './NumbersBox';
import CaseStudy from './CaseStudy';
import CtaBox from './CtaBox';
import FaqList from './FaqList';
import NumberedCards from './NumberedCards';

type ArticleBlocksProps = {
  blocks: ArticleBlock[];
  data: ArticleModel;
  // Typography of the plain content blocks
  bodyStyles: string;
  // Bold quotes (news releases)
  boldQuotes?: boolean;
};

// Plain body element; "01. Title. Text" tables become numbered cards.
const renderElement = (el: ContentElement, data: ArticleModel) => {
  if (el.nodeType === 'table') {
    const cards = parseNumberedCards(el);
    if (cards) return <NumberedCards key={el.attributes?.id ?? cards[0].title} cards={cards} />;
  }
  return renderContent(el, data, 'text');
};

// Renders the body of an article split by parseArticleBlocks: plain content + editorial blocks.
const ArticleBlocks = ({ blocks, data, bodyStyles, boldQuotes = false }: ArticleBlocksProps) => (
  <>
    {blocks.map((block, index) => {
      switch (block.type) {
        case 'content':
          return (
            <div key={index} className={bodyStyles}>
              {block.elements.map(el => renderElement(el, data))}
            </div>
          );
        case 'keyPoints':
          return <KeyPoints key={index} items={block.items} data={data} />;
        case 'quote':
          return <PullQuote key={index} quote={block.quote} source={block.source} data={data} bold={boldQuotes} />;
        case 'numbers':
          return <NumbersBox key={index} title={block.title} items={block.items} />;
        case 'caseStudy':
          return <CaseStudy key={index} title={block.title} elements={block.elements} data={data} />;
        case 'cta':
          return <CtaBox key={index} title={block.title} elements={block.elements} link={block.link} data={data} />;
        case 'faq':
          return (
            <FaqList
              key={index}
              id={block.id}
              title={block.title}
              items={block.items.map(item => ({
                question: item.question,
                answer: (
                  <div className="flex flex-col gap-space-xs">{item.answer.map(el => renderContent(el, data))}</div>
                ),
              }))}
            />
          );
      }
    })}
  </>
);

export default ArticleBlocks;
