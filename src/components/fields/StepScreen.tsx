"use client";

import { AnimatePresence, motion } from "motion/react";
import type {
  AnswerValue,
  Answers,
  FieldDef,
  FileValue,
  FormStep,
} from "@/lib/form-schema";
import { useLang } from "@/lib/i18n";
import { FieldShell } from "./FieldShell";
import { ChoiceControl } from "./ChoiceField";
import { SearchControl } from "./SearchableSelectField";
import { TextControl } from "./TextInputField";
import { AttachmentControl } from "./AttachmentField";

interface StepScreenProps {
  step: FormStep;
  answers: Answers;
  direction: number;
  showError: boolean;
  onSelect: (id: string, value: string) => void;
  onChange: (id: string, value: AnswerValue | undefined) => void;
  onSubmit: () => void;
}

const textOf = (answers: Answers, id: string) =>
  typeof answers[id] === "string" ? (answers[id] as string) : "";

/**
 * Um passo do formulário: o campo principal e, abaixo dele, os campos que a
 * resposta revela. Agrupar o par escolha/resposta evita uma tela extra e faz a
 * dependência entre os dois ficar visível.
 */
export function StepScreen({
  step,
  answers,
  direction,
  showError,
  onSelect,
  onChange,
  onSubmit,
}: StepScreenProps) {
  const { primary, children } = step;
  const scrolls = primary.widget === "search" || primary.widget === "photo" || primary.widget === "file";

  return (
    <FieldShell field={primary} direction={direction} scroll={scrolls}>
      <Control
        field={primary}
        answers={answers}
        showError={showError}
        onSelect={onSelect}
        onChange={onChange}
        onSubmit={onSubmit}
      />

      <AnimatePresence initial={false}>
        {children.map((child) => (
          <motion.div
            key={child.id}
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="shrink-0 overflow-hidden"
          >
            <div className="pt-5">
              <ChildLabel field={child} />
              <Control
                field={child}
                answers={answers}
                showError={showError}
                onSelect={onSelect}
                onChange={onChange}
                onSubmit={onSubmit}
                autoFocus
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </FieldShell>
  );
}

function ChildLabel({ field }: { field: FieldDef }) {
  const { t } = useLang();
  const label = field.groupLabel ?? field.label;
  return <label className="mb-1.5 block text-sm text-navy">{t(label)}</label>;
}

function Control({
  field,
  answers,
  showError,
  onSelect,
  onChange,
  onSubmit,
  autoFocus,
}: Omit<StepScreenProps, "step" | "direction"> & {
  field: FieldDef;
  autoFocus?: boolean;
}) {
  switch (field.widget) {
    case "choice":
      return (
        <ChoiceControl
          field={field}
          value={textOf(answers, field.id)}
          onSelect={(value) => onSelect(field.id, value)}
        />
      );
    case "search":
      return (
        <SearchControl
          field={field}
          value={textOf(answers, field.id)}
          onSelect={(value) => onSelect(field.id, value)}
        />
      );
    case "photo":
    case "file":
      return (
        <AttachmentControl
          field={field}
          value={answers[field.id] as FileValue | undefined}
          onChange={(value) => onChange(field.id, value)}
        />
      );
    default:
      return (
        <TextControl
          field={field}
          value={textOf(answers, field.id)}
          showError={showError}
          autoFocus={autoFocus}
          onChange={(value) => onChange(field.id, value)}
          onSubmit={onSubmit}
        />
      );
  }
}
