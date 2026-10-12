import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'cursor-pointer inline-flex items-center justify-center w-fit gap-space-2xs rounded-full px-space-md py-space-md uppercase whitespace-nowrap font-semibold disabled:pointer-events-none [&_svg]:pointer-events-none [&>svg]:size-4 [&>svg:only-child]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:text-background active:ring-0 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:text-neutral-light h-8',
  {
    variants: {
      variant: {
        default:
          'bg-primary border-1 border-primary text-background hover:bg-primary-hover hover:border-primary-hover hover:text-background active:bg-primary-active active:border-primary-active disabled:bg-primary-lightest disabled:border-transparent disabled:text-neutral-light transition-colors',
        secondary:
          'bg-neutral-lightest text-primary border-1 border-primary hover:bg-primary hover:text-background active:bg-primary active:text-background',
        ghost:
          'bg-neutral-lightest text-neutral-primary border-primary hover:bg-primary-light hover:text-primary-dark active:bg-primary',
        title:
          'bg-neutral-lightest text-primary border-primary hover:bg-primary-light hover:text-primary-dark active:bg-primary',
        outline:
          'bg-transparent border-1 border-neutral-primary text-neutral-primary hover:bg-neutral-primary hover:text-inverse hover:border-neutral-primary focus:bg-neutral-primary focus:text-inverse focus:border-neutral-primary active:bg-ink active:text-inverse active:border-ink transition-colors',
      },
      size: {
        default: 'text-body',
        sm: 'text-body-sm',
      },
    },
    compoundVariants: [
      {
        variant: 'title',
        size: 'sm',
        class: 'text-lead', // 20px
      },
      {
        variant: 'title',
        size: 'default',
        class: 'text-h3', // 24px
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
  return <button data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
