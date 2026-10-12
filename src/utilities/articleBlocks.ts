import { ContentElement } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { extractPlainText, slugify } from '@/utilities/content';

// Splits the body ("text" element) of an article into plain content and editorial blocks
// (key points, quote, numbers, case study, call to action, FAQ, author, About Eidosmedia).
//
// Editors mark a block in Neon with a "marker" paragraph whose whole text is the block name
// (bold or not, case insensitive), followed by the block content:
//   Key points               → bulleted list
//   Quote                    → quote paragraph, optional source paragraph
//   Numbers: <title>         → bulleted list, one "<value> <label>" per item (e.g. "73% of newsrooms ...")
//   Case study               → title (heading or bold paragraph) + paragraphs
//   CTA                      → title + text + a paragraph with the link (rendered as button)
//   About the author         → photo (optional) + name + role + bio paragraphs
// Blocks end at the next separator (a "____" paragraph or hr), the next h2 or the next marker.
// Also detected without marker: a native blockquote (quote), a heading starting with "FAQ"
// (questions = following headings / bold paragraphs / lines ending with "?") and a heading
// starting with "About Eidosmedia".

export type FaqItem = { question: string; answer: ContentElement[] };

export type ArticleBlock =
  | { type: 'content'; elements: ContentElement[] }
  | { type: 'keyPoints'; items: ContentElement[] }
  | { type: 'quote'; quote: ContentElement[]; source?: string }
  | { type: 'numbers'; title?: string; items: { value: string; label: string }[] }
  | { type: 'caseStudy'; title?: string; elements: ContentElement[] }
  | { type: 'cta'; title?: string; elements: ContentElement[]; link?: { href: string; label: string } }
  | { type: 'faq'; id: string; title: string; items: FaqItem[] };

export type ArticleAuthor = { name?: string; role?: string; photoUrl?: string; bio: ContentElement[] };

export type ParsedArticle = {
  blocks: ArticleBlock[];
  headings: { id: string; text: string }[];
  author?: ArticleAuthor;
  about?: { title: string; elements: ContentElement[] };
};

type Marker = 'key points' | 'quote' | 'numbers' | 'case study' | 'cta' | 'about the author';

const text = (el?: ContentElement) => (el ? extractPlainText(el).trim() : '');
const isHeading = (el?: ContentElement) => !!el && /^h[1-6]$/.test(el.nodeType);
const headingLevel = (el: ContentElement) => parseInt(el.nodeType.substring(1), 10);
const isBoldParagraph = (el?: ContentElement) =>
  el?.nodeType === 'p' &&
  (el.elements ?? []).filter(child => text(child)).every(child => ['strong', 'b'].includes(child.nodeType)) &&
  !!text(el);
const isSeparator = (el?: ContentElement) =>
  el?.nodeType === 'hr' || (el?.nodeType === 'p' && /^_{3,}$/.test(text(el)));
const isEmptyParagraph = (el: ContentElement) =>
  el.nodeType === 'p' && !text(el) && !el.elements?.some(c => c.nodeType !== 'plainText');

const getMarker = (el?: ContentElement): { marker: Marker; suffix?: string } | undefined => {
  if (!el || (el.nodeType !== 'p' && !isHeading(el))) return undefined;
  const value = text(el).replace(/:$/, '');
  const lower = value.toLowerCase();
  if (lower === 'key points') return { marker: 'key points' };
  if (lower === 'quote') return { marker: 'quote' };
  if (lower === 'case study') return { marker: 'case study' };
  if (lower === 'cta' || lower === 'call to action') return { marker: 'cta' };
  if (lower === 'about the author') return { marker: 'about the author' };
  if (lower === 'numbers' || lower.startsWith('numbers:')) {
    return { marker: 'numbers', suffix: value.substring('numbers'.length).replace(/^:\s*/, '') || undefined };
  }
  return undefined;
};

const isBlockEnd = (el?: ContentElement) =>
  !el || isSeparator(el) || el.nodeType === 'h2' || !!getMarker(el) || isFaqHeading(el) || isAboutHeading(el);
const isFaqHeading = (el?: ContentElement) =>
  isHeading(el) &&
  (text(el).toLowerCase().startsWith('faq') || text(el).toLowerCase().includes('frequently asked questions'));
const isAboutHeading = (el?: ContentElement) =>
  (isHeading(el) || isBoldParagraph(el)) && text(el).toLowerCase().startsWith('about eidosmedia');

const findImageSrc = (el: ContentElement): string | undefined => {
  const images = (el.elements ?? []).filter(child => child.nodeType.startsWith('image'));
  const image = images.find(img => img.attributes?.softcropenabled === 'enabled-preferred') ?? images[0];
  return image?.attributes?.src ?? undefined;
};

