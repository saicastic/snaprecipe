import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  label?: string;
}

export function LoadingSpinner({
  size = 32,
  className,
  label = "Loading...",
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-2"
    >
      <Loader2
        className={cn("animate-spin text-primary", className)}
        size={size}
        aria-hidden="true"
      />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
