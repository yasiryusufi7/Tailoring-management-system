import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/utils'

function Avatar({ className, src, alt, fallback, size = 'default', ...props }) {
  const sizes = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    default: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  }

  return (
    <div className={cn('relative flex shrink-0 overflow-hidden rounded-full', sizes[size], className)} {...props}>
      {src ? (
        <img src={src} alt={alt || ''} className="aspect-square h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/40 text-primary font-semibold">
          {fallback || getInitials(alt || 'U')}
        </div>
      )}
    </div>
  )
}

export { Avatar }
