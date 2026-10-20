import PageLayout from '../components/PageLayout';
import React from 'react';
import { ArticleModel } from '@/types/models';
import { ContentElement, PageData } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { renderContent, findElementsInContentJson, extractPlainText, slugify } from '@/utilities/content';
import Grouphead from '../components/contentElements/Grouphead';
import TableOfContents from '../components/TableOfContents';
import AuthorCard from '../components/contentElements/AuthorCard';
import ArticleCard from '../components/article/ArticleCard';
import { getNewsImageUrl } from '@/utilities/news';

type PageProps = {
  data: PageData<ArticleModel>;
};

const Article: React.FC<PageProps> = ({ data }) => {
  const articleData = data.model.data;
  const adsDensity = articleData?.attributes?.ads?.adsDensity || 0;

  const textContent = findElementsInContentJson(['text'], articleData.files.content.data)[0];

  // Insert ad elements every 3 paragraphs, considering existing adblocks
  const textContentWithAds = React.useMemo(() => {
    if (!textContent?.elements || adsDensity === 0) {
      console.log('[AdBlock] No elements or adsDensity is 0');
      return textContent;
    }

    console.log('[AdBlock] Total elements:', textContent.elements.length);
    console.log('[AdBlock] adsDensity:', adsDensity);

    // Count existing adblocks
    const existingAdsCount = textContent.elements.filter(element => element.nodeType === 'adblock').length;

    console.log('[AdBlock] Existing adblocks:', existingAdsCount);

    // If we already have enough ads, return as is
    if (existingAdsCount >= adsDensity) {
      console.log('[AdBlock] Already have enough ads, returning as is');
      return textContent;
    }

    const maxNewAds = adsDensity - existingAdsCount;
    console.log('[AdBlock] Max new ads to add:', maxNewAds);

    const newElements: typeof textContent.elements = [];
    let paragraphsSinceLastAd = 0;
    let adsAdded = 0;

    textContent.elements.forEach((element, index) => {
      newElements.push(element);

      if (element.nodeType === 'p') {
        paragraphsSinceLastAd++;
        console.log(`[AdBlock] Paragraph at index ${index}, count since last ad: ${paragraphsSinceLastAd}`);
      } else if (element.nodeType === 'adblock') {
        // Reset counter when we encounter an existing adblock
        console.log(`[AdBlock] Found existing adblock at index ${index}, resetting counter`);
        paragraphsSinceLastAd = 0;
      }

      // Insert ad after every 3 paragraphs
      if (element.nodeType === 'p' && paragraphsSinceLastAd === 3 && adsAdded < maxNewAds) {
        console.log(`[AdBlock] Reached 3 paragraphs at index ${index}, checking if we can add ad...`);

        // Check if we have at least 3 more paragraphs ahead or an existing adblock
        const remainingElements = textContent.elements.slice(index + 1);
        const nextParagraphsCount = remainingElements.filter(el => el.nodeType === 'p').length;
        const hasAdblockAhead = remainingElements.some(el => el.nodeType === 'adblock');

        console.log(`[AdBlock] Paragraphs ahead: ${nextParagraphsCount}, has adblock ahead: ${hasAdblockAhead}`);

        // Only add if we can maintain 3 paragraphs distance to the end or next adblock
        if (nextParagraphsCount >= 3 || hasAdblockAhead) {
          console.log(`[AdBlock] ✓ Adding new adblock after index ${index}`);
          newElements.push({
            nodeType: 'adblock',
            attributes: {},
            elements: [],
            value: '',
          });
          paragraphsSinceLastAd = 0;
          adsAdded++;
        } else {
          console.log(`[AdBlock] ✗ Cannot add adblock - not enough paragraphs ahead`);
        }
      }
    });

    console.log('[AdBlock] Total ads added:', adsAdded);
    console.log('[AdBlock] Final elements count:', newElements.length);

    return {
      ...textContent,
      elements: newElements,
    };
  }, [textContent, adsDensity]);

  // Detect underscore-separator paragraphs used as dividers in the CMS
  const isSeparator = (el: ContentElement) => {
    if (el.nodeType !== 'p') return false;
    const text = extractPlainText(el).trim();
    return text.length > 3 && /^_+$/.test(text);
  };

  // Split author section (between last two separators around an inline-media-group)
  // Also removes "About Eidosmedia" section which appears after the author section
  const { mainTextContent, authorPhotoUrl, authorName, authorRole, authorBioElements } = React.useMemo(() => {
    const elements: ContentElement[] = textContentWithAds?.elements ?? [];

    // Find the "About Eidosmedia" boundary and cut everything from there
    let aboutIdx = elements.length;
    for (let i = 0; i < elements.length; i++) {
      if (['h2', 'h3'].includes(elements[i].nodeType)) {
        const t = extractPlainText(elements[i]).toLowerCase();
        if (t.startsWith('about eidosmedia') || t.startsWith('find out more about')) {
          aboutIdx = i;
          break;
        }
      }
    }
    const relevant = elements.slice(0, aboutIdx);

    // Find the last inline-media-group within the relevant range
    let lastImgIdx = -1;
    for (let i = relevant.length - 1; i >= 0; i--) {
      if (relevant[i].nodeType === 'inline-media-group') {
        lastImgIdx = i;
        break;
      }
    }

    if (lastImgIdx === -1) {
      return {
        mainTextContent: textContentWithAds,
        authorPhotoUrl: undefined,
        authorName: '',
        authorRole: '',
        authorBioElements: [],
      };
    }

    // Find the separator immediately before the image (scan up to 5 elements back)
    let sepBefore = -1;
    for (let i = lastImgIdx - 1; i >= Math.max(0, lastImgIdx - 5); i--) {
      if (isSeparator(relevant[i])) {
        sepBefore = i;
        break;
      }
    }

    if (sepBefore === -1) {
      return {
        mainTextContent: textContentWithAds,
        authorPhotoUrl: undefined,
        authorName: '',
        authorRole: '',
        authorBioElements: [],
      };
    }

    // Find the separator immediately after the image (or end of relevant range)
    let sepAfter = relevant.length;
    for (let i = lastImgIdx + 1; i < relevant.length; i++) {
      if (isSeparator(relevant[i])) {
        sepAfter = i;
        break;
      }
    }

    const authorSection = relevant.slice(sepBefore + 1, sepAfter);

    // Extract photo URL from inline-media-group: prefer 'enabled-preferred' (Square) crop
    const imgEl = authorSection.find(el => el.nodeType === 'inline-media-group');
    let authorPhotoUrl: string | undefined;
    if (imgEl) {
      const imgs = imgEl.elements ?? [];
      const img =
        imgs.find(e => e.attributes?.softcropenabled === 'enabled-preferred') ??
        imgs.find(e => e.nodeType.startsWith('image'));
      authorPhotoUrl = img?.attributes?.src ?? undefined;
    }

    // Author name from byline element
    const bylineEl = findElementsInContentJson(['byline'], articleData.files.content.data)[0];
    const authorName = bylineEl ? extractPlainText(bylineEl).trim() : '';

    // Role: the <strong> inside the <p> that immediately precedes the inline-media-group
    // (this is the CMS role/title placeholder — empty when editor hasn't filled it in)
    const prePhotoP = authorSection.find(el => el.nodeType === 'p' && el.elements?.some(c => c.nodeType === 'strong'));
    const strongEl = prePhotoP?.elements?.find(c => c.nodeType === 'strong');
    let authorRole = strongEl ? extractPlainText(strongEl).trim() : '';

    // Bio elements = non-empty p elements (excludes the role placeholder paragraph)
    const bioCandidates = authorSection.filter(el => {
      if (el.nodeType !== 'p') return false;
      const text = extractPlainText(el).trim();
      return text.length > 0 && !/^_+$/.test(text) && el !== prePhotoP;
    });

    // Fallback: if the CMS role placeholder is empty, try to parse degree+institution
    // from the first bio paragraph (e.g. "MSc in Digital Scholarship ... University of Oxford")
    if (!authorRole && bioCandidates.length > 0) {
      const firstBioText = extractPlainText(bioCandidates[0]);
      const degreeMatch = firstBioText.match(
        /\b(MSc|PhD|MA|BA|BSc|MBA|MPhil|DPhil)\s+(?:in\s+)?([^,.]+?)(?=\s+as\b|\s+at\b|\s+from\b)/i,
      );
      const uniMatch = firstBioText.match(/(?:at|from)\s+(?:the\s+)?(\w[^,]+?University[^,]*)/i);
      if (degreeMatch && uniMatch) {
        authorRole = `${degreeMatch[1]} ${degreeMatch[2].trim()}, ${uniMatch[1].trim()}`;
      }
    }

    const authorBioElements = bioCandidates;

    // Main content = relevant elements before the separator, discarding About Eidosmedia
    const mainElements = relevant.slice(0, sepBefore);
    const mainTextContent = textContentWithAds ? { ...textContentWithAds, elements: mainElements } : textContentWithAds;

    return { mainTextContent, authorPhotoUrl, authorName, authorRole, authorBioElements };
  }, [textContentWithAds]);

  // Extract cover image URL (prefer main, fallback to teaser, then to a linked hyperlink image)
  const mainPicture = articleData?.links?.system?.mainPicture?.[0];
  const teaserPicture = articleData?.links?.system?.teaserPicture?.[0];
  const hyperlinkImage = articleData?.links?.hyperlink?.image?.[0];
  const coverImageUrl =
    mainPicture?.dynamicCropsResourceUrls?.['Wide_large'] ??
    teaserPicture?.dynamicCropsResourceUrls?.['Wide_large'] ??
    hyperlinkImage?.dynamicCropsResourceUrls?.['Wide_large'];

  // Extract h2 headings for the table of contents
  const h2Elements = findElementsInContentJson(['h2'], textContent || articleData.files.content.data);
  const h2Headings = h2Elements
    .map(el => ({ text: extractPlainText(el), id: slugify(extractPlainText(el)) }))
    .filter(h => h.id)
    .filter(h => {
      const lower = h.text.toLowerCase();
      return !lower.startsWith('about eidosmedia') && !lower.startsWith('find out more about');
    });

  // Breadcrumb: site name + matching section from site tree (or URL-parsed fallback)
  const breadcrumbs = React.useMemo(() => {
    const siteName = data.siteData?.siteName || data.siteNode?.title || data.siteNode?.name || '';
    const crumbs: { title: string; href: string }[] = siteName ? [{ title: siteName, href: '/' }] : [];
    const articleUrl = articleData.url || '';
    const items: typeof data.siteNode.items = data.siteNode?.items || [];

    if (items.length > 0 && articleUrl) {
      const section = items.find(item => item.uri && item.uri !== '/' && articleUrl.includes(item.uri));
      if (section) {
        crumbs.push({ title: section.title || section.name, href: section.url || section.uri });
      }
    } else if (articleUrl) {
      const isId = (seg: string) => /^[0-9a-f]{4}-[0-9a-f]/i.test(seg) || seg === 'index.html' || seg === 'default';
      const segments = articleUrl.split('/').filter(s => s && !isId(s));
      segments.forEach((seg, i) => {
        crumbs.push({
          title: seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          href: '/' + segments.slice(0, i + 1).join('/') + '/',
        });
      });
    }
    return crumbs;
  }, [data.siteNode, data.siteData, articleData.url]);

  // Related articles from children nodes
  const relatedArticles = React.useMemo(() => {
    console.log('[Related] children:', articleData.children);
    console.log('[Related] nodes keys:', Object.keys(data.model.nodes || {}));
    if (!articleData.children?.length) return [];
    return articleData.children
      .map(id => data.model.nodes[id])
      .filter(Boolean)
      .slice(0, 3);
  }, [articleData.children, data.model.nodes]);

  // Reading time: ~200 words per minute
  const readingTime = React.useMemo(() => {
    if (!mainTextContent) return 1;
    const text = extractPlainText(mainTextContent);
    const words = text
      .trim()
      .split(/\s+/)
      .filter(w => w.length > 0).length;
    return Math.max(1, Math.ceil(words / 200));
  }, [mainTextContent]);

  // Publication date formatted
  const publicationDate = articleData?.pubInfo?.publicationTime
    ? new Date(articleData.pubInfo.publicationTime).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <PageLayout data={data} fullWidthContent>
      <div className="flex flex-col">
        {/* Mobile header: text + image inside same blue card */}
        <div className="md:hidden px-space-sm mb-space-lg">
          <div className="bg-primary rounded-xl overflow-hidden">
            <div className="px-space-md pt-space-lg pb-space-md">
              <Grouphead data={articleData} breadcrumbs={breadcrumbs} theme="dark" publicationDate={publicationDate} />
            </div>
            {coverImageUrl && (
              <img src={coverImageUrl} alt="" className="w-full aspect-video object-cover rounded-media" />
            )}
          </div>
        </div>

        {/* Desktop header: blue card side-by-side */}
        <div className="hidden md:block container mx-auto px-space-lg mb-space-2xl">
          <div className="bg-primary rounded-xl flex min-h-90">
            <div className="flex-1 flex flex-col justify-center py-space-xl px-space-xl">
              <Grouphead data={articleData} breadcrumbs={breadcrumbs} theme="dark" publicationDate={publicationDate} />
            </div>
            {coverImageUrl && (
              <div className="w-5/12 flex-shrink-0 flex">
                <img src={coverImageUrl} alt="" className="w-full rounded-media object-cover object-top" />
              </div>
            )}
          </div>
        </div>

        {/* Body: constrained to 1280px, same width as before */}
        <div className="w-full max-w-content mx-auto px-space-lg">
          {h2Headings.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-[16rem_1fr] gap-space-lg xl:pr-reading-inset mb-space-2xl">
              <TableOfContents headings={h2Headings} authorName={authorName} readingTime={readingTime} />
              <div className="min-w-0">
                {renderContent(mainTextContent, articleData, undefined, 'flex flex-col gap-space-sm')}
                {authorBioElements.length > 0 && (
                  <AuthorCard
                    photoUrl={authorPhotoUrl}
                    name={authorName}
                    role={authorRole}
                    bioElements={authorBioElements}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="xl:px-reading-inset mb-space-2xl">
              <div className="min-w-0">
                {renderContent(mainTextContent, articleData, undefined, 'flex flex-col gap-space-sm')}
                {authorBioElements.length > 0 && (
                  <AuthorCard
                    photoUrl={authorPhotoUrl}
                    name={authorName}
                    role={authorRole}
                    bioElements={authorBioElements}
                  />
                )}
              </div>
            </div>
          )}

          {relatedArticles.length > 0 && (
            <div className="mb-space-5xl">
              <h2 className="text-lead font-title text-heading mb-space-md">Related articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                {relatedArticles.map(node => (
                  <ArticleCard
                    key={node.id}
                    href={node.url}
                    title={node.title}
                    imageUrl={getNewsImageUrl(node, 'Wide_large')}
                    summary={node.summary}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Article;
