import { InputOTP, Label, REGEXP_ONLY_DIGITS } from "@heroui/react";

const SLOT =
  "size-12 rounded-field border border-field-border bg-white text-lg font-semibold text-ink-900";

/** Campo de 6 dígitos para códigos TOTP: casillas de 48 px como el resto de inputs. */
export function OtpField({
  value,
  onChange,
  label = "Código",
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <InputOTP
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS}
        inputMode="numeric"
        autoComplete="one-time-code"
        value={value}
        onChange={onChange}
        aria-label={label}
      >
        <InputOTP.Group className="gap-2">
          {[0, 1, 2].map((i) => (
            <InputOTP.Slot key={i} index={i} className={SLOT} />
          ))}
        </InputOTP.Group>
        <InputOTP.Separator />
        <InputOTP.Group className="gap-2">
          {[3, 4, 5].map((i) => (
            <InputOTP.Slot key={i} index={i} className={SLOT} />
          ))}
        </InputOTP.Group>
      </InputOTP>
    </div>
  );
}
