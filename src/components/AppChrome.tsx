"use client";

import { motion } from "motion/react";
import { IconChevronLeft } from "./icons";
import type { ReactNode, ComponentProps } from "react";

/**
 * Marca do produto: anéis concêntricos (conferência, foco) fechados por um
 * traço de verificação — identidade confirmada, não detecção.
 */
export function TriagemMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <circle cx="24" cy="24" r="21" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="13" stroke="currentColor" strokeOpacity="0.5" strokeWidth="2.5" />
      <path
        d="m17.5 24.3 4.6 4.6 8.4-9.4"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Transição padrão entre telas do app. */
export function Screen({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex flex-1 flex-col ${className}`}
    >
      {children}
    </motion.div>
  );
}

/** Barra superior com botão de voltar e conteúdo central/direito opcionais. */
export function TopBar({
  onBack,
  center,
  right,
}: {
  onBack?: () => void;
  center?: ReactNode;
  right?: ReactNode;
}) {
  return (
    // Laterais de largura igual para o conteúdo central ficar mesmo no centro,
    // mesmo com o seletor de idioma à direita.
    <div className="flex h-12 items-center justify-between px-2 pt-[env(safe-area-inset-top)]">
      <div className="w-24">
        {onBack && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            aria-label="Voltar"
            className="flex h-11 w-11 items-center justify-center rounded-full text-navy active:bg-gray-3/60"
          >
            <IconChevronLeft className="h-6 w-6" />
          </motion.button>
        )}
      </div>
      <div className="flex-1 text-center">{center}</div>
      <div className="flex w-24 justify-end pr-1">{right}</div>
    </div>
  );
}

/** Rodapé fixo na zona do polegar, com respeito à safe area. */
export function StickyFooter({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 inset-x-0 bg-gradient-to-t from-background via-background to-transparent px-5 pt-6 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      {children}
    </div>
  );
}

type MotionButtonProps = ComponentProps<typeof motion.button>;

export function PrimaryButton({ className = "", ...props }: MotionButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`h-14 w-full rounded-2xl bg-navy font-display text-base font-medium text-paper shadow-lg shadow-navy/25 transition-opacity disabled:opacity-40 ${className}`}
      {...props}
    />
  );
}

export function SecondaryButton({ className = "", ...props }: MotionButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`h-14 w-full rounded-2xl border border-gray-3 bg-paper font-display text-base font-medium text-navy transition-colors active:bg-gray-4 ${className}`}
      {...props}
    />
  );
}
