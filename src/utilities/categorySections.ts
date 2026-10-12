import { headers } from 'next/headers';
import { BaseModel } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { getAuthOptions } from '@/utilities/security';
import { SectionCategory } from '@/utilities/sectionCategories';

export type SectionModel = { data: BaseModel & { children?: string[] }; nodes: Record<string, BaseModel> };

// Articles published in a category subsection (e.g. /newsroom/news-release/, /updater/technology/) are
// children of that subsection, not of the listing section. Merge the children of the category subsections
// into the listing section model, so it lists every article.
export const withCategorySections = async <T extends { model: SectionModel }>(
  data: T,
  categories: SectionCategory[],
): Promise<T> => {
  const hostname = (await headers()).get('x-neon-backend-url');
  const sectionUrl = data.model.data.url;
  if (!hostname || !sectionUrl) return data;

  const auth = await getAuthOptions();
  const sections = await Promise.all(
    categories.map(async ({ slug }) => {
      try {
        const response = await connection.makePageRequest(`${hostname}${sectionUrl}${slug}/`, auth, {
          redirect: 'manual',
          cache: 'no-cache',
        });
        if (response.status !== 200) return undefined;
        return (await response.json())?.model as SectionModel | undefined;
      } catch {
        return undefined;
      }
    }),
  );

  const nodes = { ...data.model.nodes };
  const children = [...(data.model.data.children ?? [])];
  sections.forEach(section => {
    Object.assign(nodes, section?.nodes);
    (section?.data?.children ?? []).forEach(id => {
      if (!children.includes(id)) children.push(id);
    });
  });

  return { ...data, model: { ...data.model, nodes, data: { ...data.model.data, children } } };
};
