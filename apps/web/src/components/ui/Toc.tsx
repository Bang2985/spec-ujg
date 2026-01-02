import * as React from "react"
import { cn } from "@/utils/cn"

import type { TocEntry } from "@openuji/speculator"
export type { TocEntry }

interface TocProps {
  toc: TocEntry[]
  className?: string
  onItemClick?: () => void
}

export const Toc: React.FC<TocProps> = ({ toc, className, onItemClick }) => {
  if (!toc || toc.length === 0) return null

  return (
    <nav className={cn("flex flex-col gap-2", className)}>
      <ul className="flex flex-col gap-1 list-none p-0 m-0">
        {toc.map((entry, index) => (
          <TocItem key={entry.id || index} entry={entry} onItemClick={onItemClick} />
        ))}
      </ul>
    </nav>
  )
}

const TocItem: React.FC<{ entry: TocEntry; onItemClick?: () => void }> = ({
  entry,
  onItemClick,
}) => {
  const [isOpen, setIsOpen] = React.useState(true)

  const hasChildren = entry.children && entry.children.length > 0

  return (
    <li className="flex flex-col">
      <div className="flex items-center group">
        <a
          href={`#${entry.id || ""}`}
          onClick={onItemClick}
          className={cn(
            "flex-1 py-1 px-2 text-sm transition-colors rounded-md hover:bg-accent-soft hover:text-accent",
            entry.depth === 1 ? "font-semibold" : "text-muted"
          )}
          style={{ paddingLeft: `${entry.depth * 0.75}rem` }}
        >
          {entry.number && <span className="mr-2 opacity-50 font-mono text-xs">{entry.number}</span>}
          {entry.text}
        </a>
      </div>
      {hasChildren && isOpen && (
        <ul className="flex flex-col list-none p-0 m-0">
          {entry.children?.map((child, index) => (
            <TocItem key={child.id || index} entry={child} onItemClick={onItemClick} />
          ))}
        </ul>
      )}
    </li>
  )
}
