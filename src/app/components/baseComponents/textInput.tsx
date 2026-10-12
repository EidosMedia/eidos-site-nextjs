import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({
  className,
  type,
  Icon,
  ...props
}: React.ComponentProps<'input'> & {
  Icon?: React.ReactNode;
}) {
  return (
    <div className="relative h-fit grow-1 font-gabarito">
      {Icon && <span className="absolute text-neutral-light-2 -translate-y-1/2 top-1/2 left-0 mx-space-2xs">{Icon}</span>}
      <input
        type={type}
        data-slot="input"
        className={cn(
          'text-body placeholder:text-neutral-light-2 selection:text-primary-foreground flex w-full min-w-0 rounded-sm border-1 border-neutral-primary bg-transparent py-space-xs transition-[color] outline-none h-8',
          'hover:border-primary',
          'focus:ring-1 focus:ring-primary ',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-neutral-light-2',
          Icon ? 'pl-space-xl pr-space-2xs' : 'px-space-2xs',
          className
        )}
        {...props}
      />
    </div>
  );
}

export { Input };
