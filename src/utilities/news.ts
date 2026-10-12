import { BaseModel } from '@eidosmedia/neon-frontoffice-ts-sdk';

// Listings only resolve crop URLs for some link types, so try each in turn.
export const getNewsImageUrl = (node: BaseModel, format: string): string | undefined =>
  node.links?.system?.mainPicture?.[0]?.dynamicCropsResourceUrls?.[format] ??
  (node.links as any)?.system?.teaserPicture?.[0]?.dynamicCropsResourceUrls?.[format] ??
  (node.links as any)?.hyperlink?.image?.[0]?.dynamicCropsResourceUrls?.[format];

const ordinalSuffix = (day: number) => {
  if (day % 100 >= 11 && day % 100 <= 13) return 'th';
  return ['th', 'st', 'nd', 'rd'][day % 10] ?? 'th';
};

// "21st September, 2026"
export const formatOrdinalDate = (date?: string | number) => {
  if (date === undefined || date === '') return '';
  const value = new Date(date);
  if (isNaN(value.getTime())) return '';
  const day = value.getDate();
  const month = value.toLocaleDateString('en-US', { month: 'long' });
  return `${day}${ordinalSuffix(day)} ${month}, ${value.getFullYear()}`;
};

export const formatNewsDate = (isoDate?: string) =>
  isoDate ? new Date(isoDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
