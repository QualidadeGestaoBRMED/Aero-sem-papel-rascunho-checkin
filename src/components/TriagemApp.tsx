"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import {
  formSteps,
  isAnswered,
  visibleFields,
  isStepComplete,
  stepIndexOfField,
  type AnswerValue,
  type Answers,
  type FormStep,
} from "@/lib/form-schema";
import {
  getLangSnapshot,
  getServerLangSnapshot,
  LangContext,
  setStoredLang,
  subscribeLang,
  ui,
  useLang,
} from "@/lib/i18n";
import { PrimaryButton, Screen, StickyFooter, TopBar, TriagemMark } from "./AppChrome";
import { StepScreen } from "./fields/StepScreen";
import { ConfirmationScreen, type Receipt } from "./ConfirmationScreen";
import { ReviewScreen } from "./ReviewScreen";
import { LanguageToggle } from "./LanguageToggle";
import { IconClock, IconId, IconLock, IconSteps } from "./icons";

type Step = "splash" | "welcome" | "form" | "review" | "done";

const SPLASH_DURATION = 2400;
const AUTO_ADVANCE_DELAY = 650;

/*
 * Escolha e busca sozinhas avançam automaticamente e dispensam rodapé. Ganham
 * botão quando revelam um campo agrupado, que precisa ser preenchido antes.
 * Anexo só ganha rodapé depois de ter arquivo: enquanto a câmera está aberta
 * quem manda é o "Tirar foto" — dois botões fixos se sobrepunham.
 */
function showsContinue(step: FormStep, answers: Answers) {
  if (step.children.length > 0) return true;
  const { widget } = step.primary;
  if (widget === "choice" || widget === "search") return false;
  if (widget === "photo" || widget === "file") return isAnswered(step.primary, answers);
  return true;
}

const newProtocol = () =>
  `TRG-${Date.now().toString(36).toUpperCase().slice(-6)}-${Math.random()
    .toString(36)
    .slice(2, 5)
    .toUpperCase()}`;

export function TriagemApp() {
  const lang = useSyncExternalStore(subscribeLang, getLangSnapshot, getServerLangSnapshot);

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang: setStoredLang }), [lang]);

  return (
    <LangContext.Provider value={value}>
      <MotionConfig reducedMotion="user">
        <div className="min-h-dvh bg-background">
          <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col">
            <Flow />
          </div>
        </div>
      </MotionConfig>
    </LangContext.Provider>
  );
}

