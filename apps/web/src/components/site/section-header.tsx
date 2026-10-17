export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  align?: "center" | "start";
}) {
  const centered = align === "center";
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-eyebrow text-teal-600">{eyebrow}</p>
      <h2 className="mt-3 text-display-lg text-ink-900">{title}</h2>
      {lead && <p className="mt-4 text-ink-700 text-lead">{lead}</p>}
    </div>
  );
}
