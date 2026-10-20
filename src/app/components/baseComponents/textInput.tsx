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
    <div className="relative grow-1">
      {Icon && (
        <span className="absolute left-space-sm top-1/2 -translate-y-1/2 flex text-copy-muted [&_svg]:size-4">
          {Icon}
        </span>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          // Same field style as the other DS inputs (pill, line border, primary focus ring)
          'flex h-button w-full min-w-0 rounded-full border border-line bg-canvas text-body text-copy placeholder:text-copy-subtle outline-none transition-colors',
          'hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary-lightest',
          'disabled:pointer-events-none disabled:opacity-50',
          Icon ? 'pl-space-xl pr-space-sm' : 'px-space-sm',
          className,
        )}
        {...props}
      />
    </div>
  );
}

export { Input };
