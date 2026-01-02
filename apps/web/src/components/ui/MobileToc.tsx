"use client"

import * as React from "react"
import { Menu } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Toc, type TocEntry } from "./Toc"

interface MobileTocProps {
  toc: TocEntry[]
}

export const MobileToc: React.FC<MobileTocProps> = ({ toc }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="md:hidden p-2 rounded-md hover:bg-accent-soft transition-colors"
          aria-label="Toggle Table of Contents"
        >
          <Menu className="h-6 w-6 text-accent" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[320px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left text-accent font-bold mb-4">
            Table of Contents
          </SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <Toc toc={toc} onItemClick={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
