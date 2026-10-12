import PageLayout from '../components/PageLayout';
import { PageData } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { WebpageModel } from '@eidosmedia/neon-frontoffice-ts-sdk';
import React from 'react';
import MainWithHero from '../components/webpage/MainWithHero';
import Context from '../components/webpage/Context';
import Insight1 from '../components/webpage/Insight1';
type PageProps = {
  data: PageData<WebpageModel>;
};

const WebpageColumnsLayout: React.FC<PageProps> = async ({ data }) => {
  return (
    <PageLayout data={data}>
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="col-span-12 px-space-md">
          {/* <Main data={data} /> */}
          <MainWithHero data={data} />
        </div>

        <div className="col-span-12 px-space-md">
          <Context data={data} />
        </div>
        <div className="col-span-12 px-space-md">
          <Insight1 data={data} displayMainPicture={false} />
        </div>
      </div>
    </PageLayout>
  );
};

export default WebpageColumnsLayout;
