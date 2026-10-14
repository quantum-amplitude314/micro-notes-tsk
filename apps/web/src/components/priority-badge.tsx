import type { Priority } from "@notes/contracts";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

const priorityStyles: Record<Priority, string> = {
  high: "bg-primary text-primary-foreground",
  medium: "bg-accent text-accent-foreground",
  low: "bg-secondary text-secondary-foreground",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const t = useTranslations();

  return (
    <Badge className={priorityStyles[priority]}>
      {t("priorityBadge", { priority: t(`priorities.${priority}`) })}
    </Badge>
  );
}
