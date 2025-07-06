"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Checkbox({
  className,
  indeterminate,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  indeterminate?: boolean;
}) {
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (ref.current) {
      // Radix Checkbox dùng button, không phải input, nên không có thuộc tính indeterminate
      // Nếu muốn custom, có thể thêm class hoặc data-attr để style riêng nếu indeterminate
      if (indeterminate) {
        ref.current.setAttribute("data-indeterminate", "true");
      } else {
        ref.current.removeAttribute("data-indeterminate");
      }
    }
  }, [indeterminate]);
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        indeterminate ? "bg-yellow-100 border-yellow-400" : "",
        className
      )}
      ref={ref}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
