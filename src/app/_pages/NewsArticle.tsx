import React from 'react';
import Link from 'next/link';
import { headers } from 'next/headers';
import InPageSearch from '../components/InPageSearch';
import ArticleBlocks from '../components/article/ArticleBlocks';
import { parseArticleBlocks } from '@/utilities/articleBlocks';
import { BaseModel, ContentElement, PageData } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { ArticleModel } from '@/types/models';
import PageLayout from '../components/PageLayout';
import ResourcesBand from '../components/news/ResourcesBand';
import { extractPlainText, findElementsInContentJson, renderContent } from '@/utilities/content';
import {
  NEWS_CATEGORIES,
  NEWSROOM_LABEL,
  getNewsCategoryLabel,
  getNewsroomUrl,
  getNodeNewsCategory,
} from '@/utilities/newsCategories';
import { SectionModel, withCategorySections } from '@/utilities/categorySections';
import { getAuthOptions } from '@/utilities/security';
import { formatNewsDate, getNewsImageUrl } from '@/utilities/news';
import { withFallbackImages } from '@/utilities/newsImages';
import NewsListItem from '../components/news/NewsListItem';
import NewsCategoryBadge from '../components/news/NewsCategoryBadge';
import ShareLinks from '../components/ShareLinks';

type PageProps = {
  data: PageData<ArticleModel>;
};

const RELATED_COUNT = 2;

// Fetch the parent Newsroom section (with its category subsections) to get sibling articles for "Read more about".
const loadParentSection = async (parentUrl: string) => {
  const hostname = (await headers()).get('x-neon-backend-url');
  if (!hostname || !parentUrl) return undefined;
  try {
    const response = await connection.makePageRequest(`${hostname}${parentUrl}`, await getAuthOptions(), {
      redirect: 'manual',
      cache: 'no-cache',
    });
    if (response.status !== 200) return undefined;
    const json = await response.json();
    if (!json?.model) return undefined;
    return (await withCategorySections({ model: json.model as SectionModel }, NEWS_CATEGORIES)).model;
  } catch {
    return undefined;
  }
};

// Split the "About Eidosmedia" boilerplate (heading + following content) out of the body text,
// so it can be rendered in its own boxed section.
const splitAboutSection = (textContent?: ContentElement) => {
  const elements = textContent?.elements ?? [];
  const isHeading = (el: ContentElement) => /^h[1-6]$/.test(el.nodeType);
  const start = elements.findIndex(
    el => isHeading(el) && extractPlainText(el).trim().toLowerCase().startsWith('about eidosmedia'),
  );
  if (!textContent || start === -1) return { body: textContent, about: undefined };

  const level = parseInt(elements[start].nodeType.substring(1), 10);
  let end = elements.length;
  for (let i = start + 1; i < elements.length; i++) {
    if (isHeading(elements[i]) && parseInt(elements[i].nodeType.substring(1), 10) <= level) {
      end = i;
      break;
    }
  }

  return {
    body: { ...textContent, elements: [...elements.slice(0, start), ...elements.slice(end)] },
    about: elements.slice(start, end),
  };
};

