import PageLayout from "../components/PageLayout";
import React from 'react';
import { ArticleModel } from '@/types/models';
import { PageData } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { renderContent, findElementsInContentJson } from '@/utilities/content';
import Grouphead from '../components/contentElements/Grouphead';
import MainImage from '../components/contentElements/MainImage';
import LiveblogPosts from './LiveblogPosts';
import { CircleDot } from 'lucide-react';

type PageProps = {
  data: PageData<ArticleModel>;
};

const Liveblog: React.FC<PageProps> = ({ data }) => {
  const articleData = data.model.data;

  return (
    <PageLayout data={data}>
      <div className="flex flex-col">
      <div className="xl:px-reading-inset mt-space-xl mb-space-2xl">
        <div className="flex items-center gap-space-3xs mb-space-sm w-fit max-h-8 p-space-2xs rounded-sm bg-feedback-red text-inverse">
          <CircleDot className="w-4 h-4" />
          <span className="subhead1 pt-space-3xs">Live</span>
        </div>
        <Grouphead data={articleData} />
        <MainImage data={articleData} preferredImage="main" />
        <div className="mb-space-lg">
          {renderContent(
            findElementsInContentJson(['text'], articleData.files.content.data)[0],
            articleData,
            undefined,
            'flex flex-col gap-space-sm'
          )}
        </div>
        <LiveblogPosts data={data} />
      </div>
      <div className="flex justify-center mb-space-5xl">
        {/* Placeholder for advertisement */}
        <img src="https://placehold.co/1200x259?text=Adv" alt="Advertisement" />
      </div>
      </div>
    </PageLayout>
  );
};

export default Liveblog;
