import { cache } from 'react';
import { headers } from 'next/headers';
import { BaseModel } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { getAuthOptions } from '@/utilities/security';

// Section listings only carry a summary of each article. Fetch the full article data (body, authors, ...)
// for a listed item. Cached per request, so helpers enriching the same items fetch each article once.
export const loadFullArticle = cache(async (url: string): Promise<BaseModel | undefined> => {
  const hostname = (await headers()).get('x-neon-backend-url');
  if (!hostname || !url) return undefined;
  try {
    const response = await connection.makePageRequest(`${hostname}${url}`, await getAuthOptions(), {
      redirect: 'manual',
      cache: 'no-cache',
    });
    if (response.status !== 200) return undefined;
    return (await response.json())?.model?.data as BaseModel | undefined;
  } catch {
    return undefined;
  }
});
