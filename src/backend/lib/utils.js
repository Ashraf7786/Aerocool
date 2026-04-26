import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind class names safely (handles conflicts).
 * Drop-in replacement for shadcn's cn() utility.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
