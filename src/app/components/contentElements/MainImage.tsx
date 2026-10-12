import { ArticleModel } from '@/types/models';
import { findElementsInContentJson, renderContent } from '@/utilities/content';

type MainImageProps = {
  data: ArticleModel;
  format?: string;
  hideCaptions?: boolean;
  preferredImage?: string;
};

const getTeaserOrMainImageUrl = (data: ArticleModel, format: string, preferredImage?: string): string | undefined => {
  const teaserPicture = data?.links?.system?.teaserPicture?.[0];
  const teaserPictureFormat = teaserPicture?.dynamicCropsResourceUrls?.[format];

  const mainPicture = data?.links?.system?.mainPicture?.[0];
  const mainPictureFormat = mainPicture?.dynamicCropsResourceUrls?.[format];

  // Some content (e.g. Eidosmedia's Newsroom articles) links its cover photo as
  // links.hyperlink.image instead of links.system.mainPicture/teaserPicture.
  const hyperlinkImage = data?.links?.hyperlink?.image?.[0];
  const hyperlinkImageFormat = hyperlinkImage?.dynamicCropsResourceUrls?.[format];

  if (preferredImage === 'main') {
    return mainPictureFormat ?? teaserPictureFormat ?? hyperlinkImageFormat;
  }

  return teaserPictureFormat ?? mainPictureFormat ?? hyperlinkImageFormat;
};

const MainImage: React.FC<MainImageProps> = ({ data, format, hideCaptions, preferredImage }) => {
  const imageUrl = getTeaserOrMainImageUrl(data, format || 'Wide_large', preferredImage);

  return (
    <div>
      <div>
        {imageUrl ? (
          <div className="flex flex-col gap-space-2xs mb-space-lg">
            <img src={imageUrl} alt="" className="rounded-media" />
            {!hideCaptions &&
              renderContent(findElementsInContentJson(['web-image-caption'], data.files.content.data)[0])}
          </div>
        ) : (
          <p>No main image available</p>
        )}
      </div>
    </div>
  );
};

export default MainImage;
