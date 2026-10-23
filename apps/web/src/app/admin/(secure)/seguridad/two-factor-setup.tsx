"use client";

import { Button, Form, Input, Label, TextField } from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { type FormEvent, useState } from "react";
import { FormAlert } from "@/components/admin/form-alert";
import { OtpField } from "@/components/admin/otp-field";
import { authClient } from "@/lib/auth/client";

type Enrollment = { totpURI: string; backupCodes: string[] };

export function TwoFactorSetup({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (enabled) {
    return (
      <div className="flex flex-col gap-8">
        <FormAlert status="success">La verificación en dos pasos está activa.</FormAlert>
        <NextLink href="/admin" className={`${buttonVariants({ size: "lg" })} w-full`}>
          Ir al panel
        </NextLink>
      </div>
    );
  }

  async function startEnrollment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    const { data, error } = await authClient.twoFactor.enable({
      password: String(form.get("password")),
    });
    setPending(false);
    if (error || !data || data.method !== "totp") {
      setError("Contraseña incorrecta.");
      return;
    }
    setEnrollment({ totpURI: data.totpURI, backupCodes: data.backupCodes });
  }

  async function confirmEnrollment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const { error } = await authClient.twoFactor.verifyTotp({ code });
    setPending(false);
    if (error) {
      setError("El código no coincide. Revisa la hora del teléfono y prueba con el siguiente.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  if (!enrollment) {
    return (
      <Form className="flex flex-col gap-5" onSubmit={startEnrollment}>
        {error && <FormAlert>{error}</FormAlert>}
        <TextField
          isRequired
          fullWidth
          name="password"
          type="password"
          autoComplete="current-password"
        >
          <Label>Confirma tu contraseña</Label>
          <Input />
        </TextField>
        <Button type="submit" size="lg" fullWidth isPending={pending} className="mt-3">
          Continuar
        </Button>
      </Form>
    );
  }

  return (
    <Form className="flex flex-col gap-8" onSubmit={confirmEnrollment}>
      {error && <FormAlert>{error}</FormAlert>}

      <Step n={1} title="Escanea el código QR">
        <p>Ábrelo con tu app de autenticación.</p>
        <div className="mt-4 w-fit rounded-card border border-line bg-white p-4 shadow-card">
          <QRCodeSVG
            value={enrollment.totpURI}
            size={168}
            fgColor="#01274B"
            title="Código QR para la verificación en dos pasos"
          />
        </div>
      </Step>

      <Step n={2} title="Guarda tus códigos de respaldo">
        <p>Cada uno sirve una sola vez si pierdes el teléfono.</p>
        <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 rounded-card bg-sand-100 p-5 font-mono text-ink-900 text-sm">
          {enrollment.backupCodes.map((backupCode) => (
            <li key={backupCode}>{backupCode}</li>
          ))}
        </ul>
      </Step>

      <Step n={3} title="Confirma con el código de la app">
        <div className="mt-4">
          <OtpField value={code} onChange={setCode} />
        </div>
      </Step>

      <Button type="submit" size="lg" fullWidth isPending={pending} isDisabled={code.length !== 6}>
        Activar y entrar al panel
      </Button>
    </Form>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="flex gap-4">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-50 font-semibold text-sm text-teal-700">
        {n}
      </span>
      <div className="min-w-0 flex-1 text-ink-500">
        <h2 className="font-sans font-semibold text-base text-ink-900">{title}</h2>
        <div className="mt-1">{children}</div>
      </div>
    </section>
  );
}
