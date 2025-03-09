import React from "react";
import { cn } from "@/lib/utils";

const Button = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white px-4 py-2 bg-black text-white hover:bg-gray-800",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };