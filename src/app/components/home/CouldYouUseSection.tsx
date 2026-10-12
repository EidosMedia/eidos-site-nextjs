import Link from 'next/link';
import { Crown, ShieldCheck, Puzzle, Clock, LockKeyhole, CirclePlay, CircleArrowRight } from 'lucide-react';

export default function CouldYouUseSection() {
  return (
    <section className="w-full py-space-5xl px-space-md md:px-0">
      <div className="max-w-content mx-auto flex flex-col items-center">
        <h2 className="text-center mb-space-sm">Could you use an Eidosmedia solution?</h2>
        <p className="text-center body-large font-bold max-w-2xl mb-space-3xl">
          If you can check more than half the boxes below, you should explore what an Eidosmedia solution could do for
          your operation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md w-full pt-space-md">
          {/* Box 1 */}
          <div className="rounded-xl shadow-md px-space-lg pt-space-xl pb-space-lg relative flex flex-col items-start h-full">
            <div className="w-16 h-16 bg-finance-tiffany rounded-xl flex items-center justify-center mb-space-md">
              <Crown className="text-inverse" />
            </div>
            <h3 className="mb-space-sm">Your content has high value for your audience</h3>
            <p>
              Whether it's market intelligence, corporate communications, consulting or technical materials - your
              content has high intrinsic value for those who use it.
            </p>
          </div>

          {/* Box 2 */}
          <div className="rounded-xl shadow-md px-space-lg pt-space-xl pb-space-lg relative flex flex-col items-start h-full">
            <div className="w-16 h-16 bg-media-red rounded-xl flex items-center justify-center mb-space-md">
              <ShieldCheck className="text-inverse" />
            </div>
            <h3 className="mb-space-sm">Your content must satisfy strict requirements</h3>
            <p className="mb-space-sm">
              The material you distribute must satisfy high standards of quality and/or regulatory compliance.
              <br />
              <br />
              It may also be confidential.
            </p>
            <Link href="#" className="gap-space-2xs flex items-center text-primary hover:underline">
              <CircleArrowRight className="shrink-0" strokeWidth={1.5} />
              <span className="font-bold">Read more</span>
            </Link>
          </div>

          {/* Box 3 */}
          <div className="rounded-xl shadow-md px-space-lg pt-space-xl pb-space-lg relative flex flex-col items-start h-full">
            <div className="w-16 h-16 bg-primary-light rounded-xl flex items-center justify-center mb-space-md">
              <Puzzle className="text-inverse" />
            </div>
            <h3 className="mb-space-sm">Your content is the product of careful teamwork</h3>
            <p className="mb-space-sm">
              Several people are involved in creating, reviewing and approval before final release.
            </p>
            <Link href="#" className="gap-space-2xs flex items-center text-primary hover:underline">
              <CircleArrowRight className="shrink-0" strokeWidth={1.5} />
              <span className="font-bold">Read more</span>
            </Link>
          </div>

          {/* Box 4 */}
          <div className="rounded-xl shadow-md px-space-lg pt-space-xl pb-space-lg relative flex flex-col items-start h-full">
            <div className="w-16 h-16 bg-media-red rounded-xl flex items-center justify-center mb-space-md">
              <Clock className="text-inverse" />
            </div>
            <h3 className="mb-space-sm">You need to improve productivity</h3>
            <p className="mb-space-sm">
              You are required to produce more and produce it more quickly, without growing your resource base.
            </p>
            <Link href="#" className="gap-space-2xs flex items-center text-primary hover:underline">
              <CircleArrowRight className="shrink-0" strokeWidth={1.5} />
              <span className="font-bold">Read more</span>
            </Link>
          </div>

          {/* Box 5 */}
          <div className="bg-canvas rounded-xl shadow-md px-space-lg pt-space-xl pb-space-lg relative flex flex-col items-start h-full">
            <div className="w-16 h-16 bg-primary-light rounded-xl flex items-center justify-center mb-space-md">
              <LockKeyhole className="text-inverse" />
            </div>
            <h3 className="mb-space-sm">You need to improve collaboration</h3>
            <p className="mb-space-sm">
              Your operation has become complex and difficult to coordinate using standard office applications.
            </p>
            <Link href="#" className="gap-space-2xs flex items-center text-primary hover:underline">
              <CircleArrowRight className="shrink-0" strokeWidth={1.5} />
              <span className="font-bold">Read more</span>
            </Link>
          </div>

          {/* Box 6 */}
          <div className="rounded-xl shadow-md px-space-lg pt-space-xl pb-space-lg relative flex flex-col items-start h-full">
            <div className="w-16 h-16 bg-finance-tiffany rounded-xl flex items-center justify-center mb-space-md">
              <CirclePlay className="text-inverse" />
            </div>
            <h3 className="mb-space-sm">You need to improve security</h3>
            <p className="mb-space-sm">
              Your operation is vulnerable to attack through the weak points in standard office applications.
            </p>
            <Link href="#" className="gap-space-2xs flex items-center text-primary hover:underline">
              <CircleArrowRight className="shrink-0" strokeWidth={1.5} />
              <span className="font-bold">Case study</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
