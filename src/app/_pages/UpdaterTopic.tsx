import Link from 'next/link';
import PageLayout from '../components/PageLayout';
import SectionSubnav from '../components/SectionSubnav';
import UpdaterHero from '../components/updater/UpdaterHero';
import UpdaterCardGrid from '../components/updater/UpdaterCardGrid';
import UpdaterSubscribeBand from '../components/updater/UpdaterSubscribeBand';
import { pillTabClasses } from '../components/baseComponents/pillTab';
import { WebpageModel } from '@/types/models/WebpageModel';
import { PageData } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { loadUpdaterItems, withByline } from '@/utilities/updaterItems';
import { UPDATER_LABEL, UPDATER_TOPICS, UpdaterTopicSlug, getUpdaterTopic } from '@/utilities/updaterTopics';

type PageProps = {
  // The parent /updater/ section
  data: PageData<WebpageModel>;
  topic: UpdaterTopicSlug;
};

// Updater topic page (e.g. /updater/technology/): latest articles of one topic.
const UpdaterTopic = async ({ data, topic }: PageProps) => {
  const topicConfig = getUpdaterTopic(topic);
  const updaterUrl = data.model.data.url || '/updater/';
  const items = (await loadUpdaterItems(data)).filter(item => item.topic === topic);
  const [featured] = items;
  const featuredItem = featured && (await withByline(featured));

  return (
    <PageLayout data={data}>
      {/* Tinted band: breadcrumb, title, topic tabs, featured article */}
      <div className="full-bleed bg-surface pb-space-3xl">
        <div className="max-w-page mx-auto px-space-md">
          <SectionSubnav
            label={UPDATER_LABEL}
            href={updaterUrl}
            crumbs={[{ label: topicConfig?.label ?? topic }]}
            onSurface
          />

          <h1 className="text-h2 font-light text-heading text-center pt-space-2xl">
            Latest articles in {topicConfig?.label ?? topic}
          </h1>
          <nav className="flex flex-wrap items-center justify-center gap-space-2xs mt-space-lg" aria-label="Topics">
            {UPDATER_TOPICS.map(({ slug, label }) => (
              <Link
                key={slug}
                href={`${updaterUrl}${slug}/`}
                aria-current={slug === topic ? 'page' : undefined}
                className={pillTabClasses(slug === topic)}
              >
                {label}
              </Link>
            ))}
          </nav>

          {featuredItem ? (
            <div className="pt-space-2xl">
              <UpdaterHero item={featuredItem} />
            </div>
          ) : (
            <p className="text-copy-muted text-center pt-space-2xl">No articles found.</p>
          )}
        </div>
      </div>

      {items.length > 0 && (
        <section className="py-space-3xl">
          <UpdaterCardGrid items={items} showTopic={false} />
        </section>
      )}
      <UpdaterSubscribeBand />
    </PageLayout>
  );
};

export default UpdaterTopic;
