'use client';

import { useRouter } from 'next/navigation';
import { Button } from './baseComponents/button';
import { Search } from 'lucide-react';

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
    <Button variant="soft" size={iconOnly ? 'icon' : 'default'} onClick={handleClick} aria-label="Search">
      <Search />
      {!iconOnly && 'Search'}
    </Button>
  );
}
