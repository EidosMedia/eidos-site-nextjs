'use client';

// Newsletter sign-up field. Not connected to a mailing service yet: submitting does nothing.
const SubscribeForm = () => (
  <form onSubmit={event => event.preventDefault()} className="flex flex-wrap items-center gap-space-2xs">
    <input
      type="email"
      name="email"
      required
      placeholder="name@example.com"
      aria-label="Email address"
      className="flex-1 min-w-0 px-space-sm py-space-2xs rounded-full bg-canvas border border-line text-body-sm text-copy placeholder:text-copy-subtle outline-none focus:ring-2 focus:ring-primary-lightest"
    />
    <button
      type="submit"
      className="rounded-full bg-primary hover:bg-primary-hover text-inverse text-body-sm font-semibold px-space-md py-space-2xs border-none cursor-pointer transition-colors"
    >
      Subscribe
    </button>
  </form>
);

export default SubscribeForm;
