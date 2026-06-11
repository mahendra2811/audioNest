import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Plain (non-client) module so both Server and Client Components can call
 * buttonVariants() — e.g. styling a <Link>/<a> as a button.
 */
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap transition-all duration-150 select-none disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'bg-brand text-white shadow-sm hover:brightness-[1.06] hover:shadow-md active:brightness-95',
        solid: 'bg-primary text-primary-fg shadow-sm hover:brightness-110 active:brightness-95',
        secondary:
          'bg-surface-2 text-fg border border-line hover:border-line-strong hover:bg-surface',
        ghost: 'text-muted hover:text-fg hover:bg-surface-2',
        danger: 'bg-red-500 text-white shadow-sm hover:bg-red-600 active:brightness-95',
      },
      size: {
        sm: 'h-9 px-3.5 text-sm',
        md: 'h-11 px-5 text-sm',
        lg: 'h-12 px-7 text-base',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>
