"use client";

import { createContext, useContext } from "react";

export type Lang = "pt" | "en";

/** Texto que existe nos dois idiomas. O schema e o dicionário usam esta forma. */
export type Bilingual = { pt: string; en: string };

export const t = (text: Bilingual, lang: Lang) => text[lang];

export const LangContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
}>({ lang: "pt", setLang: () => {} });

export function useLang() {
  const { lang, setLang } = useContext(LangContext);
  return { lang, setLang, t: (text: Bilingual) => text[lang] };
}

const STORAGE_KEY = "triagem.lang";

/*
 * O idioma escolhido vive no localStorage, que é um store externo: lê-lo
 * durante o render quebraria a pré-renderização. useSyncExternalStore resolve
 * isso com um snapshot de servidor ("pt") e a troca já hidratada.
 */
let current: Lang | null = null;
const listeners = new Set<() => void>();

export function subscribeLang(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

export function getLangSnapshot(): Lang {
  if (!current) current = window.localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "pt";
  return current;
}

export const getServerLangSnapshot = (): Lang => "pt";

export function setStoredLang(lang: Lang) {
  current = lang;
  window.localStorage.setItem(STORAGE_KEY, lang);
  listeners.forEach((listener) => listener());
}

/** Strings de interface. Conteúdo de campo mora em form-schema.ts. */
export const ui = {
  appName: { pt: "Triagem", en: "Screening" },
  kicker: { pt: "Saúde ocupacional", en: "Occupational health" },
  splashSkip: { pt: "Pular abertura", en: "Skip intro" },

  welcomeTitle: {
    pt: "Triagem de saúde pré-embarque",
    en: "Pre-boarding health screening",
  },
  welcomeLead: {
    pt: "Antes de embarcar, confirme seus dados e sua identidade. Leva poucos minutos.",
    en: "Before boarding, confirm your details and identity. It only takes a few minutes.",
  },
  welcomeSteps: {
    pt: "Cerca de 10 etapas rápidas",
    en: "About 10 quick steps",
  },
  welcomeTime: { pt: "Leva de 3 a 5 minutos", en: "Takes 3 to 5 minutes" },
  welcomeDocument: {
    pt: "Tenha seu documento oficial com foto em mãos",
    en: "Have your official photo ID at hand",
  },
  privacyLabel: { pt: "Dados protegidos.", en: "Protected data." },
  privacyText: {
    pt: "Suas informações são usadas apenas para liberar seu embarque.",
    en: "Your information is used only to clear you for boarding.",
  },
  start: { pt: "Iniciar check-in", en: "Start check-in" },

  back: { pt: "Voltar", en: "Back" },
  continue: { pt: "Continuar", en: "Continue" },
  stepOf: { pt: "de", en: "of" },
  confidential: { pt: "Dados confidenciais", en: "Confidential data" },
  required: { pt: "Este campo é obrigatório.", en: "This field is required." },
  language: { pt: "Idioma", en: "Language" },

  searchPlaceholder: { pt: "Buscar...", en: "Search..." },
  noResults: { pt: "Nenhum resultado.", en: "No results." },
  otherOption: { pt: "Outra", en: "Other" },
  clearSelection: { pt: "Limpar seleção", en: "Clear selection" },

  cameraTitle: { pt: "Enquadre seu rosto", en: "Frame your face" },
  cameraStart: { pt: "Abrir câmera", en: "Open camera" },
  cameraCapture: { pt: "Tirar foto", en: "Take photo" },
  cameraRetake: { pt: "Refazer", en: "Retake" },
  cameraUse: { pt: "Usar esta foto", en: "Use this photo" },
  cameraLoading: { pt: "Abrindo câmera...", en: "Opening camera..." },
  cameraDenied: {
    pt: "Não foi possível acessar a câmera. Você pode enviar um arquivo.",
    en: "Camera unavailable. You can upload a file instead.",
  },
  chooseFile: { pt: "Escolher arquivo", en: "Choose file" },
  replaceFile: { pt: "Trocar arquivo", en: "Replace file" },
  fileTooLarge: {
    pt: "Arquivo muito grande. Envie até 10 MB.",
    en: "File too large. Please upload up to 10 MB.",
  },
  fileWrongType: {
    pt: "Formato não aceito.",
    en: "Format not accepted.",
  },

  reviewKicker: { pt: "Revisão", en: "Review" },
  reviewTitle: { pt: "Confira antes de enviar", en: "Check before submitting" },
  reviewLead: {
    pt: "Toque em qualquer item para corrigir.",
    en: "Tap any item to correct it.",
  },
  reviewEdit: { pt: "Editar", en: "Edit" },
  reviewPending: { pt: "Falta preencher", en: "Still missing" },
  reviewIncomplete: {
    pt: "Faltam informações obrigatórias.",
    en: "Required information is missing.",
  },
  photoAttached: { pt: "Foto anexada", en: "Photo attached" },
  submit: { pt: "Finalizar check-in", en: "Complete check-in" },

  doneKicker: { pt: "Check-in concluído", en: "Check-in complete" },
  doneTitle: { pt: "Tudo certo!", en: "All set!" },
  doneLead: {
    pt: "Seu check-in de triagem foi registrado.",
    en: "Your screening check-in has been recorded.",
  },
  protocol: { pt: "Protocolo", en: "Protocol" },
  doneNextTitle: { pt: "Próximos passos", en: "Next steps" },
  doneNext: {
    pt: [
      "Sua foto passará por validação de identidade",
      "Guarde o número do protocolo",
      "Em caso de dúvida, procure a Saúde Ocupacional",
    ],
    en: [
      "Your photo will go through identity validation",
      "Keep your protocol number",
      "If in doubt, contact Occupational Health",
    ],
  },
  restart: { pt: "Novo check-in", en: "New check-in" },
  prototypeNote: {
    pt: "Protótipo: nenhum dado foi enviado.",
    en: "Prototype: no data was submitted.",
  },
} satisfies Record<string, Bilingual | { pt: string[]; en: string[] }>;
