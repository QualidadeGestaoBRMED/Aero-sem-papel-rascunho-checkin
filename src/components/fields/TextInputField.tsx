"use client";

import { motion } from "motion/react";
import type { FieldDef } from "@/lib/form-schema";
import { useLang } from "@/lib/i18n";
import { formatCPF } from "@/lib/validation";
import { IconCalendar, IconCheck, IconId, IconUser } from "../icons";

/** Texto livre, CPF mascarado e data — mesma moldura, teclados diferentes. */
export function TextControl({
  field,
  value,
  onChange,
  onSubmit,
  showError,
  autoFocus = false,
}: {
  field: FieldDef;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  /** O erro só aparece depois de uma tentativa de avançar. */
  showError: boolean;
  autoFocus?: boolean;
}) {
  const { t } = useLang();

  const error = field.validate?.(value) ?? null;
  const valid = value.trim().length > 0 && !error;
  const isDate = field.widget === "date";
  const isDocument = field.widget === "cpf" || field.id === "passport";

  const handleChange = (next: string) =>
    onChange(field.widget === "cpf" ? formatCPF(next) : next);

  return (
    <div>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-2">
          {isDate ? (
            <IconCalendar className="h-5 w-5" />
          ) : isDocument ? (
            <IconId className="h-5 w-5" />
          ) : (
            <IconUser className="h-5 w-5" />
          )}
        </span>
        <input
          type={isDate ? "date" : "text"}
          inputMode={field.widget === "cpf" ? "numeric" : undefined}
          autoComplete={field.id === "fullName" ? "name" : "off"}
          autoCapitalize={field.widget === "text" ? "words" : "off"}
          autoFocus={autoFocus}
          value={value}
          max={isDate ? new Date().toISOString().slice(0, 10) : undefined}
          placeholder={field.placeholder ? t(field.placeholder) : undefined}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && valid) onSubmit();
          }}
          className={`w-full rounded-xl border bg-paper py-4 pl-12 ${
            isDate ? "pr-4" : "pr-11"
          } text-navy placeholder:text-gray-2 transition-colors focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/40 ${
            showError && error ? "border-rust" : "border-gray-3"
          }`}
        />
        {valid && !isDate && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-teal"
          >
            <IconCheck className="h-5 w-5" />
          </motion.span>
        )}
      </div>
      {showError && error && <p className="mt-2 text-xs font-normal text-rust">{t(error)}</p>}
    </div>
  );
}
