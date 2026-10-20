import { ChevronRight } from 'lucide-react';
import { ChatIcon, MailIcon, RESOURCE_LINK_CLASS } from '../icons/ResourceIcons';
import SubscribeForm from './SubscribeForm';

type UpdaterSubscribeBandProps = {
  contactUrl?: string;
};

// "Subscribe to The Updater" band at the bottom of the Updater pages: newsletter + press + feedback.
const UpdaterSubscribeBand = ({ contactUrl = '/contact-us' }: UpdaterSubscribeBandProps) => (
  <div className="pb-space-3xl">
    <div className="rounded-2xl bg-surface px-space-xl py-space-2xl grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-space-xl">
      <div className="flex flex-col gap-space-sm">
        <h2 className="text-h3 text-heading">Subscribe to The Updater</h2>
        <p className="text-body-sm text-copy-muted">Stay connected to the dolor sit amet, consectetuer adipiscing elit, sed.</p>
        <SubscribeForm />
      </div>

      <div>
        <MailIcon />
        <p className="font-title text-heading mb-space-2xs">Press and media inquiries</p>
        <p className="text-body-sm text-copy-muted mb-space-xs">Lorem ipsum dolor sit amet, consectetuer adipiscing.</p>
        <a href="mailto:media@eidosmedia.com" className={RESOURCE_LINK_CLASS}>
          media@eidosmedia.com
        </a>
      </div>

      <div>
        <ChatIcon />
        <p className="font-title text-heading mb-space-2xs">Have any feedback or question?</p>
        <p className="text-body-sm text-copy-muted mb-space-xs">We&apos;d love to hear from you.</p>
        <a href={contactUrl} className={RESOURCE_LINK_CLASS}>
          Contact us
          <ChevronRight className="link-arrow w-4 h-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  </div>
);

export default UpdaterSubscribeBand;
