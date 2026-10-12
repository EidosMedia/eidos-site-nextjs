import { ArrowDown, CircleArrowRight } from 'lucide-react';

export default function NewsAndViewsSection() {
  return (
    <section className="w-full py-space-5xl px-space-md md:px-0">
      <div className="max-w-content mx-auto">
        <div className="flex items-center gap-space-2xs mb-space-xl">
          <ArrowDown className="icon-md" strokeWidth={2} />
          <h3 className="eyebrow">News & Views</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {/* Article 1 */}
          <div className="flex flex-col group cursor-pointer">
            <div className="rounded-media overflow-hidden mb-space-md relative aspect-[16/9] w-full bg-line"></div>

            <h3 className="mb-space-sm">Neon – AI future-proofs the CMS</h3>
            <div className="flex items-center gap-space-2xs">
              <CircleArrowRight className="icon-md shrink-0" strokeWidth={1.5} />
              <span className="font-bold">Read more</span>
            </div>
          </div>

          {/* Article 2 */}
          <div className="flex flex-col group cursor-pointer">
            <div className="rounded-media overflow-hidden mb-space-md relative aspect-[16/9] w-full bg-line"></div>

            <h3 className="mb-space-sm">Eidosmedia partners with gateB on advanced financial CMS solutions</h3>
            <div className="flex items-center gap-space-2xs">
              <CircleArrowRight className="icon-md shrink-0" strokeWidth={1.5} />
              <span className="font-bold">Read more</span>
            </div>
          </div>

          {/* Article 3 */}
          <div className="flex flex-col group cursor-pointer">
            <div className="rounded-media overflow-hidden mb-space-md relative aspect-[16/9] w-full bg-line"></div>

            <h3 className="mb-space-sm">Using AI to power investment research</h3>
            <div className="flex items-center gap-space-2xs">
              <CircleArrowRight className="icon-md shrink-0" strokeWidth={1.5} />
              <span className="font-bold">Read more</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
