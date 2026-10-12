import { BaseModel, PageData } from '@eidosmedia/neon-frontoffice-ts-sdk';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faYoutube, faLinkedin, IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { ChevronRight } from 'lucide-react';
import { ChatIcon, InsightIcon, MailIcon, RESOURCE_LINK_CLASS } from '../icons/ResourceIcons';

const SOCIAL_ICONS: { pattern: RegExp; icon: IconDefinition }[] = [
  { pattern: /facebook\.com/i, icon: faFacebook },
  { pattern: /linkedin\.com/i, icon: faLinkedin },
  { pattern: /youtube\.com/i, icon: faYoutube },
];

function getSocialIcon(value?: string) {
  return SOCIAL_ICONS.find(({ pattern }) => value && pattern.test(value))?.icon;
}

type ResourcesBandProps = {
  data: Partial<PageData<BaseModel>>;
  updaterUrl?: string;
  contactUrl?: string;
};

// "Resources" band shown at the bottom of the Newsroom pages and news articles.
export default async function ResourcesBand({ data, updaterUrl = '/updater/', contactUrl = '/contact-us' }: ResourcesBandProps) {
  const siteName = data.siteData?.siteName || data.siteNode?.name;
  const site = siteName ? await connection.findSite(siteName) : undefined;
  const socialMenu = site?.menus?.Social;

  return (
    <div className="pb-space-3xl">
      <div className="max-w-page mx-auto rounded-2xl bg-surface px-space-xl py-space-2xl">
        <h2 className="text-h2 text-heading text-center mb-space-xl">Resources</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-xl text-left">
          <div>
            <MailIcon />
            <p className="font-semibold text-heading mb-space-2xs">Press and media inquiries</p>
            <p className="text-body-sm text-copy-muted mb-space-xs">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed.</p>
            <a href="mailto:media@eidosmedia.com" className={RESOURCE_LINK_CLASS}>
              media@eidosmedia.com
            </a>
          </div>

          <div>
            <InsightIcon />
            <p className="font-semibold text-heading mb-space-2xs">Insights - The Updater</p>
            <p className="text-body-sm text-copy-muted mb-space-xs">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed.</p>
            <a href={updaterUrl} className={RESOURCE_LINK_CLASS}>
              Read The Updater
              <ChevronRight className="w-4 h-4" strokeWidth={3} aria-hidden="true" />
            </a>
          </div>

          <div>
            <ChatIcon />
            <p className="font-semibold text-heading mb-space-2xs">Stay connected</p>
            <p className="text-body-sm text-copy-muted mb-space-2xs">Lorem ipsum dolor sit amet.</p>
            <a href={contactUrl} className={`${RESOURCE_LINK_CLASS} flex w-fit mb-space-sm`}>
              Contact us
              <ChevronRight className="w-4 h-4" strokeWidth={3} aria-hidden="true" />
            </a>
            {(socialMenu?.items?.length ?? 0) > 0 && (
              <div className="flex items-center gap-space-xs">
                {socialMenu?.items.map((item: any, idx: number) => {
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
                      className="w-9 h-9 rounded-full bg-ink flex items-center justify-center hover:opacity-80 transition-opacity"
                    >
                      <FontAwesomeIcon icon={icon} className="text-inverse text-body-sm" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
