import type { ReactNode } from "react";

/** Encabezado de página del panel: título, descripción y acciones (docs/DESIGN.md §9). */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-display-md text-ink-900">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-ink-500">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-3">{actions}</div>}
    </div>
  );
}
