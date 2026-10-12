import React from 'react';
import { PageData, WebpageModel } from '@eidosmedia/neon-frontoffice-ts-sdk';
import Link from 'next/link';

type TopSectionProps = {
  data: PageData<WebpageModel>;
};

const TopSection: React.FC<TopSectionProps> = async ({ data }) => {
  const linkedObjects = await connection.getDwxLinkedObjects(data, 'top');

  return (
    <>
      {linkedObjects.map((linkedObject: any, index: number) => (
        <div key={linkedObject.id} className="p-space-sm">
          <div className="p-space-sm bg-surface rounded-xl shadow-md">
            <Link href={linkedObjects[`${index}`].url}>
              <img
                alt="/static/img/nothumb.jpeg"
                width={550}
                height={287}
                decoding="async"
                className="rounded-media"
                src={linkedObject.links.system.mainPicture[0].dynamicCropsResourceUrls.Portrait_small}
              />
              <div className="p-space-sm">
                <h6 className="text-lead font-semibold text-heading">{linkedObject.title}</h6>
                <p className="text-body text-copy">{linkedObject.summary}</p>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </>
  );
};

export default TopSection;
