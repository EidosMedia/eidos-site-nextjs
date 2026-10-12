import { BaseModel } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { findElementsInContentJson } from '@/utilities/content';
import { loadFullArticle } from '@/utilities/articleLoader';

// A section listing only resolves crop URLs for links.system.mainPicture/teaserPicture.
// Content that links its cover photo differently (e.g. links.hyperlink.image) comes
// through with just a bare targetId, so it renders with no image at all.
const hasResolvableImage = (node: BaseModel) =>
  Boolean(node.links?.system?.mainPicture?.[0]?.dynamicCropsResourceUrls) ||
  Boolean((node.links as any)?.hyperlink?.image?.[0]?.dynamicCropsResourceUrls);

const extractFirstBodyImageUrl = (contentData: any): string | undefined => {
  const images = findElementsInContentJson(['image'], contentData);
  const wideImage = images.find(
    img => img.attributes?.softCrop === 'Wide' && img.attributes?.src && !img.attributes.src.startsWith('null'),
  );
  return wideImage?.attributes?.src;
};

// For content without a usable listing thumbnail, fetch the full article and use the
// first inline image from its body as a fallback cover photo.
export const withFallbackImages = async (
  nodes: Record<string, BaseModel>,
  ids: string[],
): Promise<Record<string, BaseModel>> => {
  if (ids.length === 0) return nodes;

  const enriched = { ...nodes };

  await Promise.all(
    ids.map(async id => {
      const node = enriched[id];
      if (!node?.url || hasResolvableImage(node)) return;

      try {
        const fullArticle = await loadFullArticle(node.url);
        const fallbackImageUrl = extractFirstBodyImageUrl((fullArticle as any)?.files?.content?.data);
        if (!fallbackImageUrl) return;

        enriched[id] = {
          ...node,
          links: {
            ...node.links,
            system: {
              ...node.links?.system,
              mainPicture: [
                {
                  dynamicCropsResourceUrls: {
                    Wide_large: fallbackImageUrl,
                    Wide_small: fallbackImageUrl,
                    Wide_thumb: fallbackImageUrl,
                    Square_small: fallbackImageUrl,
                    Portrait_small: fallbackImageUrl,
                  },
                },
              ],
            },
          } as unknown as BaseModel['links'],
        };
      } catch {
        // Leave the node without an image if the fallback lookup fails.
      }
    }),
  );

  return enriched;
};
