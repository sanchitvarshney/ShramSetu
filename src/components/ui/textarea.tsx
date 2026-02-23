import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-[6px] border border-[#E0E0E0] bg-white px-3 py-2.5 text-sm text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06)] placeholder:text-[#888888] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E0E0E0] focus-visible:border-[#E0E0E0] disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
