"use client";

import { Tabs } from "@heroui/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type { ExcursionCardItem } from "@/lib/excursion-cards";
import { ExcursionCard } from "./excursion-card";

/** Catálogo de excursiones con filtro por tipo (pestañas) y transiciones de reordenamiento. */
export function ExcursionsExplorer({
  items,
  categories,
  allLabel,
  filterLabel,
  countLabel,
}: {
  items: ExcursionCardItem[];
  categories: { id: string; label: string }[];
  allLabel: string;
  filterLabel: string;
  /** Texto ya traducido por cantidad: { [n]: "n experiencias" } */
  countLabel: Record<number, string>;
}) {
  const [filter, setFilter] = useState("all");
  const reduce = useReducedMotion();
  const visible = filter === "all" ? items : items.filter((item) => item.categoryId === filter);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs selectedKey={filter} onSelectionChange={(key) => setFilter(String(key))}>
          {/* En móvil las 5 categorías no caben: la píldora se desliza de borde a borde de la
              pantalla (sin la flecha de 16 px de HeroUI) y el desvanecido indica que hay más. */}
          <Tabs.ListContainer className="overflow-x-auto max-sm:-mx-5 max-sm:rounded-none max-sm:bg-transparent max-sm:[&>[data-slot=scroll-shadow]]:px-5 max-sm:[&>button]:hidden">
            <Tabs.List
              aria-label={filterLabel}
              className="max-sm:rounded-[calc(var(--radius)*2.5)] max-sm:bg-default"
            >
              {[{ id: "all", label: allLabel }, ...categories].map((tab) => (
                <Tabs.Tab key={tab.id} id={tab.id}>
                  {tab.label}
                  <Tabs.Indicator />
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
        <p className="text-ink-500 text-sm" aria-live="polite">
          {countLabel[visible.length]}
        </p>
      </div>

      <motion.ul
        layout={!reduce}
        className="mt-8 grid gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-4"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map(({ slug, categoryId: _, ...card }) => (
            <motion.li
              key={slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <ExcursionCard {...card} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
