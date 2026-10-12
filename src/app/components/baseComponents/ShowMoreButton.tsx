'use client';
import { ChevronRight } from 'lucide-react';

// "Show more" pill button below paginated lists.
const ShowMoreButton = ({ onClick }: { onClick: () => void }) => (
  <div className="flex justify-center mt-space-xl">
    <button
      onClick={onClick}
      className="inline-flex items-center gap-space-3xs rounded-full bg-ink text-inverse text-body-sm font-semibold px-space-md py-space-xs border-none cursor-pointer hover:bg-ink-deep"
    >
      Show more <ChevronRight className="w-4 h-4" />
    </button>
  </div>
);

export default ShowMoreButton;
