"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const pathname = usePathname();
  const current = useLocale();

  return (
    <nav aria-label={t("label")}>
      <ul className="inline-flex items-center gap-0.5 rounded-full border border-line bg-white p-1 group-data-[transparent=true]/header:border-white/25 group-data-[transparent=true]/header:bg-white/10">
        {routing.locales.map((locale) => (
          <li key={locale}>
            <Link
              href={pathname}
              locale={locale}
              hrefLang={locale}
              aria-current={locale === current ? "true" : undefined}
              className="flex h-8 min-w-10 items-center justify-center rounded-full px-2.5 font-semibold text-ink-700 text-xs uppercase tracking-wide transition-colors hover:text-ink-900 aria-[current=true]:bg-ink-900 aria-[current=true]:text-white group-data-[transparent=true]/header:text-white/85 group-data-[transparent=true]/header:hover:text-white group-data-[transparent=true]/header:aria-[current=true]:bg-white group-data-[transparent=true]/header:aria-[current=true]:text-ink-900"
            >
              {locale}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
