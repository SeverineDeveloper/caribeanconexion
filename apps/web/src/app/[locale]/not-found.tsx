import { buttonVariants } from "@heroui/styles";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFoundPage() {
  const t = useTranslations("NotFound");
  return (
    <section className="section-y">
      <div className="container-page max-w-2xl">
        <p className="text-eyebrow text-teal-600">404</p>
        <h1 className="mt-3 text-display-lg text-ink-900">{t("title")}</h1>
        <p className="mt-4 text-ink-700 text-lead">{t("text")}</p>
        <Link href="/" className={`${buttonVariants({ size: "lg" })} mt-10`}>
          {t("back")}
        </Link>
      </div>
    </section>
  );
}
