import { BaseModel, MenuItem, PageData } from '@eidosmedia/neon-frontoffice-ts-sdk';
import Logo from './Logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faYoutube,
  faLinkedin,
  faXTwitter,
  faInstagram,
  faTiktok,
  IconDefinition,
} from '@fortawesome/free-brands-svg-icons';
import FooterMenu, { FooterGroup } from './FooterMenu';

const SOCIAL_ICONS: { pattern: RegExp; icon: IconDefinition }[] = [
  { pattern: /facebook\.com/i, icon: faFacebook },
  { pattern: /(twitter\.com|x\.com)/i, icon: faXTwitter },
  { pattern: /linkedin\.com/i, icon: faLinkedin },
  { pattern: /youtube\.com/i, icon: faYoutube },
  { pattern: /instagram\.com/i, icon: faInstagram },
  { pattern: /tiktok\.com/i, icon: faTiktok },
];

function getSocialIcon(value?: string) {
  return SOCIAL_ICONS.find(({ pattern }) => value && pattern.test(value))?.icon;
}

const toLink = (item: MenuItem) => ({ label: item.label, href: item.url || item.ref || '#' });

// Link groups of a footer column, in menu order: consecutive plain links share an untitled group,
// each sub-group (e.g. "Financial Services" in the Navbar "Industries" item) becomes a titled group.
function toGroups(items: MenuItem[] = []): FooterGroup[] {
  const groups: FooterGroup[] = [];
  for (const item of items) {
    if (item.items?.length > 0) {
      groups.push({ title: item.label, links: item.items.map(toLink) });
    } else {
      const last = groups[groups.length - 1];
      if (last && !last.title) last.links.push(toLink(item));
      else groups.push({ links: [toLink(item)] });
    }
  }
  return groups;
}

export default async function Footer({ data }: { data: Partial<PageData<BaseModel>> }) {
  const siteName = data.siteData?.siteName || data.siteNode?.name;
  if (!siteName) {
    throw new Error('Site node data is missing');
  }
  const site = await connection.findSite(siteName);
  if (!site) {
    throw new Error('Site not found');
  }

  const menus = site.menus;
  // Columns: the full Navbar menu, then the Footer menu (e.g. Legal & Compliance)
  const columns: MenuItem[] = [...(menus?.Navbar?.items ?? []), ...(menus?.Footer?.items ?? [])];
  const socialMenu = menus?.Social;

  const footerColumns = columns.map((item, idx) => {
    const groups = toGroups(item.items);
    return { key: `${item.ref || item.label}-${idx}`, item, groups, wide: groups.some(group => group.title) };
  });
  const renderColumn = ({ key, item, groups, wide }: (typeof footerColumns)[number]) => (
    <FooterMenu key={key} url={item.url} title={item.label} groups={groups} wide={wide} />
  );

  return (
    <div className="w-full py-space-2xl md:py-space-3xl bg-primary-dark text-inverse">
      <div className="max-w-page mx-auto px-space-md">
        {/* Logo and site name */}
        <div className="flex flex-col pb-space-md md:pb-space-2xl">
          <div className="flex items-center mb-space-sm">
            <Logo variant="white" />
          </div>
          <p className="text-body-sm font-text">
            Eidosmedia, excellence in headless CMS and Enterprise content publishing systems
          </p>
        </div>

        {/* Mobile: one accordion per column. Desktop: columns with sub-groups first (Industries, Solutions; sub-groups
            side by side), then the plain link columns, all in one wrapping row: each column is as wide as its content,
            with one fixed gap between all of them (and between sub-groups), so a plain column joins the first row
            when it fits (e.g. Technology on wide screens) and the rest wraps */}
        <div className="flex flex-col md:flex-row md:flex-wrap md:gap-x-space-3xl md:gap-y-space-3xl">
          {[...footerColumns.filter(column => column.wide), ...footerColumns.filter(column => !column.wide)].map(
            renderColumn,
          )}
        </div>

        {/* Bottom bar */}
        <div className="mt-space-2xl md:pt-space-md border-t-0 md:border-t border-inverse/20 flex flex-col md:flex-row md:items-center md:justify-between gap-space-sm">
          <div className="flex flex-col items-start sm:flex-row sm:items-center gap-space-2xs">
            <Logo variant="current" size="small" className="text-inverse/60" />
            <span className="text-caption md:text-body-sm text-inverse/60">
              Copyright &copy; {new Date().getFullYear()} Eidosmedia S.p.A. - P.IVA IT11881420159 - All rights reserved.
            </span>
          </div>
          {(socialMenu?.items?.length ?? 0) > 0 && (
            <div className="flex items-center gap-space-sm">
              {socialMenu.items.map((item: MenuItem, idx: number) => {
                const href = item.url || item.ref || '#';
                const icon = getSocialIcon(href) || getSocialIcon(item.label);
                if (!icon) return null;
                return (
                  <a
                    key={item.ref || idx}
                    href={href}
                    aria-label={item.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FontAwesomeIcon icon={icon} className="text-lead hover:opacity-80 transition-opacity" />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
