import { type LucideIcon, PartyPopper, Sailboat, TreePalm } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";

const GROUPS: { icon: LucideIcon; key: "sea" | "land" | "occasions" }[] = [
  { icon: Sailboat, key: "sea" },
  { icon: TreePalm, key: "land" },
  { icon: PartyPopper, key: "occasions" },
];

/** Más experiencias bajo pedido (catálogo PDF, pág. 6). */
export async function MoreExperiences() {
  const t = await getTranslations();

  return (
    <div className="rounded-card border border-line bg-white p-6 shadow-card sm:p-8 lg:p-10">
      <h2 className="text-display-md text-ink-900">{t("MoreExperiences.title")}</h2>
      <RevealGroup as="div" className="mt-8 grid gap-8 md:grid-cols-3 md:gap-10">
        {GROUPS.map((group) => (
          <RevealItem key={group.key} as="div">
            <p className="flex items-center gap-3 font-semibold text-ink-900">
              <span className="flex size-10 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                <group.icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              {t(`MoreExperiences.${group.key}.title`)}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {(t.raw(`MoreExperiences.${group.key}.items`) as string[]).map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-line bg-canvas px-3 py-1.5 text-ink-700 text-sm transition-colors hover:border-teal-400 hover:text-ink-900"
                >
                  {item}
                </li>
              ))}
            </ul>
          </RevealItem>
        ))}
      </RevealGroup>
      <p className="mt-8 text-ink-500 text-sm">{t("Excursions.note")}</p>
    </div>
  );
}
