import React from "react";
import { Copy, Check } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface CopyableCellProps {
  value: string;
  display: React.ReactNode;
  tooltipLabel: string;
  iconSize?: number;
  iconClassName?: string;
}

export const CopyableCell: React.FC<CopyableCellProps> = ({
  value,
  display,
  tooltipLabel,
  iconSize = 16,
  iconClassName = "text-gray-400",
}) => {
  const [copied, setCopied] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setOpen(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <span className="font-mono flex items-center gap-1">
      {display}
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleCopy}
            className="ml-1 p-1 rounded hover:bg-blue-100 cursor-pointer"
            tabIndex={0}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            {copied ? (
              <Check size={iconSize} className={iconClassName} />
            ) : (
              <Copy size={iconSize} className={iconClassName} />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>{copied ? "Copied" : tooltipLabel}</TooltipContent>
      </Tooltip>
    </span>
  );
};
