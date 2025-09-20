import { Badge } from '@shadcn/components/badge';
import { LucideIcon } from 'lucide-react'
import Link from 'next/link';

interface IconButtonWithBadgeProps {
  icon: LucideIcon;
  labelBadge?: string;
  href: string;
}
export default function IconButtonWithBadge({ icon, labelBadge, href = "/"}: IconButtonWithBadgeProps) {
  const Icon = icon
  return (
      <div className="flex relative">
        <Link href={href} className="py-2 px-3 rounded-md hover:bg-accent">
          <Icon className="size-5"/>
        </Link>
        {labelBadge && (
          <Badge
            className="h-4 min-w-4 rounded-full px-1 font-mono tabular-nums absolute top-0 -right-1"
            variant="destructive"
          >
            {labelBadge.toString()}
          </Badge>
        )}
      </div>
  )
}
