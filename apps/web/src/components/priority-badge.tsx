import type { Priority } from "@notes/contracts";
import { Badge } from "@/components/ui/badge";
import { priorityLabels } from "@/lib/priority";

const priorityStyles: Record<Priority, string> = {
  high: "bg-primary text-primary-foreground",
  medium: "bg-accent text-accent-foreground",
  low: "bg-secondary text-secondary-foreground",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <Badge className={priorityStyles[priority]}>{priorityLabels[priority]} priority</Badge>;
}
