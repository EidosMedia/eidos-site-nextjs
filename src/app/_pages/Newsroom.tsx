import PageLayout from '../components/PageLayout';
import { WebpageModel } from '@/types/models/WebpageModel';
import { PageData } from '@eidosmedia/neon-frontoffice-ts-sdk';
import NewsroomContent from '../components/news/NewsroomContent';
import ResourcesBand from '../components/news/ResourcesBand';
import { withFallbackImages } from '@/utilities/newsImages';
import { withCategorySections } from '@/utilities/categorySections';
import { NEWS_CATEGORIES } from '@/utilities/newsCategories';

type PageProps = {
  data: PageData<WebpageModel>;
};

const enrichWithFallbackImages = async (data: PageData<WebpageModel>): Promise<PageData<WebpageModel>> => {
  const nodes = await withFallbackImages(data.model.nodes, data.model.data.children || []);
  return { ...data, model: { ...data.model, nodes } };
};

const Newsroom: React.FC<PageProps> = async ({ data }) => {
  const enrichedData = await enrichWithFallbackImages(await withCategorySections(data, NEWS_CATEGORIES));
  return (
    <PageLayout data={enrichedData}>
      <NewsroomContent data={enrichedData} />
      <ResourcesBand data={enrichedData} />
    </PageLayout>
  );
};

export default Newsroom;
