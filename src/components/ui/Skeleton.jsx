import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }) {
  return (
    <div className={cn('shimmer-bg rounded-md', className)} {...props} />
  )
}

export { Skeleton }
