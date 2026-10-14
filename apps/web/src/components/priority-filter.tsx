import type { Priority } from "@notes/contracts";
import Link from "next/link";
import { priorityOptions } from "@/lib/priority";
import { cn } from "@/lib/utils";

const filterOptions = [{ value: null, label: "All" }, ...priorityOptions];

export function PriorityFilter({ selected }: { selected: Priority | null }) {
  return (
    <nav aria-label="Filter notes by priority">
      <ul className="flex gap-1 rounded-lg bg-secondary p-1">
        {filterOptions.map(({ value, label }) => (
          <li key={label}>
            <Link
              href={value ? `/?priority=${value}` : "/"}
              aria-current={value === selected ? "page" : undefined}
              className={cn(
                "block rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                value === selected ? "bg-card shadow-sm" : "hover:bg-accent",
              )}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
