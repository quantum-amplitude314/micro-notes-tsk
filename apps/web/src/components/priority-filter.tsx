import { PRIORITIES, type Priority } from "@notes/contracts";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function PriorityFilter({ selected }: { selected: Priority | null }) {
  const t = useTranslations();
  const filterOptions = [
    { value: null, label: t("notes.all") },
    ...PRIORITIES.map((value) => ({ value, label: t(`priorities.${value}`) })),
  ];

  return (
    <nav aria-label={t("notes.filterLabel")}>
      <ul className="flex gap-1 rounded-lg bg-secondary p-1">
        {filterOptions.map(({ value, label }) => (
          <li key={value ?? "all"}>
            <Link
              href={value ? { pathname: "/", query: { priority: value } } : "/"}
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
