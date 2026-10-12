'use client';

import { useRouter } from 'next/navigation';
import { Button } from './baseComponents/button';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchButtonProps {
  onClick?: () => void;
  iconOnly?: boolean;
}

export default function SearchButton({ onClick, iconOnly = false }: SearchButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) onClick();
    router.push('/search');
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      aria-label="Search"
      className={cn(
        'border-0 bg-surface text-heading transition-colors duration-300 ease-out hover:bg-line hover:text-heading',
        iconOnly && 'aspect-square h-11 w-11 p-0',
      )}
    >
      <Search />
      {!iconOnly && 'Search'}
    </Button>
  );
}
