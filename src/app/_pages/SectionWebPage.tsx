import PageLayout from "../components/PageLayout";
import { PageData } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { WebpageModel } from '@eidosmedia/neon-frontoffice-ts-sdk';
import Main from '../components/webpage/Main';
import Context from '../components/webpage/Context';
import Insight1 from '../components/webpage/Insight1';
import Insight2 from '../components/webpage/Insight2';

type PageProps = {
  data: PageData<WebpageModel>;
};

const SectionWebPage: React.FC<PageProps> = async ({ data }) => {
  return (
    <PageLayout data={data}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-2xs">
        <div className="col-span-1 relative group">
          <Main data={data} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-2xs">
        <div className="col-span-1 relative group">
          <Context data={data} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-2xs">
        <div className="col-span-1 relative group">
          <Insight1 data={data} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-2xs">
        <div className="col-span-1 relative group">
          <Insight2 data={data} />
        </div>
      </div>
      </PageLayout>
  );
};

export default SectionWebPage;