function Flow() {
  const { t } = useLang();
  const [step, setStep] = useState<Step>("splash");
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showError, setShowError] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  /** Quando se edita a partir da revisão, avançar volta direto para a revisão. */
  const [returnToReview, setReturnToReview] = useState(false);

  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearAdvance = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = null;
  };
  useEffect(() => clearAdvance, []);

  useEffect(() => {
    if (step !== "splash") return;
    const timer = setTimeout(() => setStep("welcome"), SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, [step]);

  // Recalculado a cada resposta: responder "Não sou terceirizado" remove
  // passos da lista e a barra de progresso encolhe junto.
  const steps = formSteps(answers);
  const safeIndex = Math.min(index, steps.length - 1);
  const current = steps[safeIndex];

  const setAnswer = (id: string, value: AnswerValue | undefined) =>
    setAnswers((prev) => {
      const next = { ...prev, [id]: value };
      if (value === undefined) delete next[id];
      return next;
    });

  const goToNext = (from: number, after: Answers) => {
    setShowError(false);
    setDirection(1);
    if (returnToReview) {
      setReturnToReview(false);
      setStep("review");
      return;
    }
    const remaining = formSteps(after);
    if (from >= remaining.length - 1) setStep("review");
    else setIndex(from + 1);
  };

  /*
   * Escolha única confirma visualmente e avança sozinha — mas só quando a
   * resposta não revela um campo agrupado. Se revelar, o passo segue aberto
   * para que o campo novo seja preenchido.
   */
  const handleSelect = (id: string, value: string) => {
    const next: Answers = { ...answers, [id]: value };
    setAnswers(next);
    navigator.vibrate?.(12);
    clearAdvance();

    const updated = formSteps(next)[safeIndex];
    if (!updated || !isStepComplete(updated, next)) return;

    advanceTimer.current = setTimeout(() => {
      advanceTimer.current = null;
      goToNext(safeIndex, next);
    }, AUTO_ADVANCE_DELAY);
  };

  const handleContinue = () => {
    if (!current || !isStepComplete(current, answers)) return setShowError(true);
    goToNext(safeIndex, answers);
  };

  const handleBack = () => {
    clearAdvance();
    setShowError(false);
    if (returnToReview) {
      setReturnToReview(false);
      setStep("review");
    } else if (safeIndex > 0) {
      setDirection(-1);
      setIndex(safeIndex - 1);
    } else {
      setStep("welcome");
    }
  };

  const handleEdit = (fieldId: string) => {
    const target = stepIndexOfField(steps, fieldId);
    if (target < 0) return;
    setReturnToReview(true);
    setDirection(-1);
    setIndex(target);
    setStep("form");
  };

  const handleSubmit = () => {
    setReceipt({ protocol: newProtocol(), submittedAt: new Date().toISOString() });
    setStep("done");
  };

  const handleRestart = () => {
    clearAdvance();
    setAnswers({});
    setIndex(0);
    setDirection(1);
    setShowError(false);
    setReturnToReview(false);
    setReceipt(null);
    setStep("welcome");
  };

  const welcomeItems = [
    { icon: IconSteps, text: t(ui.welcomeSteps) },
    { icon: IconClock, text: t(ui.welcomeTime) },
    { icon: IconId, text: t(ui.welcomeDocument) },
  ];

  return (
    <AnimatePresence mode="wait">
      {step === "splash" && (
        <Screen key="splash" className="items-center justify-center bg-navy">
          <button
            onClick={() => setStep("welcome")}
            aria-label={t(ui.splashSkip)}
            className="flex flex-col items-center gap-9 outline-none"
          >
            <div className="relative flex h-28 w-28 items-center justify-center text-teal-vivid">
              {[0, 1].map((i) => (
                <motion.span
                  key={i}
                  className="absolute inset-0 rounded-full border border-teal-vivid"
                  initial={{ scale: 0.55, opacity: 0 }}
                  animate={{ scale: 2, opacity: [0, 0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.4 + i, ease: "easeOut" }}
                />
              ))}
              <TriagemMark className="h-16 w-16" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-center"
            >
              <p className="kicker mb-1.5 text-blue-lighter">{t(ui.kicker)}</p>
              <p className="font-display text-4xl font-semibold text-paper">{t(ui.appName)}</p>
            </motion.div>
          </button>
        </Screen>
      )}

      {step === "welcome" && (
        <Screen key="welcome">
          <div className="relative overflow-hidden rounded-b-[2rem] bg-navy px-6 pb-12 pt-[max(4rem,calc(env(safe-area-inset-top)+2.5rem))] text-paper">
            <div className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-teal-vivid/20" />
            <div className="pointer-events-none absolute right-16 top-28 h-14 w-14 rounded-full bg-teal-vivid/15" />
            <div className="absolute right-5 top-[max(1.25rem,env(safe-area-inset-top))]">
              <LanguageToggle tone="dark" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              <TriagemMark className="mb-6 h-12 w-12 text-teal-vivid" />
              <p className="kicker mb-2 text-blue-lighter">{t(ui.kicker)}</p>
              <h1 className="max-w-[16ch] font-display text-[2rem] font-semibold leading-tight">
                {t(ui.welcomeTitle)}
              </h1>
              <p className="mt-3 max-w-[28ch] text-[15px] leading-relaxed text-blue-soft">
                {t(ui.welcomeLead)}
              </p>
            </motion.div>
          </div>

          <div className="flex flex-1 flex-col justify-center gap-3.5 px-5 py-6">
            {welcomeItems.map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.2 + i * 0.08 }}
                className="flex items-center gap-4 rounded-2xl bg-paper p-4 shadow-sm"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal/10 text-teal">
                  <item.icon className="h-5 w-5" />
                </span>
                <p className="text-[15px] font-normal text-navy">{item.text}</p>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.44 }}
              className="flex items-start gap-3 rounded-2xl bg-teal/8 p-4"
            >
              <IconLock className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
              <p className="text-sm leading-relaxed text-gray-1">
                <strong className="text-teal">{t(ui.privacyLabel)}</strong> {t(ui.privacyText)}
              </p>
            </motion.div>
          </div>

          <StickyFooter>
            <PrimaryButton onClick={() => setStep("form")}>{t(ui.start)}</PrimaryButton>
          </StickyFooter>
        </Screen>
      )}

      {step === "form" && current && (
        <Screen key="form">
          <header className="px-5">
            <TopBar
              onBack={handleBack}
              center={
                <span className="font-display text-sm font-medium text-gray-1">
                  {safeIndex + 1} {t(ui.stepOf)} {steps.length}
                </span>
              }
              right={<LanguageToggle />}
            />
            <div className="mt-1 flex gap-1.5">
              {steps.map((s, i) => (
                <div
                  key={s.id}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                    i <= safeIndex ? "bg-teal" : "bg-gray-3"
                  }`}
                />
              ))}
            </div>
          </header>

          <div className="flex flex-1 flex-col overflow-hidden px-5">
            <AnimatePresence mode="wait" custom={direction}>
              <StepScreen
                key={current.id}
                step={current}
                answers={answers}
                direction={direction}
                showError={showError}
                onSelect={handleSelect}
                onChange={setAnswer}
                onSubmit={handleContinue}
              />
            </AnimatePresence>
          </div>

          {showsContinue(current, answers) ? (
            <StickyFooter>
              <PrimaryButton
                onClick={handleContinue}
                disabled={!isStepComplete(current, answers)}
              >
                {t(ui.continue)}
              </PrimaryButton>
            </StickyFooter>
          ) : (
            <div className="flex items-center justify-center gap-1.5 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
              <IconLock className="h-3.5 w-3.5 text-gray-2" />
              <p className="text-xs font-light text-gray-2">{t(ui.confidential)}</p>
            </div>
          )}
        </Screen>
      )}

      {step === "review" && (
        <Screen key="review">
          <ReviewScreen
            fields={visibleFields(answers)}
            answers={answers}
            onEdit={handleEdit}
            onBack={() => {
              setDirection(-1);
              setIndex(steps.length - 1);
              setStep("form");
            }}
            onSubmit={handleSubmit}
          />
        </Screen>
      )}

      {step === "done" && receipt && (
        <Screen key="done">
          <ConfirmationScreen receipt={receipt} answers={answers} onRestart={handleRestart} />
        </Screen>
      )}
    </AnimatePresence>
  );
}
