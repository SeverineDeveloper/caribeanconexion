"use client";

import { buildWhatsAppUrl } from "@cc/core";
import {
  Button,
  Form,
  Input,
  type Key,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { type FormEvent, useState } from "react";
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon";

const INTERESTS = ["trip", "stay", "transfer", "excursion", "group", "other"] as const;

/**
 * Formulario de contacto: compone el mensaje y abre WhatsApp. En M2 además guardará el lead
 * en el panel antes de abrir WhatsApp.
 */
export function ContactForm({ whatsappNumber }: { whatsappNumber: string }) {
  const t = useTranslations("ContactPage");
  const tWa = useTranslations("WhatsApp");
  const [interest, setInterest] = useState<Key | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    const lines = [
      tWa("defaultMessage"),
      name && `${t("name")}: ${name}`,
      interest && `${t("interest")}: ${t(`interests.${interest as (typeof INTERESTS)[number]}`)}`,
      message,
    ].filter(Boolean);
    window.open(
      buildWhatsAppUrl(whatsappNumber, lines.join("\n"), "CC-WEB-CONTACTO"),
      "_blank",
      "noopener",
    );
  }

  return (
    <Form onSubmit={onSubmit} className="flex flex-col gap-5">
      <TextField isRequired fullWidth name="name" autoComplete="name">
        <Label>{t("name")}</Label>
        <Input />
      </TextField>
      <Select
        fullWidth
        value={interest}
        onChange={setInterest}
        placeholder={t("interestPlaceholder")}
      >
        <Label>{t("interest")}</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {INTERESTS.map((id) => (
              <ListBox.Item key={id} id={id} textValue={t(`interests.${id}`)}>
                {t(`interests.${id}`)}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
      <TextField isRequired fullWidth name="message">
        <Label>{t("message")}</Label>
        <TextArea placeholder={t("messagePlaceholder")} rows={5} />
      </TextField>
      <div className="mt-3 flex flex-col gap-3">
        <Button type="submit" size="lg" fullWidth>
          <WhatsAppIcon className="size-5" />
          {t("submit")}
        </Button>
        <p className="text-center text-ink-500 text-sm">{t("submitNote")}</p>
      </div>
    </Form>
  );
}
