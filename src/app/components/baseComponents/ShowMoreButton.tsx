'use client';
import { ChevronRight } from 'lucide-react';
import { Button } from './button';

// "Show more" pill button below paginated lists.
const ShowMoreButton = ({ onClick }: { onClick: () => void }) => (
  <div className="flex justify-center mt-space-xl">
    <Button variant="dark" onClick={onClick}>
      Show more <ChevronRight className="link-arrow w-4 h-4" />
    </Button>
  </div>
);

export default ShowMoreButton;
