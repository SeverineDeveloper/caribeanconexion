// Sin "use client": solo lo importan componentes cliente (quick-planner, planner).
import {
  DateField,
  DateRangePicker,
  I18nProvider,
  type Key,
  Label,
  ListBox,
  NumberField,
  RangeCalendar,
  Select,
} from "@heroui/react";
import { type CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

export const TRIP_ZONES = [
  "puntaCana",
  "bavaro",
  "capCana",
  "bayahibe",
  "laRomana",
  "samana",
  "santoDomingo",
  "undecided",
] as const;
export type TripZone = (typeof TRIP_ZONES)[number];

export type DateRange = { start: CalendarDate; end: CalendarDate };

/** Selector de zona compartido por el planificador rápido y "Arma tu viaje". */
export function ZoneSelect({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: Key | null;
  onChange: (value: Key | null) => void;
}) {
  const t = useTranslations("TripZones");
  return (
    <Select fullWidth value={value} onChange={onChange} placeholder={placeholder}>
      <Label>{label}</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {TRIP_ZONES.map((zone) => (
            <ListBox.Item key={zone} id={zone} textValue={t(zone)}>
              {t(zone)}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}

/** Rango de fechas de llegada y salida, con calendario en el idioma de la página. */
export function TripDates({
  label,
  value,
  onChange,
}: {
  label: string;
  value: DateRange | null;
  onChange: (value: DateRange | null) => void;
}) {
  const locale = useLocale();
  return (
    <I18nProvider locale={locale}>
      <DateRangePicker
        className="w-full"
        value={value}
        onChange={onChange}
        minValue={today(getLocalTimeZone())}
      >
        <Label>{label}</Label>
        <DateField.Group fullWidth>
          <DateField.InputContainer>
            <DateField.Input slot="start">
              {(segment) => <DateField.Segment segment={segment} />}
            </DateField.Input>
            <DateRangePicker.RangeSeparator />
            <DateField.Input slot="end">
              {(segment) => <DateField.Segment segment={segment} />}
            </DateField.Input>
          </DateField.InputContainer>
          <DateField.Suffix>
            <DateRangePicker.Trigger>
              <DateRangePicker.TriggerIndicator />
            </DateRangePicker.Trigger>
          </DateField.Suffix>
        </DateField.Group>
        <DateRangePicker.Popover>
          <RangeCalendar aria-label={label}>
            <RangeCalendar.Header>
              <RangeCalendar.Heading />
              <RangeCalendar.NavButton slot="previous" />
              <RangeCalendar.NavButton slot="next" />
            </RangeCalendar.Header>
            <RangeCalendar.Grid>
              <RangeCalendar.GridHeader>
                {(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}
              </RangeCalendar.GridHeader>
              <RangeCalendar.GridBody>
                {(date) => <RangeCalendar.Cell date={date} />}
              </RangeCalendar.GridBody>
            </RangeCalendar.Grid>
          </RangeCalendar>
        </DateRangePicker.Popover>
      </DateRangePicker>
    </I18nProvider>
  );
}

/** Contador con botones − / + (viajeros, adultos, niños). */
export function CountField({
  label,
  value,
  onChange,
  min = 0,
  max = 60,
  description,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  description?: ReactNode;
}) {
  return (
    <NumberField
      fullWidth
      value={value}
      onChange={(v) => onChange(Number.isNaN(v) ? min : v)}
      minValue={min}
      maxValue={max}
    >
      <Label>{label}</Label>
      <NumberField.Group>
        <NumberField.DecrementButton />
        {/* Fijo: React Aria lo calcula según la plataforma y no coincide entre servidor y cliente */}
        <NumberField.Input inputMode="numeric" />
        <NumberField.IncrementButton />
      </NumberField.Group>
      {description}
    </NumberField>
  );
}
