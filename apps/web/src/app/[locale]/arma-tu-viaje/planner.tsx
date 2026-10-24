"use client";

import { buildWhatsAppUrl } from "@cc/core";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Description,
  FieldError,
  Form,
  Input,
  type Key,
  Label,
  ListBox,
  Radio,
  RadioGroup,
  Select,
  TextArea,
  TextField,
} from "@heroui/react";
import { getLocalTimeZone, parseDate } from "@internationalized/date";
import {
  ArrowLeft,
  ArrowRight,
  Baby,
  BedDouble,
  Briefcase,
  Camera,
  CarFront,
  ChefHat,
  Flower2,
  Heart,
  type LucideIcon,
  PartyPopper,
  Sailboat,
  ShoppingBasket,
  User,
  Users,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { type FormEvent, useMemo, useState } from "react";
import { WhatsAppIcon } from "@/components/brand/whatsapp-icon";
import {
  CountField,
  type DateRange,
  TRIP_ZONES,
  TripDates,
  type TripZone,
  ZoneSelect,
} from "@/components/site/trip-fields";

const STEPS = ["trip", "interests", "contact", "summary"] as const;
type TripType = "couple" | "family" | "friends" | "company" | "solo";
const TRIP_TYPES: { id: TripType; icon: LucideIcon }[] = [
  { id: "couple", icon: Heart },
  { id: "family", icon: Baby },
  { id: "friends", icon: Users },
  { id: "company", icon: Briefcase },
  { id: "solo", icon: User },
];
type ServiceOption =
  | "stay"
  | "transfer"
  | "excursions"
  | "groceries"
  | "chef"
  | "wellness"
  | "photo"
  | "celebration";
const SERVICE_OPTIONS: { id: ServiceOption; icon: LucideIcon }[] = [
  { id: "stay", icon: BedDouble },
  { id: "transfer", icon: CarFront },
  { id: "excursions", icon: Sailboat },
  { id: "groceries", icon: ShoppingBasket },
  { id: "chef", icon: ChefHat },
  { id: "wellness", icon: Flower2 },
  { id: "photo", icon: Camera },
  { id: "celebration", icon: PartyPopper },
];
const BUDGETS = ["economy", "mid", "premium", "unsure"] as const;

// Opciones como tarjetas seleccionables (el estado sale de data-selected del <label>).
const OPTION_CARD =
  "relative flex h-full w-full cursor-pointer flex-col items-center gap-2 rounded-card border border-line bg-white px-3 pt-7 pb-5 text-center transition-colors hover:border-teal-400 data-[selected=true]:border-teal-600 data-[selected=true]:bg-teal-50";
const CHIP_CARD =
  "flex h-full w-full cursor-pointer items-center gap-3 rounded-card border border-line bg-white px-4 py-3.5 transition-colors hover:border-teal-400 data-[selected=true]:border-teal-600 data-[selected=true]:bg-teal-50";

export type PlannerInitial = {
  zone?: string;
  arrival?: string;
  departure?: string;
  travelers?: number;
};

function safeRange(arrival?: string, departure?: string): DateRange | null {
  if (!arrival || !departure) return null;
  try {
    const start = parseDate(arrival);
    const end = parseDate(departure);
    return end.compare(start) >= 0 ? { start, end } : null;
  } catch {
    return null;
  }
}

/** Asistente de 4 pasos. Al final abre WhatsApp con la solicitud (en M2 también crea el lead). */
export function Planner({
  whatsappNumber,
  initial,
}: {
  whatsappNumber: string;
  initial: PlannerInitial;
}) {
  const t = useTranslations("Planner");
  const tZones = useTranslations("TripZones");
  const locale = useLocale();
  const reduce = useReducedMotion();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [zone, setZone] = useState<Key | null>(
    TRIP_ZONES.includes(initial.zone as TripZone) ? (initial.zone as TripZone) : null,
  );
  const [dates, setDates] = useState<DateRange | null>(
    safeRange(initial.arrival, initial.departure),
  );
  const [flexible, setFlexible] = useState(false);
  const [adults, setAdults] = useState(Math.min(Math.max(initial.travelers ?? 2, 1), 60));
  const [children, setChildren] = useState(0);
  const [tripType, setTripType] = useState<TripType | null>(null);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [budget, setBudget] = useState<Key | null>(null);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState("");

  const dateFormat = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }),
    [locale],
  );
  const datesText = dates
    ? `${dateFormat.format(dates.start.toDate(getLocalTimeZone()))} – ${dateFormat.format(
        dates.end.toDate(getLocalTimeZone()),
      )}${flexible ? ` (${t("msg.flexible")})` : ""}`
    : flexible
      ? t("msg.flexible")
      : t("notSet");

  const summary: { label: string; value: string; step: number }[] = [
    { label: t("zone"), value: zone ? tZones(zone as TripZone) : t("notSet"), step: 0 },
    { label: t("dates"), value: datesText, step: 0 },
    { label: t("msg.travelers"), value: t("travelersValue", { adults, children }), step: 0 },
    { label: t("tripType"), value: tripType ? t(`tripTypes.${tripType}`) : t("notSet"), step: 1 },
    {
      label: t("msg.services"),
      value: services.length
        ? services.map((s) => t(`serviceOptions.${s}`)).join(", ")
        : t("notSet"),
      step: 1,
    },
    {
      label: t("budget"),
      value: budget ? t(`budgets.${budget as (typeof BUDGETS)[number]}`) : t("notSet"),
      step: 1,
    },
    {
      label: t("name"),
      value: [name, country].filter(Boolean).join(" · ") || t("notSet"),
      step: 2,
    },
  ];

  function go(to: number) {
    setDirection(to > step ? 1 : -1);
    setStep(to);
    // Vuelve al inicio del asistente (debajo del header fijo), no al inicio de la página.
    const panel = document.getElementById("planner");
    if (panel) {
      const top = panel.getBoundingClientRect().top + window.scrollY - 112;
      window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < STEPS.length - 1) {
      go(step + 1);
      return;
    }
    const lines = [
      t("msg.intro"),
      `• ${t("msg.zone")}: ${zone ? tZones(zone as TripZone) : t("notSet")}`,
      `• ${t("msg.dates")}: ${datesText}`,
      `• ${t("msg.travelers")}: ${t("travelersValue", { adults, children })}`,
      tripType && `• ${t("msg.tripType")}: ${t(`tripTypes.${tripType}`)}`,
      services.length > 0 &&
        `• ${t("msg.services")}: ${services.map((s) => t(`serviceOptions.${s}`)).join(", ")}`,
      budget && `• ${t("msg.budget")}: ${t(`budgets.${budget as (typeof BUDGETS)[number]}`)}`,
      `• ${t("msg.name")}: ${name}`,
      country && `• ${t("msg.country")}: ${country}`,
      email && `• ${t("msg.email")}: ${email}`,
      comments && `• ${t("msg.comments")}: ${comments}`,
    ].filter(Boolean);
    window.open(
      buildWhatsAppUrl(whatsappNumber, lines.join("\n"), "CC-WEB-PLANNER"),
      "_blank",
      "noopener",
    );
  }

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: reduce ? 0 : dir * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: reduce ? 0 : dir * -40 }),
  };

  return (
    <div
      id="planner"
      className="rounded-panel border border-line bg-white p-6 shadow-raised sm:p-10"
    >
      {/* Progreso */}
      <div>
        <p className="font-medium text-ink-500 text-sm">
          {t("progress", { current: step + 1, total: STEPS.length })}
        </p>
        <ol className="mt-4 grid grid-cols-4 gap-2">
          {STEPS.map((id, i) => (
            <li key={id}>
              <span
                className={`block h-1.5 rounded-full transition-colors duration-300 ${
                  i <= step ? "bg-teal-600" : "bg-sand-200"
                }`}
              />
              <span
                className={`mt-2 hidden text-xs sm:block ${i === step ? "font-semibold text-ink-900" : "text-ink-500"}`}
                aria-current={i === step ? "step" : undefined}
              >
                {t(`steps.${id}`)}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <Form onSubmit={onSubmit} className="mt-10">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-display-md text-ink-900">{t(`steps.${STEPS[step] ?? "trip"}`)}</h2>

            {step === 0 && (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  <ZoneSelect
                    label={t("zone")}
                    placeholder={t("zonePlaceholder")}
                    value={zone}
                    onChange={setZone}
                  />
                  <TripDates label={t("dates")} value={dates} onChange={setDates} />
                </div>
                <Checkbox isSelected={flexible} onChange={setFlexible}>
                  <Checkbox.Content>
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    {t("flexible")}
                  </Checkbox.Content>
                </Checkbox>
                <div className="grid gap-5 sm:grid-cols-2">
                  <CountField label={t("adults")} value={adults} onChange={setAdults} min={1} />
                  <CountField
                    label={t("children")}
                    value={children}
                    onChange={setChildren}
                    min={0}
                  />
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <RadioGroup value={tripType ?? ""} onChange={(v) => setTripType(v as TripType)}>
                  <Label>{t("tripType")}</Label>
                  <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-5">
                    {TRIP_TYPES.map((type) => (
                      // Radio.Content es el <label> con el input real: la tarjeta entera es clicable.
                      <Radio key={type.id} value={type.id} className="h-full">
                        <Radio.Content className={OPTION_CARD}>
                          <Radio.Control className="absolute top-2.5 right-2.5">
                            <Radio.Indicator />
                          </Radio.Control>
                          <type.icon
                            className="size-6 text-teal-600"
                            strokeWidth={1.75}
                            aria-hidden="true"
                          />
                          <span className="font-medium text-ink-900 text-sm">
                            {t(`tripTypes.${type.id}`)}
                          </span>
                        </Radio.Content>
                      </Radio>
                    ))}
                  </div>
                </RadioGroup>

                <CheckboxGroup value={services} onChange={(v) => setServices(v as ServiceOption[])}>
                  <Label>{t("services")}</Label>
                  <Description>{t("servicesHelp")}</Description>
                  <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {SERVICE_OPTIONS.map((option) => (
                      <Checkbox key={option.id} value={option.id} className="h-full">
                        <Checkbox.Content className={CHIP_CARD}>
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                          <option.icon
                            className="size-5 shrink-0 text-teal-600"
                            strokeWidth={1.75}
                            aria-hidden="true"
                          />
                          <span className="font-medium text-ink-900 text-sm">
                            {t(`serviceOptions.${option.id}`)}
                          </span>
                        </Checkbox.Content>
                      </Checkbox>
                    ))}
                  </div>
                </CheckboxGroup>

                <Select
                  fullWidth
                  value={budget}
                  onChange={setBudget}
                  placeholder={t("budgetPlaceholder")}
                >
                  <Label>{t("budget")}</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {BUDGETS.map((id) => (
                        <ListBox.Item key={id} id={id} textValue={t(`budgets.${id}`)}>
                          {t(`budgets.${id}`)}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField
                    isRequired
                    fullWidth
                    value={name}
                    onChange={setName}
                    autoComplete="name"
                  >
                    <Label>{t("name")}</Label>
                    <Input />
                    <FieldError>{t("nameRequired")}</FieldError>
                  </TextField>
                  <TextField
                    fullWidth
                    value={country}
                    onChange={setCountry}
                    autoComplete="country-name"
                  >
                    <Label>{t("country")}</Label>
                    <Input />
                  </TextField>
                </div>
                <TextField
                  fullWidth
                  type="email"
                  value={email}
                  onChange={setEmail}
                  autoComplete="email"
                >
                  <Label>{t("email")}</Label>
                  <Input />
                </TextField>
                <TextField fullWidth value={comments} onChange={setComments}>
                  <Label>{t("comments")}</Label>
                  <TextArea placeholder={t("commentsPlaceholder")} rows={4} />
                </TextField>
              </>
            )}

            {step === 3 && (
              <>
                <p className="text-ink-700">{t("summaryText")}</p>
                <dl className="divide-y divide-line rounded-card border border-line">
                  {summary.map((row) => (
                    <div key={row.label} className="flex items-start gap-4 px-5 py-4">
                      <dt className="w-36 shrink-0 text-ink-500 text-sm">{row.label}</dt>
                      <dd className="flex-1 font-medium text-ink-900">{row.value}</dd>
                      <button
                        type="button"
                        onClick={() => go(row.step)}
                        className="shrink-0 font-semibold text-sm text-teal-600 hover:text-teal-700"
                      >
                        {t("edit")}
                        <span className="sr-only">: {row.label}</span>
                      </button>
                    </div>
                  ))}
                </dl>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex flex-col-reverse gap-3 border-line border-t pt-8 sm:flex-row sm:justify-between">
          {step > 0 ? (
            <Button variant="ghost" size="lg" onPress={() => go(step - 1)}>
              <ArrowLeft className="size-5" strokeWidth={2} aria-hidden="true" />
              {t("back")}
            </Button>
          ) : (
            <span />
          )}
          <Button type="submit" size="lg">
            {step === STEPS.length - 1 ? (
              <>
                <WhatsAppIcon className="size-5" />
                {t("send")}
              </>
            ) : (
              <>
                {t("next")}
                <ArrowRight className="size-5" strokeWidth={2} aria-hidden="true" />
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
}
