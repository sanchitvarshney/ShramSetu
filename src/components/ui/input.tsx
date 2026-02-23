import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'> {
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, suffix, prefix, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-[6px] border border-[#E0E0E0] bg-white px-3 py-2.5 text-sm text-foreground transition-colors",
          "placeholder:text-[#888888]",
          "shadow-[0_1px_2px_rgba(0,0,0,0.06)]",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E0E0E0] focus-visible:border-[#E0E0E0]",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
);
Input.displayName = "Input";

export { Input };
