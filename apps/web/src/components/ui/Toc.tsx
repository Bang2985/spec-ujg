import { useEffect, useMemo, useState, useRef } from "react"
import { cn } from "@/utils/cn"

import type { TocEntry } from "@openuji/speculator"
export type { TocEntry }

interface TocProps {
  toc: TocEntry[]
  className?: string
  onItemClick?: () => void
}

const flattedIds = (toc: TocEntry[]) => {

  const ids: string[] = []
  const walk = (entries: TocEntry[]) => {
    for(const entry of entries) {
      if (entry.id) {
        ids.push(entry.id)
      }
      if (entry.children) {
        walk(entry.children)
      }
    }
    
  }

  walk(toc)

  return ids;
}

const useActiveId = (ids: string[]) => {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {

    const observer = new IntersectionObserver(entries => {

      const intersectingIds = entries.filter(entry => entry.isIntersecting && ids.includes(entry.target.id))
      if (intersectingIds.length <= 0) return;

      if (intersectingIds.length === 1) {
        setActiveId(intersectingIds[0].target.id)
      }
      else if (intersectingIds.length > 1) {
        const sortedByTop = intersectingIds.sort((a, b) => {
          return b.target.getBoundingClientRect().top - a.target.getBoundingClientRect().top
        })
        setActiveId(sortedByTop[0].target.id)
      }   
    }, {  
      rootMargin: "-10% 0% -80% 0%",
      threshold: 0, })

    ids.forEach(id => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }

  }, [ids])

  return activeId;
}

export const Toc: React.FC<TocProps> = ({ toc, className, onItemClick }) => {
  if (!toc || toc.length === 0) return null  
  
  const tocRef = useRef<HTMLDivElement>(null)

  const ids =  useMemo(() => flattedIds(toc), [toc])
  const activeId = useActiveId(ids)

  useEffect(() => {
    if (!activeId || !tocRef.current) return;
    
    const timeoutId = setTimeout(() => {
      const activeElement = tocRef.current?.querySelector(`a[href="#${activeId}"]`) as HTMLElement;
      if (!activeElement) return;

      const container = tocRef.current!;
      const containerHeight = container.clientHeight;
      const elementTop = activeElement.offsetTop;
      const elementHeight = activeElement.offsetHeight;
      
      const isVisible = (elementTop >= container.scrollTop) && 
                       (elementTop + elementHeight <= container.scrollTop + containerHeight);

      if (!isVisible) {
        container.scrollTo({
          top: elementTop - containerHeight / 2 + elementHeight / 2,
          behavior: "smooth"
        });
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [activeId])  

  return (
    <div ref={tocRef} className="overflow-y-auto max-h-[calc(100vh-var(--height-header))] pr-3">
      <div
        className="sidebar-title text-xs font-bold uppercase tracking-wider text-zinc-400 pt-md pb-base pl-3"
      >
        Table of Contents
      </div>
          

    <nav  className={cn("flex flex-col", className)}>
      <ul className="flex flex-col list-none p-0">
        {toc.map((entry, index) => (
          <TocItem 
            key={entry.id || index} 
            entry={entry} 
            onItemClick={onItemClick} 
            activeId={activeId}
          />
        ))}
      </ul>
    </nav>
    </div>
  )
}

const TocItem: React.FC<{ 
  entry: TocEntry; 
  onItemClick?: () => void;
  activeId: string | null;
}> = ({
  entry,
  onItemClick,
  activeId,
}) => {
  const [isOpen, setIsOpen] = useState(true)

  const hasChildren = entry.children && entry.children.length > 0

  return (
    <li className="flex flex-col">
        <a
          href={`#${entry.id || ""}`}
          onClick={onItemClick}
          className={cn(
            "flex items-center group relative",
            "flex-1 py-1.5 pl-3 text-sm leading-snug transition-all border-l-2 border-transparent",
            "hover:bg-zinc-100/50 hover:text-zinc-900",
            entry.depth === 1 
              ? "font-medium text-zinc-900 mt-2" 
              : "text-zinc-600 hover:border-zinc-200",
            activeId === entry.id && "text-accent border-accent bg-accent/5 font-medium"
          )}
        >
          {entry.number && (
            <span className="mr-2 font-mono text-2xs tracking-tight text-zinc-400 group-hover:text-zinc-600 transition-colors">
              {entry.number}
            </span>
          )}
          <span>{entry.text}</span>
        </a>
      {hasChildren && isOpen && (
        <ul className="flex flex-col list-none p-0 m-0 border-l border-zinc-100 ml-4">
          {entry.children?.map((child, index) => (
            <TocItem 
              key={child.id || index} 
              entry={child} 
              onItemClick={onItemClick} 
              activeId={activeId}
            />
          ))}
        </ul>
      )}
    </li>
  )
}
