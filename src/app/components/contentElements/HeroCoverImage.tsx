import { ArticleModel } from '@/types/models';
import { findElementsInContentJson, renderContent } from '@/utilities/content';

type HeroCoverImageProps = {
  data: ArticleModel;
  format?: string;
  preferredImage?: string;
};

const getTeaserOrMainImageUrl = (data: ArticleModel, format: string, preferredImage?: string): string | undefined => {
  const teaserPicture = data?.links?.system?.teaserPicture?.[0];
  const teaserPictureFormat = teaserPicture?.dynamicCropsResourceUrls?.[format];

  const mainPicture = data?.links?.system?.mainPicture?.[0];
  const mainPictureFormat = mainPicture?.dynamicCropsResourceUrls?.[format];

  if (preferredImage === 'main') {
    return mainPictureFormat ?? teaserPictureFormat;
  }

  return teaserPictureFormat ?? mainPictureFormat;
};

const HeroCoverImage: React.FC<HeroCoverImageProps> = ({ data, format, preferredImage }) => {
  const imageUrl = getTeaserOrMainImageUrl(data, format || 'Ultrawide_large', preferredImage);
  const groupheadContent = findElementsInContentJson(['grouphead'], data.files.content.data)[0];

  return (
    <div className="relative w-full h-[70vh] min-h-125 max-h-200 overflow-hidden">
      {imageUrl ? (
        <>
          {/* Background Image */}
          <img src={imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />

          {/* Gradient Overlay - darker at bottom for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/80 via-ink-deep/40 to-transparent" />

          {/* Content Overlay - Grouphead positioned at bottom */}
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-space-md xl:px-reading-inset pb-space-2xl">
              <div className="text-inverse [&_h1]:text-inverse [&_h5]:text-line">
                {renderContent(groupheadContent, data, undefined, 'flex flex-col gap-space-sm')}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full bg-line">
          <p className="text-copy-muted">No hero image available</p>
        </div>
      )}
    </div>
  );
};

export default HeroCoverImage;