const findLink = (el: ContentElement): { href: string; label: string } | undefined => {
  if (el.nodeType === 'anchor') return { href: el.attributes?.href || '#', label: text(el) };
  for (const child of el.elements ?? []) {
    const link = findLink(child);
    if (link) return link;
  }
  return undefined;
};

// Splits a block into its title (first heading or bold paragraph) and the rest
const splitTitle = (elements: ContentElement[]) => {
  const index = elements.findIndex(el => isHeading(el) || isBoldParagraph(el));
  if (index === -1) return { title: undefined, rest: elements };
  return { title: text(elements[index]), rest: elements.filter((_, i) => i !== index) };
};

// FAQ written as a (numbered) list: in each item the question is the text before the first line break
// (or the first paragraph), the answer is the rest.
const faqItemFromListItem = (li: ContentElement): FaqItem | undefined => {
  const children = li.elements ?? [];
  const paragraphs = children.filter(child => child.nodeType === 'p');
  if (paragraphs.length > 0) {
    const [question, ...answer] = paragraphs;
    return text(question) ? { question: text(question), answer } : undefined;
  }
  const breakIndex = children.findIndex(child => child.nodeType === 'br');
  const questionNodes = breakIndex === -1 ? children : children.slice(0, breakIndex);
  const answerNodes =
    breakIndex === -1
      ? []
      : children.slice(breakIndex).filter((child, i, rest) => {
          // drop the line breaks separating question and answer
          const firstContent = rest.findIndex(node => node.nodeType !== 'br');
          return i >= firstContent;
        });
  const question = questionNodes
    .map(node => extractPlainText(node))
    .join('')
    .trim();
  if (!question) return undefined;
  const answer: ContentElement[] = answerNodes.length
    ? [{ nodeType: 'p', attributes: {}, elements: answerNodes, value: '' } as ContentElement]
    : [];
  return { question, answer };
};

const parseFaq = (heading: ContentElement, elements: ContentElement[]): ArticleBlock => {
  const items: FaqItem[] = [];
  elements.forEach(el => {
    if (el.nodeType === 'ol' || el.nodeType === 'ul') {
      (el.elements ?? [])
        .filter(li => li.nodeType === 'li')
        .map(faqItemFromListItem)
        .forEach(item => item && items.push(item));
      return;
    }
    const isQuestion =
      (isHeading(el) && headingLevel(el) > headingLevel(heading)) || isBoldParagraph(el) || text(el).endsWith('?');
    if (isQuestion) items.push({ question: text(el), answer: [] });
    else if (items.length > 0) items[items.length - 1].answer.push(el);
  });
  return { type: 'faq', id: slugify(text(heading)), title: text(heading), items };
};

const stripDash = (value: string) => value.replace(/^[—–-]\s*/, '');

// Native blockquote: either paragraphs (the last one starting with a dash is the source), or inline
// text where the source follows a line break ("“Quote…”<br>Name, Role").
const parseBlockquote = (el: ContentElement): ArticleBlock => {
  const children = el.elements ?? [];
  const paragraphs = children.filter(child => child.nodeType === 'p' && text(child));
  if (paragraphs.length > 0) {
    const last = paragraphs[paragraphs.length - 1];
    const hasSource = paragraphs.length > 1 && /^[—–-]/.test(text(last));
    return {
      type: 'quote',
      quote: hasSource ? paragraphs.slice(0, -1) : paragraphs,
      source: hasSource ? stripDash(text(last)) : undefined,
    };
  }
  const breakIndex = children.findIndex(child => child.nodeType === 'br');
  const quoteNodes = breakIndex === -1 ? children : children.slice(0, breakIndex);
  const sourceText =
    breakIndex === -1
      ? ''
      : children
          .slice(breakIndex)
          .map(node => extractPlainText(node))
          .join('')
          .trim();
  return {
    type: 'quote',
    quote: [{ nodeType: 'p', attributes: {}, elements: quoteNodes, value: '' } as ContentElement],
    source: sourceText ? stripDash(sourceText) : undefined,
  };
};

export type NumberedCard = { number: string; title: string; text: string };

// A table whose cells all read "01. Title. Text…" is rendered as a grid of numbered cards.
// Returns undefined for any other table (rendered as a plain table).
export const parseNumberedCards = (table: ContentElement): NumberedCard[] | undefined => {
  const cells = (table.elements ?? [])
    .flatMap(row => (row.nodeType === 'tbody' || row.nodeType === 'thead' ? (row.elements ?? []) : [row]))
    .flatMap(row => (row.nodeType === 'tr' ? (row.elements ?? []) : []))
    .filter(cell => ['td', 'th'].includes(cell.nodeType))
    .map(cell => text(cell))
    .filter(Boolean);
  if (cells.length === 0) return undefined;
  const cards = cells.map(cell => cell.match(/^(\d+)[.)]\s+(.+?[.?!:])\s+([\s\S]+)$/));
  if (cards.some(match => !match)) return undefined;
  return cards.map(match => ({ number: match![1].padStart(2, '0'), title: match![2], text: match![3] }));
};

