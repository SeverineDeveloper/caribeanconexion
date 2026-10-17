"use client";

import { Button, Form, Input, Label, TextField } from "@heroui/react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { FormAlert } from "@/components/admin/form-alert";
import { OtpField } from "@/components/admin/otp-field";
import { authClient } from "@/lib/auth/client";

export function VerifyTwoFactorForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [useBackup, setUseBackup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const { error } = useBackup
      ? await authClient.twoFactor.verifyBackupCode({ code: code.trim() })
      : await authClient.twoFactor.verifyTotp({ code });

    setPending(false);
    if (error) {
      setError("Código incorrecto o vencido. Si el problema sigue, vuelve a iniciar sesión.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <Form className="flex flex-col gap-5" onSubmit={onSubmit}>
      {error && <FormAlert>{error}</FormAlert>}
      {useBackup ? (
        <TextField isRequired fullWidth value={code} onChange={setCode} autoComplete="off">
          <Label>Código de respaldo</Label>
          <Input />
        </TextField>
      ) : (
        <OtpField value={code} onChange={setCode} />
      )}
      <div className="mt-3 flex flex-col gap-2">
        <Button
          type="submit"
          size="lg"
          fullWidth
          isPending={pending}
          isDisabled={!useBackup && code.length !== 6}
        >
          Verificar
        </Button>
        <Button
          variant="ghost"
          fullWidth
          onPress={() => {
            setUseBackup(!useBackup);
            setCode("");
            setError(null);
          }}
        >
          {useBackup ? "Usar la app de autenticación" : "Usar un código de respaldo"}
        </Button>
      </div>
    </Form>
  );
}
