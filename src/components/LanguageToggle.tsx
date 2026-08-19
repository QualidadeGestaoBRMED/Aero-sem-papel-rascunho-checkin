"use client";

import { motion } from "motion/react";
import { ui, useLang, type Lang } from "@/lib/i18n";

const langs: { value: Lang; label: string }[] = [
  { value: "pt", label: "PT" },
  { value: "en", label: "EN" },
];

export function LanguageToggle({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { lang, setLang, t } = useLang();
  const onDark = tone === "dark";

  return (
    <div
      role="group"
      aria-label={t(ui.language)}
      className={`relative flex rounded-full p-0.5 ${onDark ? "bg-paper/15" : "bg-gray-3/70"}`}
    >
      {langs.map((option) => {
        const active = lang === option.value;
        return (
          <button
            key={option.value}
            onClick={() => setLang(option.value)}
            aria-pressed={active}
            className={`relative rounded-full px-2.5 py-1.5 font-display text-[11px] font-medium tracking-wide transition-colors ${
              active
                ? onDark
                  ? "text-navy"
                  : "text-paper"
                : onDark
                  ? "text-paper/70"
                  : "text-gray-1"
            }`}
          >
            {active && (
              <motion.span
                layoutId={`lang-pill-${tone}`}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                className={`absolute inset-0 rounded-full ${onDark ? "bg-paper" : "bg-teal"}`}
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
