"use client";

import { Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { FormAlert } from "@/components/admin/form-alert";
import { authClient } from "@/lib/auth/client";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);

    const { data, error } = await authClient.signIn.email({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });

    setPending(false);
    if (error) {
      setError(
        error.status === 429
          ? "Demasiados intentos. Espera un momento y vuelve a probar."
          : "Correo o contraseña incorrectos.",
      );
      return;
    }
    if (data && "twoFactorRedirect" in data && data.twoFactorRedirect) {
      router.push("/admin/verificar");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <Form className="flex flex-col gap-5" onSubmit={onSubmit}>
      {error && <FormAlert>{error}</FormAlert>}
      <TextField isRequired fullWidth name="email" type="email" autoComplete="username">
        <Label>Correo</Label>
        <Input placeholder="nombre@conexioncaribe.com" />
        <FieldError />
      </TextField>
      <TextField
        isRequired
        fullWidth
        name="password"
        type="password"
        autoComplete="current-password"
      >
        <Label>Contraseña</Label>
        <Input />
        <FieldError />
      </TextField>
      <Button type="submit" size="lg" fullWidth isPending={pending} className="mt-3">
        Entrar
      </Button>
    </Form>
  );
}
