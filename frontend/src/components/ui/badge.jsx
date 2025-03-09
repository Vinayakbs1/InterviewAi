import React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2",
        variant === "outline" && "border-gray-200 text-gray-950",
        variant === "default" && "border-transparent bg-gray-900 text-gray-50",
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export { Badge };