const NewsArticle = async ({ data }: PageProps) => {
  const articleData = data.model.data;
  const contentData = articleData.files.content.data;
  const articleUrl = articleData.url || '';
  const parentUrl = getNewsroomUrl(articleUrl);
  const category = getNodeNewsCategory(articleData);
  const categoryLabel = getNewsCategoryLabel(category);

  const parent = await loadParentSection(parentUrl);

  const siblings = (parent?.data?.children ?? [])
    .map(id => parent?.nodes?.[id])
    .filter((node): node is BaseModel => Boolean(node) && node!.id !== articleData.id)
    .sort(
      (a, b) =>
        new Date(b.pubInfo?.publicationTime ?? 0).getTime() - new Date(a.pubInfo?.publicationTime ?? 0).getTime(),
    );
  // Prefer articles of the same category, then fill up with the latest ones
  const relatedCandidates = [
    ...siblings.filter(node => category && getNodeNewsCategory(node) === category),
    ...siblings.filter(node => !category || getNodeNewsCategory(node) !== category),
  ].slice(0, RELATED_COUNT);
  const relatedNodes = await withFallbackImages(
    Object.fromEntries(relatedCandidates.map(node => [node.id, node])),
    relatedCandidates.map(node => node.id),
  );
  const relatedArticles = relatedCandidates.map(node => relatedNodes[node.id]);

  const headline = findElementsInContentJson(['headline'], contentData)[0];
  const summary = findElementsInContentJson(['summary'], contentData)[0];
  const textContent = findElementsInContentJson(['text'], contentData)[0];
  const { body, about } = splitAboutSection(textContent);
  const { blocks: bodyBlocks } = parseArticleBlocks(body);

  const coverImageUrl = getNewsImageUrl(articleData as unknown as BaseModel, 'Wide_large');
  const publicationDate = formatNewsDate(articleData.pubInfo?.publicationTime);

  const shareUrl = `${(data as PageData<ArticleModel> & { liveHost?: string }).liveHost ?? ''}${articleUrl}`;

  const bodyStyles =
    '[&_.body-large]:text-body [&_.body-large]:text-copy-muted ' +
    '[&_h2]:text-body [&_h2]:font-bold [&_h2]:text-heading [&_h3]:text-body [&_h3]:font-bold ' +
    '[&_a]:text-primary [&_a]:font-semibold ' +
    '[&_table]:text-body-sm [&_table]:text-copy-muted [&_td]:align-top';

  return (
    <PageLayout data={data} fullWidthContent>
      {/* Sub navigation: breadcrumb + categories + search */}
      <div className="max-w-page mx-auto px-space-md py-space-sm flex flex-col md:flex-row md:items-center md:justify-between gap-space-xs text-caption">
        <nav className="flex items-center gap-space-2xs text-copy-muted">
          <Link href={parentUrl || '/'} className="no-underline hover:underline">
            {NEWSROOM_LABEL}
          </Link>
          {categoryLabel && (
            <>
              <span className="text-copy-subtle">/</span>
              <Link href={`${parentUrl}${category}/`} className="no-underline hover:underline">
                {categoryLabel}
              </Link>
            </>
          )}
        </nav>
        <div className="flex flex-wrap items-center gap-space-sm">
          {NEWS_CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              href={`${parentUrl}${cat.slug}/`}
              className="font-semibold text-primary no-underline hover:underline"
            >
              {cat.label}
            </Link>
          ))}
          <InPageSearch placeholder="Search in this page" bordered={false} />
        </div>
      </div>

      <article className="max-w-article mx-auto px-space-md pt-space-2xl pb-space-4xl">
        {/* Header */}
        <NewsCategoryBadge category={category} className="mb-space-md" />
        <div className="mb-space-xl [&_h1]:text-h1 [&_h1]:text-heading">
          {headline ? renderContent(headline, articleData) : <h1>{articleData.title}</h1>}
        </div>

        {/* Meta + cover image */}
        <div className="grid grid-cols-1 md:grid-cols-[var(--spacing-article-aside)_1fr] gap-space-md md:gap-space-xl mb-space-3xl">
          <div className="md:border-t md:border-line md:mt-space-sm md:pt-space-lg flex flex-col items-start gap-space-xs order-2 md:order-1">
            {publicationDate && <p className="text-body-sm text-copy-muted">{publicationDate}</p>}
            <ShareLinks url={shareUrl} title={articleData.title} />
          </div>
          <div className="order-1 md:order-2 rounded-media overflow-hidden shadow-xl bg-surface aspect-video">
            {coverImageUrl && (
              <img src={coverImageUrl} alt={articleData.title} className="w-full h-full object-cover" />
            )}
          </div>
        </div>

        {/* Body */}
        <div className={`md:ml-article-indent flex flex-col gap-space-md ${bodyStyles}`}>
          {summary && <div className="text-body font-bold text-heading">{renderContent(summary, articleData)}</div>}
          {/* Quotes and "01. Title. Text" tables are rendered as editorial blocks */}
          <ArticleBlocks blocks={bodyBlocks} data={articleData} bodyStyles="flex flex-col gap-space-md" boldQuotes />
        </div>

        {/* About Eidosmedia */}
        {about && about.length > 0 && (
          <section
            className={`md:ml-article-indent-box mt-space-3xl border-y border-line py-space-xl px-space-md ${bodyStyles}`}
          >
            <div className="flex flex-col gap-space-sm [&_h2]:!text-body-sm [&_h3]:!text-body-sm">
              {about.map(el => renderContent(el, articleData, 'text'))}
            </div>
          </section>
        )}

        {/* Read more about */}
        {relatedArticles.length > 0 && (
          <section className="md:ml-article-indent mt-space-3xl">
            <h2 className="text-h2 text-heading mb-space-md">Read more about</h2>
            <div className="divide-y divide-line">
              {relatedArticles.map(node => (
                <NewsListItem key={node.id} item={node} />
              ))}
            </div>
          </section>
        )}
      </article>

      <ResourcesBand data={data} />
    </PageLayout>
  );
};

export default NewsArticle;
