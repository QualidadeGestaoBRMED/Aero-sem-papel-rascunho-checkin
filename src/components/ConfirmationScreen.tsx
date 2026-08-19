"use client";

import { motion } from "motion/react";
import type { Answers } from "@/lib/form-schema";
import { ui, useLang } from "@/lib/i18n";
import { SecondaryButton, StickyFooter } from "./AppChrome";
import { IconCheckCircle } from "./icons";

export interface Receipt {
  protocol: string;
  submittedAt: string;
}

export function ConfirmationScreen({
  receipt,
  answers,
  onRestart,
}: {
  receipt: Receipt;
  answers: Answers;
  onRestart: () => void;
}) {
  const { t, lang } = useLang();

  const name = typeof answers.fullName === "string" ? answers.fullName : "";
  const unit = typeof answers.unit === "string" ? answers.unit : "";
  const when = new Date(receipt.submittedAt).toLocaleString(lang === "pt" ? "pt-BR" : "en-GB", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <>
      <div className="flex flex-1 flex-col justify-center px-5 pb-4 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <div className="flex flex-col items-center text-center">
          <p className="kicker mb-8 text-teal">{t(ui.doneKicker)}</p>

          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="relative flex h-32 w-32 items-center justify-center text-teal"
          >
            {[0, 1].map((i) => (
              <motion.span
                key={i}
                className="absolute inset-0 rounded-full border border-teal"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1.6, opacity: [0, 0.4, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 + i, ease: "easeOut" }}
              />
            ))}
            <IconCheckCircle className="h-20 w-20" strokeWidth={1.5} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="mt-6"
          >
            <h1 className="font-display text-2xl font-semibold text-navy">{t(ui.doneTitle)}</h1>
            <p className="mt-2 max-w-[30ch] text-[15px] leading-relaxed text-navy">
              {t(ui.doneLead)}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.55 }}
          className="mt-8 space-y-3"
        >
          <div className="rounded-2xl bg-paper p-5 shadow-sm">
            <p className="kicker mb-1.5 text-gray-1">{t(ui.protocol)}</p>
            <p className="font-display text-2xl font-medium tracking-wide text-navy">
              {receipt.protocol}
            </p>
            <div className="mt-4 space-y-1.5 border-t border-gray-3 pt-4 text-sm text-gray-1">
              {[name, unit, when].filter(Boolean).map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-paper p-5 shadow-sm">
            <p className="mb-3 font-display text-sm font-medium text-navy">{t(ui.doneNextTitle)}</p>
            <ul className="space-y-2.5">
              {ui.doneNext[lang].map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.07 }}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-navy"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          <p className="px-4 pt-1 text-center text-[13px] font-light text-gray-2">
            {t(ui.prototypeNote)}
          </p>
        </motion.div>
      </div>

      <StickyFooter>
        <SecondaryButton onClick={onRestart}>{t(ui.restart)}</SecondaryButton>
      </StickyFooter>
    </>
  );
}
