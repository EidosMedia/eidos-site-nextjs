import { CheckCircle2, CircleArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WhosUsingSection() {
  return (
    <section className="py-space-5xl px-space-md md:px-0 w-full flex flex-col items-center">
      <h2 className="text-center">Who's using Eidosmedia Solutions?</h2>

      <div className="w-full max-w-content mx-auto grid grid-cols-1 md:grid-cols-2 gap-space-2xl pt-space-lg sm:pt-space-3xl">
        {/* Card 1 - Research */}
        <div className="rounded-xl shadow-lg pt-space-xl pb-space-lg px-space-lg sm:px-space-xl flex flex-col h-full relative">
          <div className="flex-grow">
            <h3 className="mb-space-md">Eidosmedia research platforms are used by:</h3>
            <ul className="flex flex-col gap-space-sm">
              <li className="flex items-center gap-space-2xs">
                <CheckCircle2 className="text-finance-tiffany shrink-0" />
                <span>Four of the top ten global investment banks</span>
              </li>
              <li className="flex items-center gap-space-2xs">
                <CheckCircle2 className="text-finance-tiffany shrink-0" />
                <span>One of the world's top three ratings agencies</span>
              </li>
              <li className="flex items-center gap-space-2xs">
                <CheckCircle2 className="text-finance-tiffany shrink-0" />
                <span>Leading asset & wealth managers and independent research providers</span>
              </li>
            </ul>
          </div>

          {/* Bottom Gradient Button Wrap */}
          <div className="w-full relative rounded-full p-space-md mt-space-3xl flex items-center bg-finance">
            <div className="flex-1 flex justify-center items-center">
              <Link href="#" className="flex items-center gap-space-2xs hover:underline">
                <CircleArrowRight className="shrink-0" strokeWidth={1.5} />
                <span className="font-bold">Read our Research case studies</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Card 2 - Editorial */}
        <div className="rounded-xl shadow-lg pt-space-xl pb-space-lg px-space-lg sm:px-space-xl flex flex-col h-full relative">
          <div className="flex-grow">
            <h3 className="mb-space-md">Eidosmedia editorial platforms are used by global news groups to deliver:</h3>
            <ul className="flex flex-col gap-space-sm">
              <li className="flex items-center gap-space-2xs">
                <CheckCircle2 className="text-finance-tiffany shrink-0" />
                <span>Multi-title digital news portfolios</span>
              </li>
              <li className="flex items-center gap-space-2xs">
                <CheckCircle2 className="text-finance-tiffany shrink-0" />
                <span>Mobile news and social media content</span>
              </li>
              <li className="flex items-center gap-space-2xs">
                <CheckCircle2 className="text-finance-tiffany shrink-0" />
                <span>Newspapers and magazines</span>
              </li>
            </ul>
          </div>

          {/* Bottom Gradient Button Wrap */}
          <div className="w-full relative rounded-full p-space-md mt-space-3xl flex items-center bg-media">
            <div className="flex-1 flex justify-center items-center">
              <Link href="#" className="flex items-center gap-space-2xs hover:underline">
                <CircleArrowRight className="shrink-0" strokeWidth={1.5} />
                <span className="font-bold">Read our Media case studies</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
