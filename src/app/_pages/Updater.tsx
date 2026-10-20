import PageLayout from '../components/PageLayout';
import SectionSubnav from '../components/SectionSubnav';
import UpdaterHero from '../components/updater/UpdaterHero';
import UpdaterTopicGrid from '../components/updater/UpdaterTopicGrid';
import UpdaterSubscribeBand from '../components/updater/UpdaterSubscribeBand';
import { WebpageModel } from '@/types/models/WebpageModel';
import { PageData } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { loadUpdaterItems, withByline } from '@/utilities/updaterItems';
import { UPDATER_LABEL } from '@/utilities/updaterTopics';

type PageProps = {
  // The /updater/ section
  data: PageData<WebpageModel>;
};

// "Insights - The Updater" blog section (/updater/), separate from the Newsroom (/about-eidosmedia/newsroom/).
const Updater = async ({ data }: PageProps) => {
  const items = await loadUpdaterItems(data);
  const [featured] = items;
  const featuredItem = featured && (await withByline(featured));

  return (
    <PageLayout data={data}>
      {/* Tinted band: sub navigation, featured article */}
      <div className="full-bleed bg-surface pb-space-3xl">
        <div className="max-w-page mx-auto px-space-md">
          <SectionSubnav label={UPDATER_LABEL} href={data.model.data.url || '/updater/'} onSurface />

          {featuredItem ? (
            <div className="pt-space-xl">
              <UpdaterHero item={featuredItem} />
            </div>
          ) : (
            <p className="text-copy-muted py-space-3xl">No articles found.</p>
          )}
        </div>
      </div>

      {items.length > 0 && <UpdaterTopicGrid items={items} />}
      <UpdaterSubscribeBand />
    </PageLayout>
  );
};

export default Updater;