export const parseArticleBlocks = (textElement?: ContentElement, bylineName?: string): ParsedArticle => {
  const elements = (textElement?.elements ?? []).filter(el => !isEmptyParagraph(el));
  const blocks: ArticleBlock[] = [];
  let author: ArticleAuthor | undefined;
  let about: ParsedArticle['about'];
  let content: ContentElement[] = [];

  const flush = () => {
    if (content.length > 0) blocks.push({ type: 'content', elements: content });
    content = [];
  };
  // Elements after `start` up to the end of the block
  const collect = (start: number, until: (el?: ContentElement) => boolean = isBlockEnd) => {
    let end = start;
    while (end < elements.length && !until(elements[end])) end++;
    return { items: elements.slice(start, end), next: end };
  };

  let i = 0;
  while (i < elements.length) {
    const el = elements[i];
    const marker = getMarker(el);

    if (isSeparator(el)) {
      flush();
      i++;
      continue;
    }

    if (marker?.marker === 'key points' && elements[i + 1]?.nodeType === 'ul') {
      flush();
      blocks.push({ type: 'keyPoints', items: (elements[i + 1].elements ?? []).filter(li => li.nodeType === 'li') });
      i += 2;
      continue;
    }

    if (marker?.marker === 'numbers' && elements[i + 1]?.nodeType === 'ul') {
      flush();
      const items = (elements[i + 1].elements ?? [])
        .filter(li => li.nodeType === 'li')
        .map(li => {
          const [value, ...label] = text(li).split(/\s+/);
          return { value, label: label.join(' ') };
        });
      blocks.push({ type: 'numbers', title: marker.suffix, items });
      i += 2;
      continue;
    }

    if (marker && ['quote', 'case study', 'cta', 'about the author'].includes(marker.marker)) {
      flush();
      const { items, next } = collect(i + 1);
      if (marker.marker === 'quote') {
        const [quote, source] = items;
        if (quote)
          blocks.push({
            type: 'quote',
            quote: [quote],
            source: source ? text(source).replace(/^[—–-]\s*/, '') : undefined,
          });
      } else if (marker.marker === 'case study') {
        const { title, rest } = splitTitle(items);
        blocks.push({ type: 'caseStudy', title, elements: rest });
      } else if (marker.marker === 'cta') {
        const { title, rest } = splitTitle(items);
        const linkParagraph = rest.find(item => findLink(item));
        blocks.push({
          type: 'cta',
          title,
          elements: rest.filter(item => item !== linkParagraph),
          link: linkParagraph ? findLink(linkParagraph) : undefined,
        });
      } else {
        const photo = items.find(item => item.nodeType === 'inline-media-group');
        const paragraphs = items.filter(item => item.nodeType === 'p' && text(item));
        // Name: the article byline, otherwise the first bold paragraph; role: the short line after it
        const nameParagraph = bylineName ? undefined : paragraphs.find(isBoldParagraph);
        const afterName = paragraphs.filter(p => p !== nameParagraph);
        const roleParagraph =
          afterName[0] && text(afterName[0]).length <= 80 && afterName.length > 1 ? afterName[0] : undefined;
        author = {
          name: bylineName || (nameParagraph && text(nameParagraph)),
          role: roleParagraph && text(roleParagraph),
          photoUrl: photo && findImageSrc(photo),
          bio: afterName.filter(p => p !== roleParagraph),
        };
      }
      i = next;
      continue;
    }

    if (el.nodeType === 'blockquote') {
      flush();
      blocks.push(parseBlockquote(el));
      i++;
      continue;
    }

    if (isFaqHeading(el)) {
      flush();
      const level = headingLevel(el);
      const { items, next } = collect(
        i + 1,
        item => !item || isSeparator(item) || (isHeading(item) && headingLevel(item) <= level) || isAboutHeading(item),
      );
      blocks.push(parseFaq(el, items));
      i = next;
      continue;
    }

    if (isAboutHeading(el)) {
      flush();
      const { items, next } = collect(i + 1, item => !item || isSeparator(item));
      about = { title: text(el), elements: items };
      i = next;
      continue;
    }

    content.push(el);
    i++;
  }
  flush();

  const headings = blocks.flatMap(block => {
    if (block.type === 'faq') return [{ id: block.id, text: block.title }];
    if (block.type !== 'content') return [];
    return block.elements
      .filter(el => el.nodeType === 'h2')
      .map(el => ({ id: slugify(text(el)), text: text(el) }))
      .filter(heading => heading.id);
  });

  return { blocks, headings, author, about };
};
