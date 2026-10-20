import Link from 'next/link';
import Navbar from './components/Navbar';
import { headers } from 'next/headers';
import Footer from './components/Footer';

export default async function NotFound() {
  const currentHeaders = await headers();
  const siteName = currentHeaders.get('x-neon-site-name') ?? '';

  return (
    <div className="w-full">
      <Navbar data={{ siteData: { siteName } }}></Navbar>
      <div className="max-w-page mx-auto px-space-md mt-space-4xl mb-space-6xl grid grid-cols-1 md:grid-cols-2 items-center gap-space-2xl">
        <div className="flex flex-col gap-space-lg">
          <h1>We are sorry, but the page you are trying to visit no longer exists or is no longer available.</h1>
          <p className="text-lead text-copy">
            You can try to check if the url is correct, use the search bar to find out the content, or&nbsp;
            <Link href="/">go to the homepage</Link>.
          </p>
        </div>
        <p
          aria-hidden="true"
          className="text-display-sm lg:text-display font-nunito-sans md:text-right text-primary select-none"
        >
          404
        </p>
      </div>
      <Footer data={{ siteData: { siteName } }} />
    </div>
  );
}
