"use client";

import { useMemo, useState } from "react";
import { OTHER, type FieldDef } from "@/lib/form-schema";
import { ui, useLang } from "@/lib/i18n";
import { IconSearch } from "../icons";
import { OptionCard } from "./ChoiceField";

const NO_OPTIONS: readonly string[] = [];

/** Ignora acentos e caixa — "funcao" precisa achar "Função". */
const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

/** Lista longa (até 175 itens) com busca. Selecionar avança sozinho. */
export function SearchControl({
  field,
  value,
  onSelect,
}: {
  field: FieldDef;
  value: string;
  onSelect: (value: string) => void;
}) {
  const { t } = useLang();
  const [query, setQuery] = useState("");

  const options = field.searchOptions ?? NO_OPTIONS;
  const results = useMemo(() => {
    const term = normalize(query.trim());
    if (!term) return options;
    return options.filter((option) => normalize(option).includes(term));
  }, [options, query]);

  return (
    <>
      {options.length > 8 && (
        <div className="relative mb-3 shrink-0">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-2">
            <IconSearch className="h-5 w-5" />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(ui.searchPlaceholder)}
            className="w-full rounded-xl border border-gray-3 bg-paper py-3.5 pl-12 pr-4 text-navy placeholder:text-gray-2 transition-colors focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/40"
          />
        </div>
      )}

      <div className="-mx-1 min-h-0 flex-1 space-y-2.5 overflow-y-auto px-1 pb-2">
        {results.map((option) => (
          <OptionCard
            key={option}
            label={option}
            selected={value === option}
            onSelect={() => onSelect(option)}
          />
        ))}

        {results.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-1">{t(ui.noResults)}</p>
        )}

        {field.allowOther && (
          <OptionCard
            label={t(ui.otherOption)}
            selected={value === OTHER}
            onSelect={() => onSelect(OTHER)}
          />
        )}
      </div>
    </>
  );
}
