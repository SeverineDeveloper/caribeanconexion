"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

// Curva y duraciones de docs/DESIGN.md §8. Con movimiento reducido no se anima nada.
const EASE = [0.22, 1, 0.36, 1] as const;

// Se dispara cuando el borde superior entra en el 85 % inferior de la pantalla. Con un
// porcentaje del elemento («amount: 0.2») un bloque más alto que 5 pantallas (la lista de
// excursiones en móvil) nunca llega al umbral y se queda invisible.
const VIEWPORT = { once: true, amount: "some", margin: "0px 0px -15% 0px" } as const;

/** Aparece suavemente (fade + subida) al entrar en pantalla, una sola vez. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

const group: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.09 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

type ListTag = "ul" | "ol" | "div";

/** Contenedor que escalona la aparición de sus RevealItem. */
export function RevealGroup({
  children,
  className,
  as = "ul",
}: {
  children: ReactNode;
  className?: string;
  as?: ListTag;
}) {
  const reduce = useReducedMotion();
  const Tag = as;
  if (reduce) return <Tag className={className}>{children}</Tag>;
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={group}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  as = "li",
}: {
  children: ReactNode;
  className?: string;
  as?: "li" | "div";
}) {
  const reduce = useReducedMotion();
  const Tag = as;
  if (reduce) return <Tag className={className}>{children}</Tag>;
  const MotionTag = motion[as];
  return (
    <MotionTag className={className} variants={item}>
      {children}
    </MotionTag>
  );
}
