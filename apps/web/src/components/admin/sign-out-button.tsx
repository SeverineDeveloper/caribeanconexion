"use client";

import { Button } from "@heroui/react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export function SignOutButton() {
  const router = useRouter();

  return (
    <Button
      size="sm"
      variant="ghost"
      onPress={async () => {
        await authClient.signOut();
        router.push("/admin/login");
        router.refresh();
      }}
    >
      <LogOut className="size-4" strokeWidth={1.75} aria-hidden="true" />
      Salir
    </Button>
  );
}
