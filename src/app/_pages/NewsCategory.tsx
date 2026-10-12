import Link from 'next/link';
import PageLayout from '../components/PageLayout';
import SectionSubnav from '../components/SectionSubnav';
import { pillTabClasses } from '../components/baseComponents/pillTab';
import { WebpageModel } from '@/types/models/WebpageModel';
import { BaseModel, PageData } from '@eidosmedia/neon-frontoffice-ts-sdk';
import NewsList from '../components/news/NewsList';
import ResourcesBand from '../components/news/ResourcesBand';
import {
  NEWS_CATEGORIES,
  NEWSROOM_LABEL,
  NewsCategorySlug,
  getNewsCategory,
  getNodeNewsCategory,
} from '@/utilities/newsCategories';
import { withFallbackImages } from '@/utilities/newsImages';

type PageProps = {
  // Parent Newsroom section: its children are filtered by category
  data: PageData<WebpageModel>;
  category: NewsCategorySlug;
  // The category section itself, when it exists in Neon: its children are always included
  sectionData?: PageData<BaseModel>;
};

const NewsCategory = async ({ data, category, sectionData }: PageProps) => {
  const categoryConfig = getNewsCategory(category);
  const parentUrl = data.model.data.url || '/';

  const allNodes: Record<string, BaseModel> = { ...data.model.nodes, ...sectionData?.model?.nodes };
  const parentIds = (data.model.data.children || []).filter(id => getNodeNewsCategory(allNodes[id]) === category);
  const sectionIds = sectionData?.model?.data?.children || [];
  const categoryIds = [...new Set([...sectionIds, ...parentIds])].filter(id => allNodes[id]);

  const nodes = await withFallbackImages(allNodes, categoryIds);
  const items = categoryIds
    // Articles listed by the category section may not carry the category themselves
    .map(id => ({ ...nodes[id], attributes: { ...nodes[id].attributes, category } }))
    .sort(
      (a, b) =>
        new Date(b.pubInfo?.publicationTime ?? 0).getTime() - new Date(a.pubInfo?.publicationTime ?? 0).getTime(),
    );

  return (
    <PageLayout data={data}>
      <SectionSubnav label={NEWSROOM_LABEL} href={parentUrl} />

      <NewsList
        title={categoryConfig?.plural ?? 'News'}
        items={items}
        header={
          <nav className="flex flex-wrap items-center gap-space-2xs mt-space-md">
            {NEWS_CATEGORIES.map(cat => {
              const isActive = cat.slug === category;
              return (
                <Link
                  key={cat.slug}
                  href={`${parentUrl}${cat.slug}/`}
                  aria-current={isActive ? 'page' : undefined}
                  className={pillTabClasses(isActive)}
                >
                  {cat.label}
                </Link>
              );
            })}
          </nav>
        }
      />
      <ResourcesBand data={data} />
    </PageLayout>
  );
};

export default NewsCategory;
