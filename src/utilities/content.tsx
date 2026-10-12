import Figure from '@/app/components/contentElements/Figure';
import { REACT_ATTRIBUTE_NAMES, isCmsOnlyAttribute } from '@/utilities/attributes';
import Accordion from '@/app/components/baseComponents/Accordion';
import { ContentElement, PageData } from '@eidosmedia/neon-frontoffice-ts-sdk';
import Link from 'next/link';
import { JSX, ReactNode } from 'react';
import { ArticleModel } from '@/types/models';
import ContentEditable from '@/app/components/utilities/ContentEditable';

/**
 *
 * @param elementNames
 * @param json
 */
export function extractPlainText(node: ContentElement): string {
  if (!node) return '';
  if (node.nodeType === 'plainText') return node.value || '';
  if (!node.elements) return '';
  return node.elements.map(extractPlainText).join('');
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function findElementsInContentJson(elementNames: string | string[], json: ContentElement): ContentElement[] {
  if ((Array.isArray(elementNames) && elementNames.includes(json?.nodeType)) || elementNames === json?.nodeType) {
    return [json];
  }
  if (json?.elements) {
    return json.elements.reduce(
      (acc: ContentElement[], elem: ContentElement) => [...acc, ...findElementsInContentJson(elementNames, elem)],
      [],
    );
  }
  return [];
}

export const findText = (node: ContentElement): ReactNode => {
  if (node.nodeType === 'plainText') {
    return node.value;
  }
  return node.elements.map(elem => findText(elem)).join('');
};

/**
 * Identifica il provider da un URL di oembed
 */
const identifyOembedProvider = (url: string): string | null => {
  if (!url) return null;

  // YouTube patterns
  if (/(?:youtube\.com|youtu\.be)/i.test(url)) {
    return 'youtube';
  }

  // Altri provider possono essere aggiunti qui
  // if (/vimeo\.com/i.test(url)) return 'vimeo';
  // if (/twitter\.com|x\.com/i.test(url)) return 'twitter';

  return null;
};

/**
 * Estrae attributi dall'HTML dell'iframe (width, height, style)
 */
const extractIframeAttributes = (
  iframeHtml: string,
): {
  width?: string;
  height?: string;
  style?: string;
} => {
  const attrs: { width?: string; height?: string; style?: string } = {};

  // Estrai width
  const widthMatch = iframeHtml.match(/width=["']?(\d+)["']?/i);
  if (widthMatch) attrs.width = widthMatch[1];

  // Estrai height
  const heightMatch = iframeHtml.match(/height=["']?(\d+)["']?/i);
  if (heightMatch) attrs.height = heightMatch[1];

  // Estrai style
  const styleMatch = iframeHtml.match(/style=["']([^"']*)["']/i);
  if (styleMatch) attrs.style = styleMatch[1];

  return attrs;
};

/**
 * Estrae video ID da URL YouTube
 */
const extractYoutubeId = (url: string): string | null => {
  const patterns = [/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/, /youtube\.com\/embed\/([^&\n?#]+)/];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
};

/**
 * Renderizza un blocco oembed con personalizzazioni per provider
 */
const renderOembedBlock = (content: ContentElement, key: string): ReactNode => {
  const oembedUrl = content.attributes?.oembed;
  const provider = identifyOembedProvider(oembedUrl);
  const iframeHtml = content.elements?.[0]?.value || '';
  const iframeAttrs = extractIframeAttributes(iframeHtml);

  // YouTube: rendering personalizzato
  if (provider === 'youtube') {
    const videoId = extractYoutubeId(oembedUrl);
    if (videoId) {
      const customStyle = 'aspect-ratio: 2; width: 100%; max-width: 100%; height: auto;';

      return (
        <div key={key} data-type="oembedblock" data-provider="youtube" {...buildAttributes(content)}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?wmode=transparent`}
            allowFullScreen
            style={convertStyleToObject(customStyle)}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      );
    }
  }

  // Default: mantieni rendering originale per provider non gestiti
  return (
    <div key={key} {...buildAttributes(content)} data-type="oembedblock" data-provider={provider || 'unknown'}>
      <div dangerouslySetInnerHTML={{ __html: iframeHtml }} />
    </div>
  );
};

/**
 * Selects the first image/graphic element from the list following prioritization logic:
 * 1. First element with softcropenabled="enabled-preferred"
 * 2. First element with softcropenabled="enabled"
 * 3. First available element
 */
const selectPreferredElement = (elements: ContentElement[], nodeTypePrefix: string): ContentElement | undefined => {
  const filteredElements = elements.filter(elem => elem.nodeType.startsWith(nodeTypePrefix));

  if (filteredElements.length === 0) return undefined;

  // 1. Look for the first "enabled-preferred"
  const preferredElement = filteredElements.find(elem => elem.attributes?.softcropenabled === 'enabled-preferred');
  if (preferredElement) return preferredElement;

  // 2. Look for the first "enabled"
  const enabledElement = filteredElements.find(elem => elem.attributes?.softcropenabled === 'enabled');
  if (enabledElement) return enabledElement;

  // 3. Return the first available
  return filteredElements[0];
};

export const buildAttributes = (node: ContentElement): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(node.attributes || {})
      .filter(([key]) => !isCmsOnlyAttribute(key))
      .map(([key, value]) => [
        REACT_ATTRIBUTE_NAMES[key] ?? key,
        key === 'style' ? convertStyleToObject(value) : value,
      ]),
  );
};

export const renderContent = (
  content: ContentElement,
  data?: ArticleModel,
  parent?: string,
  styles?: string,
): ReactNode => {
  const key = content?.attributes?.id || new Date().toISOString() + Math.random().toString(36).substring(2, 15);

  switch (content.nodeType) {
    case 'headline':
      return (
        <ContentEditable key={key} data={data}>
          <h1 key={key} data-type="headline" {...buildAttributes(content)}>
            {content.elements.map(elem => renderContent(elem, data))}
          </h1>
        </ContentEditable>
      );
    case 'overhead':
      return (
        <ContentEditable key={key} data={data}>
          <h5 key={key} data-type="overhead" {...buildAttributes(content)} className="uppercase">
            {content.elements.map(elem => renderContent(elem, data))}
          </h5>
        </ContentEditable>
      );
    case 'grouphead':
      return (
        <div key={key} {...buildAttributes(content)} className={styles} data-type="grouphead">
          {content.elements
            .filter(elem => elem)
            .map(elem => {
              console.log('Grouphead Element:', elem);
              return renderContent(elem, data);
            })}
        </div>
      );
    case 'byline':
      return (
        <div key={key} data-type="byline" {...buildAttributes(content)} className={styles}>
          {content.elements.map(elem => renderContent(elem, data))}
        </div>
      );
    case 'text':
      const textElements: ReactNode[] = [];
      const incomingElements = content.elements || [];

      const isHeading = (elem: any) => /^h[1-6]$/.test(elem?.nodeType);
      const groups: any[][] = [];
      let currentGroup: any[] = [];

      for (let i = 0; i < incomingElements.length; i++) {
        const elem = incomingElements[i];

        // Detect "KEY POINTS" inside paragraph
        const isKeyPointsTitle =
          elem.nodeType === 'p' &&
          elem.elements?.length === 1 &&
          elem.elements[0].nodeType === 'strong' &&
          elem.elements[0].elements?.[0]?.value?.trim().toUpperCase() === 'KEY POINTS';

        if (isKeyPointsTitle && incomingElements[i + 1]?.nodeType === 'ul') {
          if (currentGroup.length > 0) {
            groups.push(currentGroup);
            currentGroup = [];
          }
          groups.push([elem, incomingElements[i + 1]]);
          i++; // Skip rendering the ul normally
          continue;
        }

        if (isHeading(elem)) {
          if (currentGroup.length > 0) {
            groups.push(currentGroup);
          }
          currentGroup = [elem];
        } else {
          currentGroup.push(elem);
        }
      }

      if (currentGroup.length > 0) {
        groups.push(currentGroup);
      }

      let inFaqSection = false;
      let faqHeadingLevel = 2;
      let faqBuffer: React.ReactElement[] = [];

      const flushFaqBuffer = () => {
        if (faqBuffer.length > 0) {
          textElements.push(
            <div key={`faq-section-${textElements.length}`} className="flex flex-col gap-space-sm mb-space-2xl">
              {faqBuffer}
            </div>,
          );
          faqBuffer = [];
        }
      };

      groups.forEach((group, gIndex) => {
        const first = group[0];
        const isKeyPointsTitle =
          first?.nodeType === 'p' &&
          first.elements?.length === 1 &&
          first.elements[0].nodeType === 'strong' &&
          first.elements[0].elements?.[0]?.value?.trim().toUpperCase() === 'KEY POINTS';

        const plainTitle = extractPlainText(first).trim().toLowerCase();
        const isHeadingNode = /^h[1-6]$/.test(first?.nodeType);
        const isFaqTitle =
          isHeadingNode && (plainTitle.startsWith('faq') || plainTitle.includes('frequently asked questions'));

        if (isFaqTitle) {
          inFaqSection = true;
          faqHeadingLevel = parseInt(first.nodeType.substring(1), 10);
          textElements.push(
            <div key={`text-group-${gIndex}`} className="flex flex-col gap-space-sm">
              {group.map((elem, i) => renderContent(elem, data, 'text'))}
            </div>,
          );
          return;
        }

        if (inFaqSection) {
          const isStrongParagraph = first?.nodeType === 'p' && !!first.elements?.find((e: ContentElement) => e.nodeType === 'strong');
          const isSubHeading = isHeadingNode && parseInt(first.nodeType.substring(1), 10) > faqHeadingLevel;
          const isQuestionHeading = isSubHeading || isStrongParagraph || plainTitle.endsWith('?');

          if (isHeadingNode && parseInt(first.nodeType.substring(1), 10) <= faqHeadingLevel) {
            inFaqSection = false;
            flushFaqBuffer();
          } else if (isQuestionHeading) {
            const questionTitle = extractPlainText(first);
            const answerElements = group.slice(1).map((elem, i) => renderContent(elem, data, 'text'));
            faqBuffer.push(
              <Accordion key={`faq-item-${gIndex}`} title={questionTitle}>
                <div className="flex flex-col gap-space-sm">{answerElements}</div>
              </Accordion>,
            );
            return;
          }
        }

        if (isKeyPointsTitle && group.length === 2 && group[1].nodeType === 'ul') {
          textElements.push(
            <div key={`keypoints-${gIndex}`} className="bg-primary-lightest rounded-xl border border-line p-space-lg mb-space-2xl">
              <h3 className="uppercase font-bold tracking-wide text-primary mb-space-md text-lead">KEY POINTS</h3>
              <div className="text-copy text-lead [&_ul]:list-disc [&_ul]:pl-0 [&_li]:mb-space-sm [&_li::marker]:text-copy-muted [&_p]:mb-space-sm">
                {renderContent(group[1], data, undefined, '')}
              </div>
            </div>,
          );
        } else {
          textElements.push(
            <div key={`text-group-${gIndex}`} className="flex flex-col gap-space-sm mb-space-2xl last:mb-0">
              {group.map((elem, i) => renderContent(elem, data, 'text'))}
            </div>,
          );
        }
      });

      flushFaqBuffer();

      return (
        <div id="text" key={key} {...buildAttributes(content)} className={styles} data-type="text">
          {textElements}
        </div>
      );
    case 'caption':
      return (
        <figcaption key={key} {...buildAttributes(content)} className="body-large italic" data-type="caption">
          {content.elements.map(elem => renderContent(elem, data))}
        </figcaption>
      );
    case 'credit':
      return (
        <span key={key} data-type="credit" {...buildAttributes(content)} className="body-large italic text-copy-muted">
          {content.elements.map(elem => renderContent(elem, data))}
        </span>
      );
    case 'p':
      if (parent === 'text') {
        return data?.id ? (
          <ContentEditable key={key} data={data}>
            <p key={key} {...buildAttributes(content)} className={`${styles} body-large`}>
              {content.elements.map(elem => renderContent(elem, data))}
            </p>
          </ContentEditable>
        ) : (
          <p key={key} {...buildAttributes(content)} className={`${styles} body-large`}>
            {content.elements.map(elem => renderContent(elem, data))}
          </p>
        );
      } else {
        return <p key={key}>{content.elements.map(elem => renderContent(elem, data, undefined, styles))}</p>;
      }
    case 'plainText':
      return content.value;
    case 'summary':
      return (
        <ContentEditable key={key} data={data}>
          <div key={key} data-type="summary" {...buildAttributes(content)} className={styles}>
            {content.elements.map(elem => renderContent(elem, data, undefined, styles))}
          </div>
        </ContentEditable>
      );
    case 'inline-media-group':
      const selectedImage = selectPreferredElement(content.elements, 'image');
      const selectedGraphic = selectPreferredElement(content.elements, 'graphic');
      console.log('elements in inline-media-group:', content.elements);
      console.log('selectedImage:', selectedImage);
      console.log('selectedGraphic:', selectedGraphic);

      if (selectedImage) {
        // Create a new content object with only the selected image element
        const filteredContent = {
          ...content,
          elements: [selectedImage, ...content.elements.filter(elem => elem.nodeType === 'image-caption')],
        };
        return (
          <div key={'img-' + key} data-type="inline-media-group">
            <Figure
              key={key}
              data={filteredContent}
              alt="/public/file.svg"
              {...selectedImage.attributes}
              format="Wide"
            />
            {renderContent(content.elements.filter(elem => elem.nodeType === 'image-caption')[0], data)}
          </div>
        );
      } else if (selectedGraphic) {
        // Create a new content object with only the selected graphic element
        const filteredContent = {
          ...content,
          elements: [selectedGraphic, ...content.elements.filter(elem => elem.nodeType === 'graphic-caption')],
        };
        return (
          <div data-type="inline-media-group">
            <Figure
              key={key}
              data={filteredContent}
              alt="/public/file.svg"
              format="Wide"
              {...selectedGraphic.attributes}
            />
            {renderContent(content.elements.filter(elem => elem.nodeType === 'graphic-caption')[0], data)}
          </div>
        );
      }
      return <div key={key} data-type="inline-media-group" {...buildAttributes(content)} />;
    case 'anchor':
      const anchorClasses = [
        'text-primary',
        'hover:text-primary-dark',
        'hover:underline',
        'font-medium',
        'transition-colors',
        content.attributes?.class || content.attributes?.className,
      ]
        .filter(Boolean)
        .join(' ');

      return (
        <Link
          {...buildAttributes(content)}
          href={content.attributes?.href || '#'}
          key={key}
          data-type="anchor"
          className={anchorClasses}
        >
          {content.elements?.map(elem => renderContent(elem, data))}
        </Link>
      );
    case 'h2': {
      const h2Id = slugify(extractPlainText(content));
      return (
        <h2 key={key} {...buildAttributes(content)} id={h2Id || key}>
          {content.elements.map(elem => renderContent(elem, data))}
        </h2>
      );
    }
    case 'br':
      return <br key={key} {...buildAttributes(content)} />;
    case 'image':
      return <img key={key} {...buildAttributes(content)} className="rounded-media" alt="No image available" />;

    case 'table':
      return (
        <table key={key} {...buildAttributes(content)} data-type="table" className="w-full border-collapse">
          <tbody>{content.elements.map(elem => renderContent(elem, data))}</tbody>
        </table>
      );
    case 'tr':
      return (
        <tr key={key} {...buildAttributes(content)} className="border-b">
          {content.elements.map(elem => renderContent(elem, data))}
        </tr>
      );
    case 'td':
      return (
        <td key={key} {...buildAttributes(content)} className="px-space-sm py-space-2xs">
          {content.elements.map(elem => renderContent(elem, data))}
        </td>
      );
    case 'th':
      return (
        <th key={key} {...buildAttributes(content)} className="px-space-sm py-space-2xs font-bold text-left">
          {content.elements.map(elem => renderContent(elem, data))}
        </th>
      );
    case 'oembedblock':
      console.log('Rendering oembedblock with content:', content);
      return renderOembedBlock(content, key);
    case 'adblock':
      return (
        <div key={key} className="flex justify-center my-space-md" data-type="ad">
          <img src="https://placehold.co/1200x259?text=Adv" alt="Advertisement" />
        </div>
      );
    case 'mediagallery':
      // Extract all images from inline-media-group and image elements
      const slides = content.elements
        .filter(elem => elem.nodeType === 'inline-media-group' || elem.nodeType.startsWith('image'))
        .map(elem => {
          if (elem.nodeType === 'inline-media-group') {
            // Find the image element inside inline-media-group
            const imageElem = elem.elements.find(e => e.nodeType.startsWith('image'));
            const captionElem = elem.elements.find(
              e => e.nodeType === 'image-caption' || e.nodeType === 'graphic-caption',
            );
            return imageElem ? { image: imageElem, caption: captionElem || null } : null;
          } else if (elem.nodeType.startsWith('image')) {
            return { image: elem, caption: null };
          }
          return null;
        })
        .filter((slide): slide is { image: ContentElement; caption: ContentElement | null } => slide !== null);

      if (slides.length === 0) {
        return null;
      }

      return (
        <div key={key} className="media-gallery-slider" data-type="mediagallery">
          {/* Navigation dots */}
          {slides.map((_, index) => (
            <a key={`nav-${key}-${index}`} href={`#slide-${key}-${index}`} className="media-gallery-nav">
              {index + 1}
            </a>
          ))}

          {/* Slides container */}
          <div className="media-gallery-slides">
            {slides.map((slide, index) => (
              <div key={`slide-${key}-${index}`} id={`slide-${key}-${index}`} className="media-gallery-slide">
                <Figure
                  data={{ elements: [slide.image], attributes: {}, nodeType: 'inline-media-group', value: '' }}
                  alt={slide.image?.attributes?.alt || 'Gallery image'}
                  format="Wide"
                />
                {slide.caption && renderContent(slide.caption, data)}
              </div>
            ))}
          </div>
        </div>
      );
    default:
      console.log('[renderContent] unhandled nodeType:', content.nodeType);
      const CustomElement = content.nodeType as keyof JSX.IntrinsicElements; // resolving the element name from the template as default

      return (
        <CustomElement key={key} {...buildAttributes(content)}>
          {content.elements.length > 0 && content.elements.map(elem => renderContent(elem, data))}
        </CustomElement>
      );
  }
};

export const getFamilyRef = (ref: string): string => {
  const idElements = ref.split('-');

  if (idElements.length === 5) {
    return idElements.slice(0, -1).join('-');
  }
  return idElements.join('-');
};

function convertStyleToObject(value: string): React.CSSProperties {
  return value.split(';').reduce((styleObj: React.CSSProperties, styleProp) => {
    const [property, val] = styleProp.split(':');
    if (property && val) {
      // Convert kebab-case to camelCase
      const camelCaseProp = property.trim().replace(/-([a-z])/g, (_, char) => char.toUpperCase());
      styleObj[camelCaseProp as keyof React.CSSProperties] = val.trim() as any;
    }
    return styleObj;
  }, {});
}

export const getPublicationDateString = (publicationTime: string) => {
  const date = new Date(publicationTime);
  return `${date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })} - ${date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};
