import type { SeverityColor } from "@/lib/growth/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

const variantMap = {
  green: "success",
  yellow: "warning",
  orange: "caution",
  red: "danger",
} as const;

type StatusBadgeProps = {
  label: string;
  color?: SeverityColor | null;
  className?: string;
};

export function StatusBadge({
  label,
  color = "green",
  className,
}: StatusBadgeProps) {
  const variant = variantMap[color ?? "green"];
  return (
    <Badge variant={variant} className={cn("capitalize", className)}>
      {label}
    </Badge>
  );
}
