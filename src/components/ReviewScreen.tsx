"use client";

import { motion } from "motion/react";
import { isAnswered, OTHER, type Answers, type FieldDef } from "@/lib/form-schema";
import { ui, useLang, type Lang } from "@/lib/i18n";
import { PrimaryButton, StickyFooter, TopBar } from "./AppChrome";
import { IconAlert, IconCheckCircle, IconEdit, IconLock } from "./icons";

function formatAnswer(
  field: FieldDef,
  answers: Answers,
  lang: Lang,
  photoLabel: string
): string {
  const value = answers[field.id];
  if (!value) return "";

  if (typeof value !== "string") return value.name || photoLabel;

  if (field.widget === "choice") {
    const option = field.options?.find((o) => o.value === value);
    return option ? option.label[lang] : value;
  }

  if (field.widget === "date") {
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleDateString(lang === "pt" ? "pt-BR" : "en-GB");
  }

  return value;
}

export function ReviewScreen({
  fields,
  answers,
  onEdit,
  onBack,
  onSubmit,
}: {
  fields: FieldDef[];
  answers: Answers;
  onEdit: (fieldId: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const { t, lang } = useLang();

  // "Outra" some da lista: quem a representa é o texto livre do campo seguinte.
  // text === null marca pendência — inclui valor preenchido porém inválido.
  const rows = fields
    .filter((field) => answers[field.id] !== OTHER)
    .map((field) => ({
      field,
      text: isAnswered(field, answers)
        ? formatAnswer(field, answers, lang, t(ui.photoAttached))
        : null,
    }));

  const firstPending = rows.find((row) => row.text === null)?.field;

  return (
    <>
      <header className="px-5">
        <TopBar onBack={onBack} />
        <div className="px-1 pt-2">
          <p className="kicker mb-1 text-teal">{t(ui.reviewKicker)}</p>
          <h1 className="font-display text-2xl font-semibold text-navy">{t(ui.reviewTitle)}</h1>
          <p className="mt-1 text-sm leading-relaxed text-gray-1">{t(ui.reviewLead)}</p>
        </div>
      </header>

      <div className="flex-1 space-y-2.5 px-5 py-6">
        {rows.map((row, index) => (
          <motion.button
            key={row.field.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: Math.min(index * 0.04, 0.3) }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onEdit(row.field.id)}
            aria-label={`${t(row.field.label)} — ${t(ui.reviewEdit)}`}
            className={`flex w-full items-center gap-3 rounded-2xl p-4 text-left shadow-sm transition-colors active:bg-gray-4 ${
              row.text === null ? "bg-amber/8 ring-1 ring-amber/40" : "bg-paper"
            }`}
          >
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-normal text-gray-1">{t(row.field.label)}</span>
              {row.text === null ? (
                <span className="mt-0.5 flex items-center gap-1.5 text-[15px] text-amber">
                  <IconAlert className="h-4 w-4 shrink-0" />
                  {t(ui.reviewPending)}
                </span>
              ) : (
                <span className="mt-0.5 block truncate text-[15px] text-navy">{row.text}</span>
              )}
            </span>
            <IconEdit
              className={`h-4 w-4 shrink-0 ${row.text === null ? "text-amber" : "text-gray-2"}`}
            />
          </motion.button>
        ))}

        <div className="flex items-start gap-2.5 rounded-2xl bg-teal/8 p-4">
          <IconLock className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
          <p className="text-[13px] font-light leading-relaxed text-gray-1">
            {t(ui.privacyText)}
          </p>
        </div>
      </div>

      <StickyFooter>
        {firstPending && (
          <p className="mb-2.5 flex items-center justify-center gap-1.5 text-xs font-normal text-amber">
            <IconAlert className="h-3.5 w-3.5" />
            {t(ui.reviewIncomplete)}
          </p>
        )}
        {/* Incompleto não trava o botão: ele leva direto ao que falta. */}
        <PrimaryButton onClick={() => (firstPending ? onEdit(firstPending.id) : onSubmit())}>
          <span className="flex items-center justify-center gap-2">
            {firstPending ? (
              <>
                <IconEdit className="h-5 w-5" />
                {t(ui.reviewPending)}
              </>
            ) : (
              <>
                <IconCheckCircle className="h-5 w-5" />
                {t(ui.submit)}
              </>
            )}
          </span>
        </PrimaryButton>
      </StickyFooter>
    </>
  );
}
