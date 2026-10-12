// Classes of a pill tab (category / topic filters): the active one is filled with the primary color.
export const pillTabClasses = (isActive: boolean) =>
  `rounded-full px-space-md py-space-2xs text-body-sm font-semibold no-underline border-none cursor-pointer transition-colors ${
    isActive ? 'bg-primary text-inverse' : 'bg-transparent text-heading hover:bg-surface'
  }`;
