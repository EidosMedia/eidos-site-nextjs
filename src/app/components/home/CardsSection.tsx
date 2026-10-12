import { CircleArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CardsSection() {
  return (
    <section className="w-full max-w-content mx-auto px-space-md md:px-0 py-space-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
        {/* Card 1 - Financial Services */}
        <div className="bg-canvas rounded-xl shadow-lg overflow-hidden flex flex-col h-full">
          <div className="p-space-lg flex-grow">
            <p className="mb-space-2xs eyebrow text-copy-muted">Financial Services</p>
            <p className="text-h3 text-heading mb-space-md">AI power – and governance</p>
            <p className="mb-space-sm text-body text-copy">
              From the creation and delivery of investment research to wealth and asset management, generative AI
              technologies are enhancing the quality and reach of financial advisory.
            </p>
            <p className="mb-space-sm text-body text-copy">
              The potential is huge - but correct governance is essential.
            </p>
            <p className="mb-space-lg text-body text-copy">
              Our customers benefit from the controlled integration of powerful AI technologies into their operations
              - while maintaining the highest standards of data security and compliance.
            </p>
            <blockquote className="border-l-0 italic text-copy text-lead mb-space-2xs">
              &ldquo;The real risk is missing out on tremendous opportunity in an extremely fluid time for investment
              research.&rdquo;
            </blockquote>
            <p className="text-body-sm text-copy-muted">Mike Carrodus, CEO, Substantive Research.</p>
          </div>
          <div className="bg-gradient-to-r from-primary to-primary-light p-space-md flex flex-col sm:flex-row gap-space-sm justify-between items-start sm:items-center text-inverse mt-auto">
            <Link href="#" className="flex items-center gap-space-2xs hover:underline text-body font-bold">
              <CircleArrowRight className="icon-md shrink-0" /> Investment research
            </Link>
            <Link href="#" className="flex items-center gap-space-2xs hover:underline text-body font-bold">
              <CircleArrowRight className="icon-md shrink-0" /> Asset management
            </Link>
          </div>
        </div>

        {/* Card 2 - News Media */}
        <div className="bg-canvas rounded-xl shadow-lg overflow-hidden flex flex-col h-full">
          <div className="p-space-lg flex-grow">
            <p className="mb-space-2xs eyebrow text-copy-muted">News Media</p>
            <p className="text-h3 text-heading mb-space-md">End-to-end AI integration</p>
            <p className="mb-space-sm text-body text-copy">
              From accelerated research to automated print page layout, agentic AI technology is transforming the
              creation and delivery of news content in every channel and format.
            </p>
            <p className="mb-space-sm text-body text-copy">
              Existing workflows are being accelerated, while entirely new sources of value and revenue are emerging.
            </p>
            <p className="mb-space-lg text-body text-copy">
              Our customers stay ahead of these developments with constantly evolving digital solutions that maximise
              the scope and profitability of their news portfolios.
            </p>
            <blockquote className="border-l-0 italic text-copy text-lead mb-space-2xs">
              &ldquo;Page automation ensures the continued survival of print editions.&rdquo;
            </blockquote>
            <p className="text-body-sm text-copy-muted">
              Ulrich Schönborn, Editor-in-Chief, Nordwest Mediengrupp, Germany
            </p>
          </div>
          <div className="bg-gradient-to-r from-primary to-media-red p-space-md flex flex-col sm:flex-row gap-space-sm justify-between items-start sm:items-center text-inverse mt-auto">
            <Link href="#" className="flex items-center gap-space-2xs hover:underline text-body font-bold">
              <CircleArrowRight className="icon-md" /> Find out more about News Media
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
