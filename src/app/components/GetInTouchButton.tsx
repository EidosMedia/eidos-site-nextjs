'use client';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './baseComponents/button';
import ContactModal from './ContactModal';

export default function GetInTouchButton({ className }: { className?: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="default"
        className={cn(
          'h-11 normal-case bg-ink border-ink text-inverse transition-colors duration-300 ease-out hover:bg-ink-deep hover:border-ink-deep active:bg-ink-deep active:border-ink-deep',
          className,
        )}
        onClick={() => setIsModalOpen(true)}
      >
        Book a demo
        <ChevronRight className="w-4 h-4" />
      </Button>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
