import PageLayout from "../components/PageLayout";
import { WebpageModel } from '@/types/models/WebpageModel';
import { PageData } from '@eidosmedia/neon-frontoffice-ts-sdk';
import DefaultSectionItemsRenderer from '../components/DefaultSectionItemsRenderer';

type PageProps = {
  data: PageData<WebpageModel>;
};

const Section: React.FC<PageProps> = ({ data }) => {
  return (
    <PageLayout data={data}>
      <DefaultSectionItemsRenderer data={data} />
      </PageLayout>
  );
};

export default Section;
