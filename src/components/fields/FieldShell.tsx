"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import type { FieldDef } from "@/lib/form-schema";
import { useLang } from "@/lib/i18n";

export const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 64 : -64, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -64 : 64, opacity: 0 }),
};

/**
 * Moldura do passo: pergunta no topo e conteúdo logo abaixo dela. Nada é
 * centralizado na vertical — campo solto no meio da tela lê como esquecido.
 */
export function FieldShell({
  field,
  direction,
  children,
  scroll = false,
}: {
  field: FieldDef;
  direction: number;
  children: ReactNode;
  /** Listas longas rolam dentro do passo em vez de esticar a tela. */
  scroll?: boolean;
}) {
  const { t } = useLang();

  return (
    <motion.div
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="pt-7">
        <h2 className="font-display text-[1.45rem] font-medium leading-snug text-navy">
          {t(field.label)}
        </h2>
        {field.hint && <p className="mt-1.5 text-sm text-gray-1">{t(field.hint)}</p>}
      </div>

      {scroll ? (
        <div className="mt-5 flex min-h-0 flex-1 flex-col">{children}</div>
      ) : (
        <div className="mt-7 flex-1">{children}</div>
      )}
    </motion.div>
  );
}
