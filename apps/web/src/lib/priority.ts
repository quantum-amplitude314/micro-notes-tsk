import { PRIORITIES, type Priority } from "@notes/contracts";

export const priorityLabels: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const priorityOptions = PRIORITIES.map((value) => ({ value, label: priorityLabels[value] }));
