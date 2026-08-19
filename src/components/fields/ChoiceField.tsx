"use client";

import { motion } from "motion/react";
import type { FieldDef } from "@/lib/form-schema";
import { useLang } from "@/lib/i18n";

/** Escolha única. Avança sozinha quando não revela nenhum campo agrupado. */
export function ChoiceControl({
  field,
  value,
  onSelect,
}: {
  field: FieldDef;
  value: string;
  onSelect: (value: string) => void;
}) {
  const { t } = useLang();

  return (
    <div className="space-y-3">
      {field.options?.map((option) => (
        <OptionCard
          key={option.value}
          label={t(option.label)}
          selected={value === option.value}
          onSelect={() => onSelect(option.value)}
        />
      ))}
    </div>
  );
}

/** Cartão de opção — usado também pelo seletor com busca. */
export function OptionCard({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`w-full rounded-2xl border-2 p-4 text-left text-[15px] font-normal leading-snug transition-colors duration-150 ${
        selected
          ? "border-teal bg-teal text-paper shadow-md shadow-teal/25"
          : "border-transparent bg-paper text-navy shadow-sm active:bg-gray-4"
      }`}
    >
      <span className="flex items-center gap-3">
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            selected ? "border-paper" : "border-gray-2"
          }`}
        >
          {selected && <span className="h-2.5 w-2.5 rounded-full bg-paper" />}
        </span>
        {label}
      </span>
    </motion.button>
  );
}
