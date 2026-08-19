import type { Bilingual } from "./i18n";

export function formatCPF(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

/** Valida os dois dígitos verificadores — 11 dígitos por si só não bastam. */
export function isValidCPF(value: string): boolean {
  const d = value.replace(/\D/g, "");
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;

  const digit = (upTo: number) => {
    let sum = 0;
    for (let i = 0; i < upTo; i++) sum += Number(d[i]) * (upTo + 1 - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  return digit(9) === Number(d[9]) && digit(10) === Number(d[10]);
}

export const MIN_AGE = 16;
export const MAX_AGE = 90;

export function ageOn(birthDate: string, reference = new Date()): number {
  const born = new Date(`${birthDate}T00:00:00`);
  let age = reference.getFullYear() - born.getFullYear();
  const monthDiff = reference.getMonth() - born.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && reference.getDate() < born.getDate())) age--;
  return age;
}

export const messages = {
  invalidCPF: {
    pt: "CPF inválido. Confira os números.",
    en: "Invalid CPF. Please check the numbers.",
  },
  invalidPassport: {
    pt: "Informe o número do passaporte.",
    en: "Enter your passport number.",
  },
  invalidName: {
    pt: "Informe seu nome e sobrenome.",
    en: "Enter your first and last name.",
  },
  invalidDate: { pt: "Informe uma data válida.", en: "Enter a valid date." },
  futureDate: {
    pt: "A data não pode estar no futuro.",
    en: "The date cannot be in the future.",
  },
  ageOutOfRange: {
    pt: `Idade fora do esperado para embarque (${MIN_AGE} a ${MAX_AGE} anos).`,
    en: `Age outside the expected boarding range (${MIN_AGE} to ${MAX_AGE}).`,
  },
  emptyText: { pt: "Preencha este campo.", en: "Please fill in this field." },
} satisfies Record<string, Bilingual>;

export function validateCPF(value: string): Bilingual | null {
  return isValidCPF(value) ? null : messages.invalidCPF;
}

export function validatePassport(value: string): Bilingual | null {
  return value.trim().length >= 5 ? null : messages.invalidPassport;
}

export function validateFullName(value: string): Bilingual | null {
  const parts = value.trim().split(/\s+/).filter((p) => p.length >= 2);
  return parts.length >= 2 ? null : messages.invalidName;
}

export function validateBirthDate(value: string): Bilingual | null {
  if (!value || Number.isNaN(new Date(`${value}T00:00:00`).getTime())) return messages.invalidDate;
  if (new Date(`${value}T00:00:00`) > new Date()) return messages.futureDate;
  const age = ageOn(value);
  return age >= MIN_AGE && age <= MAX_AGE ? null : messages.ageOutOfRange;
}

export function validateText(value: string): Bilingual | null {
  return value.trim().length > 0 ? null : messages.emptyText;
}
