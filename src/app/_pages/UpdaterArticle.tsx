import React from 'react';
import { BaseModel, PageData } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { ArticleModel } from '@/types/models';
import PageLayout from '../components/PageLayout';
import SectionSubnav from '../components/SectionSubnav';
import ShareLinks from '../components/ShareLinks';
import UpdaterSubscribeBand from '../components/updater/UpdaterSubscribeBand';
import ArticleToc from '../components/article/ArticleToc';
import KeyPoints from '../components/article/KeyPoints';
import ArticleBlocks from '../components/article/ArticleBlocks';
import AuthorBox from '../components/article/AuthorBox';
import AboutBox from '../components/article/AboutBox';
import { extractPlainText, findElementsInContentJson, renderContent } from '@/utilities/content';
import { parseArticleBlocks } from '@/utilities/articleBlocks';
import { getReadingMinutes } from '@/utilities/readingTime';
import { formatNewsDate, formatOrdinalDate, getNewsImageUrl } from '@/utilities/news';
import { getListingSectionUrl } from '@/utilities/sectionCategories';
import { UPDATER_LABEL, UPDATER_TOPICS, getNodeUpdaterTopic } from '@/utilities/updaterTopics';

type PageProps = {
  data: PageData<ArticleModel>;
};

// Typography of the article body (light headings, muted paragraphs, anchored h2 offset below the top)
const bodyStyles =
  'flex flex-col gap-space-md text-body text-copy-muted ' +
  '[&_.body-large]:text-body [&_.body-large]:text-copy-muted [&_p]:m-0 ' +
  '[&_h2]:text-h3 [&_h2]:font-light [&_h2]:text-heading [&_h2]:mt-space-md [&_h2]:scroll-mt-space-lg ' +
  '[&_h3]:text-lead [&_h3]:font-normal [&_h3]:text-heading [&_h3]:mt-space-sm ' +
  '[&_a]:text-primary [&_ul]:list-disc [&_ul]:pl-space-md [&_ol]:list-decimal [&_ol]:pl-space-md';

// Article of the "Insights - The Updater" blog (/updater/...): sticky index on the left, editorial blocks in the body.
const UpdaterArticle = ({ data }: PageProps) => {
  const article = data.model.data;
  const contentData = article.files.content.data;
  const updaterUrl = getListingSectionUrl(UPDATER_TOPICS, article.url || '/updater/');
  const topic = UPDATER_TOPICS.find(({ slug }) => slug === getNodeUpdaterTopic(article));

  const headline = findElementsInContentJson(['headline'], contentData)[0];
  const summary = findElementsInContentJson(['summary'], contentData)[0];
  const textElement = findElementsInContentJson(['text'], contentData)[0];
  const bylineElement = findElementsInContentJson(['byline'], contentData)[0];
  const coverCaption = findElementsInContentJson(['caption'], contentData)[0];
  const bylineName =
    (bylineElement && extractPlainText(bylineElement).trim()) ||
    (article as { authors?: string[] }).authors?.join(', ') ||
    undefined;

  const { blocks, headings, author, about } = parseArticleBlocks(textElement, bylineName);
  // Key points opening the body are shown right below the cover image, before the summary
  const [firstBlock, ...otherBlocks] = blocks;
  const leadKeyPoints = firstBlock?.type === 'keyPoints' ? firstBlock : undefined;
  const bodyBlocks = leadKeyPoints ? otherBlocks : blocks;

  const coverImageUrl = getNewsImageUrl(article as unknown as BaseModel, 'Wide_large');
  const lastUpdated = (data.model as { lastModified?: number }).lastModified ?? article.pubInfo?.publicationTime;
  const shareUrl = `${(data as PageData<ArticleModel> & { liveHost?: string }).liveHost ?? ''}${article.url}`;
  const authorName = author?.name ?? bylineName;
  const hasAuthorBox = !!author && (author.bio.length > 0 || !!author.photoUrl);

  return (
    <PageLayout data={data}>
      <SectionSubnav
        label={UPDATER_LABEL}
        href={updaterUrl}
        crumbs={[
          ...(topic ? [{ label: topic.label, href: `${updaterUrl}${topic.slug}/` }] : []),
          { label: article.title },
        ]}
        onSurface
      />

      <div className="grid grid-cols-1 md:grid-cols-[var(--spacing-article-aside)_1fr] gap-space-xl md:gap-space-3xl pt-space-2xl pb-space-4xl">
        {/* Header: topic, title, date */}
        <header className="md:col-start-2 flex flex-col gap-space-md">
          {topic && <p className="text-body text-primary">{topic.label}</p>}
          <div className="[&_h1]:text-h1 [&_h1]:font-light [&_h1]:text-heading">
            {headline ? renderContent(headline, article) : <h1>{article.title}</h1>}
          </div>
          <p className="text-body text-copy-muted">{formatNewsDate(article.pubInfo?.publicationTime)}</p>
        </header>

        {/* Sidebar: meta + sticky index */}
        <aside className="md:row-start-2 flex flex-col gap-space-xl md:pt-space-2xl">
          <div className="flex flex-col gap-space-sm text-body-sm text-copy">
            {authorName && (
              <p>
                Author:{' '}
                {hasAuthorBox ? (
                  <a href="#author" className="text-primary no-underline hover:underline">
                    {authorName}
                  </a>
                ) : (
                  <span className="text-primary">{authorName}</span>
                )}
              </p>
            )}
            {lastUpdated && (
              <p>
                Last updated:
                <br />
                {formatOrdinalDate(lastUpdated)}
              </p>
            )}
            <p>Time read: {getReadingMinutes(contentData)} Mins</p>
            <ShareLinks url={shareUrl} title={article.title} className="pt-space-sm" />
          </div>
          <ArticleToc headings={headings} className="hidden md:block sticky top-space-lg" />
        </aside>

        {/* Body */}
        <div className="md:row-start-2 md:col-start-2 min-w-0 flex flex-col gap-space-2xl">
          {coverImageUrl && (
            <figure className="m-0 flex flex-col gap-space-md">
              <img src={coverImageUrl} alt={article.title} className="w-full rounded-card object-cover aspect-video" />
              {coverCaption && extractPlainText(coverCaption).trim() && (
                <figcaption className="text-caption text-copy text-center">{extractPlainText(coverCaption)}</figcaption>
              )}
            </figure>
          )}
          {leadKeyPoints && <KeyPoints items={leadKeyPoints.items} data={article} />}
          {summary && (
            <div className="text-lead font-light text-copy-muted [&_p]:m-0">{renderContent(summary, article)}</div>
          )}

          <ArticleBlocks blocks={bodyBlocks} data={article} bodyStyles={bodyStyles} />

          {author && hasAuthorBox && (
            <div className="border-t border-line pt-space-2xl">
              <AuthorBox {...author} name={authorName} data={article} />
            </div>
          )}
          {about && (
            <div className="border-t border-line pt-space-2xl">
              <AboutBox title={about.title} elements={about.elements} data={article} />
            </div>
          )}
        </div>
      </div>

      <UpdaterSubscribeBand />
    </PageLayout>
  );
};

export default UpdaterArticle;
