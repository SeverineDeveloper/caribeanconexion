import { ROLE_LABELS } from "@cc/core";
import { buttonVariants } from "@heroui/styles";
import { ShieldCheck } from "lucide-react";
import NextLink from "next/link";
import { PanelNav } from "@/components/admin/panel-nav";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { Logo } from "@/components/brand/logo";
import { requirePanelAccess } from "@/lib/auth/session";

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  const session = await requirePanelAccess();
  const initials = session.user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-dvh bg-canvas lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)]">
      <aside className="border-line border-b bg-white lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:border-r lg:border-b-0">
        <div className="flex h-16 items-center px-5 lg:px-6">
          <NextLink href="/admin" aria-label="Inicio del panel" className="rounded-lg">
            <Logo className="h-9 w-auto" />
          </NextLink>
        </div>
        <div className="px-3 pb-3 lg:flex-1 lg:px-4 lg:pt-4">
          <PanelNav />
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="flex h-16 items-center justify-end gap-2 border-line border-b bg-white/80 px-5 backdrop-blur lg:px-10">
          <div className="mr-2 flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-teal-50 font-semibold text-sm text-teal-700">
              {initials}
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block font-medium text-ink-900 text-sm">{session.user.name}</span>
              <span className="block text-ink-500 text-xs">
                {session.roles.map((role) => ROLE_LABELS[role]).join(" · ")}
              </span>
            </span>
          </div>
          <NextLink
            href="/admin/seguridad"
            className={buttonVariants({ size: "sm", variant: "ghost" })}
          >
            <ShieldCheck className="size-4" strokeWidth={1.75} aria-hidden="true" />
            <span className="hidden sm:inline">Seguridad</span>
          </NextLink>
          <SignOutButton />
        </header>
        <main className="flex-1 px-5 py-8 lg:px-10 lg:py-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
