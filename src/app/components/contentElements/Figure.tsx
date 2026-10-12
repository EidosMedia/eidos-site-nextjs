import { ContentElement } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { isCmsOnlyAttribute } from '@/utilities/attributes';

type FigureProps = {
  data: ContentElement;
  alt: string;
  format: string;
};

const getRasterUrl = (data: ContentElement, format: string): string | undefined => {
  const targetFormat = format.toLowerCase();
  const imageElements = data.elements.filter(elem => elem.nodeType === 'image');

  const element = imageElements.find(elem => {
    const attrs = elem.attributes || {};
    const softCrop = attrs.softCrop?.toLowerCase();
    return softCrop === targetFormat;
  });

  if (element?.attributes?.src) {
    return element.attributes.src;
  }

  return imageElements[0]?.attributes?.src; // fallback to first available
};

const getSvgUrl = (data: ContentElement): string | undefined => {
  const element = data.elements.find(elem => elem.nodeType === 'graphic');
  return element?.attributes.fileref;
};

const getDimensionsFromUrl = (url: string): { width: number; height: number } | null => {
  const match = url.match(/:(\d+)x(\d+):/);
  if (match) {
    const width = parseInt(match[1], 10);
    const height = parseInt(match[2], 10);
    return { width, height };
  }
  return null;
};

const Figure: React.FC<FigureProps & Record<string, any>> = ({ data, alt, format, softCrop, ...props }) => {
  const imageUrl = getSvgUrl(data) || getRasterUrl(data, format);
  const dimensions = imageUrl && getDimensionsFromUrl(imageUrl);

  // Filter out any custom attributes that shouldn't be passed to the DOM element
  const domProps = Object.keys(props).reduce((acc: any, key) => {
    // Add any other attributes you want to filter out here
    if (!['fileref', 'orientation', 'align'].includes(key) && !isCmsOnlyAttribute(key)) {
      acc[key] = props[key];
    }
    return acc;
  }, {});

  return (
    <>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          width={dimensions ? dimensions.width : undefined}
          height={dimensions ? dimensions.height : undefined}
          {...domProps}
          className={`rounded-media ${domProps.className ?? ''}`}
        />
      ) : (
        <p>No image available</p>
      )}
    </>
  );
};

export default Figure;
