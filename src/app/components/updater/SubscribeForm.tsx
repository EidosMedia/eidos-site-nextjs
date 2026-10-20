'use client';
import { Button } from '../baseComponents/button';

// Newsletter sign-up field. Not connected to a mailing service yet: submitting does nothing.
const SubscribeForm = () => (
  <form onSubmit={event => event.preventDefault()} className="flex flex-wrap items-center gap-space-2xs">
    <input
      type="email"
      name="email"
      required
      placeholder="name@example.com"
      aria-label="Email address"
      className="flex-1 min-w-0 h-button px-space-sm rounded-full bg-canvas border border-line text-body-sm text-copy placeholder:text-copy-subtle outline-none focus:ring-2 focus:ring-primary-lightest"
    />
    <Button type="submit">Subscribe</Button>
  </form>
);

export default SubscribeForm;
