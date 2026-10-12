import { BaseModel, MenuItem, PageData } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { headers } from 'next/headers';
import NavbarClient from './NavbarClient';

export default async function Navbar({ data }: { data: Partial<PageData<BaseModel>> }) {
  const siteName = data.siteData?.siteName || data.siteNode?.name;
  if (!siteName) {
    throw new Error('Site node data is missing');
  }

  const site = await connection.findSite(siteName);

  if (!site) {
    throw new Error('Site not found');
  }

  const pathname = (await headers()).get('x-neon-pathname');

  const navbarMenu = site.menus?.Navbar;
  const menuItems: MenuItem[] = Array.isArray(navbarMenu?.items) ? navbarMenu.items : [];
  const fallbackItems: MenuItem[] = site.root.items.map(item => ({
    label: item.title,
    url: item.path,
    type: item.nodeType,
    items: [],
  }));

  // Prefer the menu configured in Neon and keep the sitemap as a fallback.
  return <NavbarClient items={menuItems.length > 0 ? menuItems : fallbackItems} pathname={pathname} />;
}
