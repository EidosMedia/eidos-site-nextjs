import PageLayout from "../components/PageLayout";
import React from 'react';
import { ArticleModel } from '@/types/models';
import { ContentElement, PageData } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { renderContent, findElementsInContentJson } from '@/utilities/content';
import HeroCoverImage from '../components/contentElements/HeroCoverImage';
import Summary from '../components/contentElements/Summary';

type PageProps = {
  data: PageData<ArticleModel>;
};

const Article: React.FC<PageProps> = ({ data }) => {
  const articleData = data.model.data;
  const adsDensity = articleData?.attributes?.ads?.adsDensity || 0;

  const textContent = findElementsInContentJson(['text'], articleData.files.content.data)[0];

  // Insert ad elements every 3 paragraphs, considering existing adblocks
  const textContentWithAds = React.useMemo(() => {
    if (!textContent?.elements || adsDensity === 0) {
      console.log('[AdBlock] No elements or adsDensity is 0');
      return textContent;
    }

    console.log('[AdBlock] Total elements:', textContent.elements.length);
    console.log('[AdBlock] adsDensity:', adsDensity);

    // Count existing adblocks
    const existingAdsCount = textContent.elements.filter(element => element.nodeType === 'adblock').length;

    console.log('[AdBlock] Existing adblocks:', existingAdsCount);

    // If we already have enough ads, return as is
    if (existingAdsCount >= adsDensity) {
      console.log('[AdBlock] Already have enough ads, returning as is');
      return textContent;
    }

    const maxNewAds = adsDensity - existingAdsCount;
    console.log('[AdBlock] Max new ads to add:', maxNewAds);

    const newElements: typeof textContent.elements = [];
    let paragraphsSinceLastAd = 0;
    let adsAdded = 0;

    textContent.elements.forEach((element, index) => {
      newElements.push(element);

      if (element.nodeType === 'p') {
        paragraphsSinceLastAd++;
        console.log(`[AdBlock] Paragraph at index ${index}, count since last ad: ${paragraphsSinceLastAd}`);
      } else if (element.nodeType === 'adblock') {
        // Reset counter when we encounter an existing adblock
        console.log(`[AdBlock] Found existing adblock at index ${index}, resetting counter`);
        paragraphsSinceLastAd = 0;
      }

      // Insert ad after every 3 paragraphs
      if (element.nodeType === 'p' && paragraphsSinceLastAd === 3 && adsAdded < maxNewAds) {
        console.log(`[AdBlock] Reached 3 paragraphs at index ${index}, checking if we can add ad...`);

        // Check if we have at least 3 more paragraphs ahead or an existing adblock
        const remainingElements = textContent.elements.slice(index + 1);
        const nextParagraphsCount = remainingElements.filter(el => el.nodeType === 'p').length;
        const hasAdblockAhead = remainingElements.some(el => el.nodeType === 'adblock');

        console.log(`[AdBlock] Paragraphs ahead: ${nextParagraphsCount}, has adblock ahead: ${hasAdblockAhead}`);

        // Only add if we can maintain 3 paragraphs distance to the end or next adblock
        if (nextParagraphsCount >= 3 || hasAdblockAhead) {
          console.log(`[AdBlock] ✓ Adding new adblock after index ${index}`);
          newElements.push({
            nodeType: 'adblock',
            attributes: {},
            elements: [],
            value: '',
          });
          paragraphsSinceLastAd = 0;
          adsAdded++;
        } else {
          console.log(`[AdBlock] ✗ Cannot add adblock - not enough paragraphs ahead`);
        }
      }
    });

    console.log('[AdBlock] Total ads added:', adsAdded);
    console.log('[AdBlock] Final elements count:', newElements.length);

    return {
      ...textContent,
      elements: newElements,
    };
  }, [textContent, adsDensity]);

  return (
    <PageLayout data={data}>
      <div className="flex flex-col">
      <HeroCoverImage data={articleData} format="Ultrawide_large" preferredImage="main" />
      <div className="container mx-auto px-space-md xl:px-reading-inset mt-space-xl mb-space-2xl">
        <Summary data={articleData} />
        <div>{renderContent(textContentWithAds, articleData, undefined, 'flex flex-col gap-space-sm')}</div>
      </div>
      <div className="flex justify-center mb-space-5xl">
        {/* Placeholder for advertisement */}
        <img src="https://placehold.co/1200x259?text=Adv" alt="Advertisement" />
      </div>
      </div>
    </PageLayout>
  );
};

export default Article;
