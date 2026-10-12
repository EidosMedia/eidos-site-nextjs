import { Pen, Image, ListVideo } from 'lucide-react';

export default function StatsBannerSection() {
  return (
    <section className="w-full relative overflow-hidden inset-0 bg-gradient-to-t from-primary/40 via-finance-purple-light/25 to-canvas opacity-80">
      <div className="w-full max-w-content mx-auto relative z-10 px-space-md md:px-0 py-space-4xl lg:py-space-5xl flex flex-col lg:flex-row items-center justify-between gap-space-2xl lg:gap-space-lg">
        {/* Left Text */}
        <div className="w-full lg:w-1/3 pr-0 lg:pr-space-xl border-b lg:border-b-0 lg:border-r border-inverse/30 pb-space-xl lg:pb-0">
          <h2>Every day Eidosmedia digital content management and delivery platforms serve:</h2>
        </div>

        {/* Right Stats Grid */}
        <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {/* Stat 1 */}
          <div className="flex flex-col items-center text-center relative">
            <div className="w-24 h-24 bg-canvas rounded-full flex items-center justify-center mb-space-md">
              <Pen />
            </div>
            <h3 className="font-bold mb-space-2xs">+32 K</h3>
            <p>Authors & coordinators</p>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-center text-center relative border-t md:border-t-0 md:border-l border-inverse/30 pt-space-lg md:pt-0">
            <div className="w-24 h-24 bg-canvas rounded-full flex items-center justify-center mb-space-md">
              <Image />
            </div>
            <h3 className="font-bold mb-space-2xs">+280 K</h3>
            <p>Digital assets</p>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col items-center text-center relative border-t md:border-t-0 md:border-l border-inverse/30 pt-space-lg md:pt-0">
            <div className="w-24 h-24 bg-canvas rounded-full flex items-center justify-center mb-space-md">
              <ListVideo />
            </div>
            <h3 className="font-bold mb-space-2xs">+45 K</h3>
            <p>Multimedia stories</p>
          </div>
        </div>
      </div>
    </section>
  );
}
