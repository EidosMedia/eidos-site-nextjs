import React from 'react';
import { PageData, WebpageModel } from '@eidosmedia/neon-frontoffice-ts-sdk';
import Link from 'next/link';

type ListSectionProps = {
  data: PageData<WebpageModel>;
};

const ListSection: React.FC<ListSectionProps> = async ({ data }) => {
  const linkedObjects = await connection.getDwxLinkedObjects(data, 'list');

  return (
    <>
      {linkedObjects.map((linkedObject: any, index: number) => (
        <div key={linkedObject.id} className="grid grid-cols-1 md:grid-cols-2 gap-space-2xs">
          <div className="col-span-1">
            <Link className="no-underline" href={linkedObjects[`${index}`].url}>
              <div className="p-space-sm">
                <img
                  alt="/static/img/nothumb.jpeg"
                  width="200"
                  height="200"
                  decoding="async"
                  data-nimg="1"
                  src={linkedObject.links.system.mainPicture[0].dynamicCropsResourceUrls.Portrait_small}
                  className="w-48 h-48 object-cover rounded-media-sm"
                  style={{ color: 'transparent' }}
                />
                <div className="mt-space-2xs">
                  <div>
                    <span className="text-body">{linkedObject.title}</span>
                  </div>
                  <h6 className="text-h3">{linkedObject.title}</h6>
                  <p className="text-body">{linkedObject.summary}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </>
  );
};

export default ListSection;
