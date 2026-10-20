import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Teach tailwind-merge the design-system tokens (see globals.css), otherwise it doesn't know they conflict:
// - font sizes (--text-*): it treats e.g. `text-body` as a color and drops the real color class
// - spacing (--spacing-*): e.g. `w-button` wouldn't replace `w-fit`, `px-0` wouldn't replace `px-space-lg`
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: [
        "space-3xs",
        "space-2xs",
        "space-xs",
        "space-sm",
        "space-md",
        "space-lg",
        "space-xl",
        "space-2xl",
        "space-3xl",
        "space-4xl",
        "space-5xl",
        "space-6xl",
        "reading-inset",
        "article-aside",
        "article-indent",
        "article-indent-box",
        "button",
        "news-date",
        "news-thumb",
        "news-thumb-h",
      ],
    },
    classGroups: {
      "font-size": [
        { text: ["display", "display-sm", "h1", "h2", "h3", "lead", "body", "body-sm", "caption", "label"] },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
