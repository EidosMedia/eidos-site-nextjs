import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Design-system buttons: the single source for button shape, size and colors. Use <Button> for buttons and
// `buttonVariants()` for links that look like buttons (e.g. <Link className={buttonVariants()}>), so changing
// a button here changes it everywhere. Height comes from --spacing-button in globals.css.
// Trailing arrow: <ChevronRight className="link-arrow w-4 h-4" /> (see the link-arrow utility).
const baseButtonVariants = cva(
  'cursor-pointer inline-flex items-center justify-center shrink-0 gap-space-2xs h-button rounded-full border-0 whitespace-nowrap font-text no-underline transition-colors duration-300 ease-out outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&>svg]:size-4 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
  {
    variants: {
      variant: {
        // Primary CTA (form submit, CTA box, Subscribe)
        default:
          'bg-primary text-inverse hover:bg-primary-hover hover:text-inverse active:bg-primary-active disabled:bg-primary-lightest disabled:text-neutral-light',
        // Dark CTA (navbar "Book a demo", "Show more", social icons)
        dark: 'bg-ink text-inverse hover:bg-ink-deep hover:text-inverse active:bg-ink-deep',
        // Light tinted button (navbar search)
        soft: 'bg-surface text-heading hover:bg-line hover:text-heading active:bg-line',
        secondary:
          'bg-neutral-lightest text-primary border-1 border-primary hover:bg-primary hover:text-background active:bg-primary active:text-background',
        ghost:
          'bg-neutral-lightest text-neutral-primary hover:bg-primary-light hover:text-primary-dark active:bg-primary',
        title: 'bg-neutral-lightest text-primary hover:bg-primary-light hover:text-primary-dark active:bg-primary',
        outline:
          'bg-transparent border-1 border-neutral-primary text-neutral-primary hover:bg-neutral-primary hover:text-inverse active:bg-ink active:text-inverse active:border-ink',
      },
      size: {
        default: 'w-fit px-space-lg text-body',
        sm: 'w-fit px-space-lg text-body-sm',
        // Round icon-only button, same height as the others
        icon: 'w-button',
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

// Variant classes merged with tailwind-merge (e.g. the `title` compound font size wins over the size's text-body)
const buttonVariants = (props?: VariantProps<typeof baseButtonVariants>) => cn(baseButtonVariants(props));

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof baseButtonVariants>) {
  return <button data-slot="button" className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };
