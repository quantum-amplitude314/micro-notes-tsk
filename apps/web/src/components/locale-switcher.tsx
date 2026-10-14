"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { useTranslations } from "next-intl";
import { DropdownMenuRadioGroup } from "@/components/ui/dropdown-menu";
import { toggleVariants } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useLocaleNavigation } from "@/lib/use-locale-navigation";
import { cn } from "@/lib/utils";

const localeOptions = [
  { value: "en", code: "EN", name: "English" },
  { value: "cs", code: "CS", name: "Čeština" },
];

export function LocaleSwitcher() {
  const { locale, pending, changeLocale } = useLocaleNavigation();
  const t = useTranslations("shell");

  return (
    <ToggleGroup
      aria-label={t("language")}
      aria-busy={pending}
      variant="outline"
      size="sm"
      spacing={0}
      value={[locale]}
      onValueChange={([value]) => {
        if (value) changeLocale(value);
      }}
      disabled={pending}
    >
      {localeOptions.map(({ value, code, name }) => (
        <ToggleGroupItem key={value} value={value} lang={value} aria-label={name} title={name}>
          {code}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

export function LocaleMenu() {
  const { locale, pending, changeLocale } = useLocaleNavigation();
  const t = useTranslations("shell");

  return (
    <div className="flex items-center justify-between gap-4 px-2 py-1 text-sm">
      <span id="locale-menu-label">{t("language")}</span>
      <DropdownMenuRadioGroup
        aria-labelledby="locale-menu-label"
        value={locale}
        onValueChange={changeLocale}
        className="flex rounded-md shadow-xs"
      >
        {localeOptions.map(({ value, code, name }) => (
          <MenuPrimitive.RadioItem
            key={value}
            value={value}
            lang={value}
            aria-label={name}
            disabled={pending}
            className={cn(
              toggleVariants({ variant: "outline", size: "sm" }),
              "rounded-none border-l-0 px-2 shadow-none first:rounded-l-md first:border-l last:rounded-r-md data-checked:bg-muted data-highlighted:z-10 data-highlighted:ring-[3px] data-highlighted:ring-ring/50",
            )}
          >
            {code}
          </MenuPrimitive.RadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </div>
  );
}
