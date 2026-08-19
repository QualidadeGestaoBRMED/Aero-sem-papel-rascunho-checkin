import type { Bilingual } from "./i18n";
import { BOARDING_COMPANIES, CONTRACTORS, POSITIONS, UNITS } from "./options";
import {
  validateBirthDate,
  validateCPF,
  validateFullName,
  validatePassport,
  validateText,
} from "./validation";

/*
 * Espelha o formulário público de Triagem de Saúde Ocupacional do Pipefy
 * (form 70YT8hnz). Cada campo carrega o uuid de origem para que uma futura
 * integração seja só mapear id -> uuid; ver PAYLOAD_SHAPE no fim do arquivo.
 *
 * Os campos-espelho do Pipefy ("3.1 ... - Texto", "5.2 ... - Texto",
 * "6.1 Função - Original") não aparecem aqui: são plumbing de automação,
 * preenchidos por cópia e nunca pelo usuário.
 */

export type FileValue = { name: string; type: string; dataUrl: string };
export type AnswerValue = string | FileValue;
export type Answers = Partial<Record<string, AnswerValue>>;

export const OTHER = "__other__";

export type Widget = "choice" | "text" | "cpf" | "date" | "search" | "photo" | "file";

export interface ChoiceOption {
  value: string;
  label: Bilingual;
}

export interface FieldDef {
  id: string;
  /** uuid do campo no formulário de origem. */
  pipefyUuid: string;
  widget: Widget;
  label: Bilingual;
  /**
   * Renderiza dentro do passo deste campo pai, revelado logo abaixo dele em
   * vez de ganhar tela própria — agrupa o par escolha/resposta.
   */
  groupedUnder?: string;
  /** Rótulo curto usado quando o campo aparece agrupado sob o pai. */
  groupLabel?: Bilingual;
  /** Subtítulo curto, vindo do `description` do Pipefy. */
  hint?: Bilingual;
  /** Orientações longas — os StatementField que precedem os anexos. */
  guidance?: Bilingual[];
  placeholder?: Bilingual;
  options?: ChoiceOption[];
  /** Lista de uma tabela conectada, para o seletor com busca. */
  searchOptions?: readonly string[];
  /** Acrescenta "Outra" ao fim da lista de busca. */
  allowOther?: boolean;
  accept?: string;
  /** Escolha única confirma e avança sozinha; texto e data usam o rodapé. */
  autoAdvance?: boolean;
  visibleWhen?: (answers: Answers) => boolean;
  validate?: (value: string) => Bilingual | null;
}

const YES = "YES";
const NO = "NO";

const yesNo: ChoiceOption[] = [
  { value: YES, label: { pt: "Sim", en: "Yes" } },
  { value: NO, label: { pt: "Não", en: "No" } },
];

const DOC_CPF = "CPF";
const DOC_PASSPORT = "PASSPORT";

const answerOf = (answers: Answers, id: string) =>
  typeof answers[id] === "string" ? (answers[id] as string) : "";

export const fields: FieldDef[] = [
  {
    id: "docType",
    pipefyUuid: "45e45887-fcfa-4e77-bcba-9a135d3c7302",
    widget: "choice",
    label: { pt: "Informe o tipo de documento", en: "Select document type" },
    autoAdvance: true,
    options: [
      { value: DOC_CPF, label: { pt: "CPF", en: "CPF (Brazilian Tax ID)" } },
      { value: DOC_PASSPORT, label: { pt: "Passaporte", en: "Passport" } },
    ],
  },
  {
    id: "cpf",
    pipefyUuid: "51d2880f-87ea-4886-97c8-3199b40b83ac",
    widget: "cpf",
    label: { pt: "Qual é o seu CPF?", en: "What is your CPF?" },
    hint: { pt: "Cadastro de Pessoa Física", en: "Brazilian Tax ID" },
    groupedUnder: "docType",
    groupLabel: { pt: "Número do CPF", en: "CPF number" },
    placeholder: { pt: "000.000.000-00", en: "000.000.000-00" },
    visibleWhen: (a) => answerOf(a, "docType") === DOC_CPF,
    validate: validateCPF,
  },
  {
    id: "passport",
    pipefyUuid: "4745e921-dfa2-4352-b1ab-4d9535affbc0",
    widget: "text",
    label: { pt: "Qual é o número do passaporte?", en: "What is your passport number?" },
    groupedUnder: "docType",
    groupLabel: { pt: "Número do passaporte", en: "Passport number" },
    placeholder: { pt: "Ex: AB123456", en: "e.g. AB123456" },
    visibleWhen: (a) => answerOf(a, "docType") === DOC_PASSPORT,
    validate: validatePassport,
  },
  {
    id: "digitalDoc",
    pipefyUuid: "75c6bc7f-c21c-45d9-a089-6fde5e248e6b",
    widget: "choice",
    label: {
      pt: "O documento apresentado é em formato digital?",
      en: "Is the document presented in digital format?",
    },
    autoAdvance: true,
    options: yesNo,
  },
  {
    id: "fullName",
    pipefyUuid: "db2ca43f-1a77-4af3-a358-5890f2d9c74b",
    widget: "text",
    label: { pt: "Qual é o seu nome completo?", en: "What is your full name?" },
    placeholder: { pt: "Nome e sobrenome", en: "First and last name" },
    validate: validateFullName,
  },
  {
    id: "company",
    pipefyUuid: "c726c0cb-da55-48f1-a002-c0283ca9d155",
    widget: "choice",
    label: {
      pt: "Para qual empresa está embarcando?",
      en: "Which company are you boarding for?",
    },
    autoAdvance: true,
    options: BOARDING_COMPANIES.map((name) => ({
      value: name,
      label: { pt: name, en: name },
    })),
  },
  {
    id: "unit",
    pipefyUuid: "3c1605d3-bdfd-4a9c-aee5-4f14affd9310",
    widget: "search",
    label: { pt: "Qual é a unidade de embarque?", en: "Which is your boarding unit?" },
    hint: { pt: "FPSO", en: "FPSO" },
    searchOptions: UNITS,
  },
  {
    id: "contractor",
    pipefyUuid: "e4112ab4-6976-4c31-ad97-0f27a76a35a8",
    widget: "choice",
    label: { pt: "Você é terceirizado?", en: "Are you a contractor?" },
    autoAdvance: true,
    options: yesNo,
  },
  {
    id: "contractorCompany",
    pipefyUuid: "c8844fd5-cc80-4248-b27f-7bd34e68d168",
    widget: "search",
    label: { pt: "Qual é a empresa terceirizada?", en: "Which contractor company?" },
    searchOptions: CONTRACTORS,
    allowOther: true,
    visibleWhen: (a) => answerOf(a, "contractor") === YES,
  },
  {
    id: "contractorOther",
    pipefyUuid: "ea48d1d4-3f6f-4df3-8d8e-b9964a3b795a",
    widget: "text",
    label: { pt: "Qual é a empresa terceirizada?", en: "Which contractor company?" },
    hint: { pt: "Não encontrada na lista", en: "Not found in the list" },
    groupedUnder: "contractorCompany",
    groupLabel: { pt: "Nome da empresa", en: "Company name" },
    placeholder: { pt: "Nome da empresa", en: "Company name" },
    visibleWhen: (a) => answerOf(a, "contractorCompany") === OTHER,
    validate: validateText,
  },
  {
    id: "position",
    pipefyUuid: "2467ce0e-7e84-408c-9678-d4019dee3e98",
    widget: "search",
    label: { pt: "Qual é a sua função?", en: "What is your position?" },
    searchOptions: POSITIONS,
    allowOther: true,
  },
  {
    id: "positionOther",
    pipefyUuid: "6a80c2ae-23be-4c4c-883f-fdc4a641b92f",
    widget: "text",
    label: { pt: "Qual é a sua função?", en: "What is your position?" },
    hint: { pt: "Não encontrada na lista", en: "Not found in the list" },
    groupedUnder: "position",
    groupLabel: { pt: "Nome da função", en: "Position name" },
    placeholder: { pt: "Nome da função", en: "Position name" },
    visibleWhen: (a) => answerOf(a, "position") === OTHER,
    validate: validateText,
  },
  {
    id: "birthDate",
    pipefyUuid: "b60e4bb1-7ba1-4604-83cf-9705180d7193",
    widget: "date",
    label: { pt: "Qual é a sua data de nascimento?", en: "What is your date of birth?" },
    validate: validateBirthDate,
  },
  {
    id: "photo",
    pipefyUuid: "a701366e-e989-4419-8402-b2642092ff0b",
    widget: "photo",
    label: {
      pt: "Foto para validação de identidade",
      en: "Photo for identity verification",
    },
    guidance: [
      {
        pt: "Segure seu documento oficial com foto ao lado do rosto.",
        en: "Hold your official photo ID next to your face.",
      },
      {
        pt: "Fundo claro, local bem iluminado e imagem nítida.",
        en: "Light background, well-lit environment and a sharp image.",
      },
    ],
    accept: "image/*",
  },
  {
    id: "digitalDocFile",
    pipefyUuid: "c0b2dfc6-1aa7-414d-823c-25b23a01c677",
    widget: "file",
    label: {
      pt: "Arquivo do documento digital",
      en: "Digital identification document file",
    },
    guidance: [
      {
        pt: "Anexe o documento de identificação digital.",
        en: "Attach the digital identification document.",
      },
      {
        pt: "Formatos aceitos: PDF, JPG, PNG, HEIC.",
        en: "Accepted formats: PDF, JPG, PNG, HEIC.",
      },
    ],
    accept: "application/pdf,image/*",
    visibleWhen: (a) => answerOf(a, "digitalDoc") === YES,
  },
];

/** Todo campo visível, achatado — base da revisão e da conferência final. */
export function visibleFields(answers: Answers): FieldDef[] {
  return fields.filter((field) => !field.visibleWhen || field.visibleWhen(answers));
}

/** Um campo de tela cheia mais os filhos revelados abaixo dele. */
export interface FormStep {
  id: string;
  primary: FieldDef;
  children: FieldDef[];
}

/** Passos visíveis agora — a base da navegação e da barra de progresso. */
export function formSteps(answers: Answers): FormStep[] {
  const visible = visibleFields(answers);
  return visible
    .filter((field) => !field.groupedUnder)
    .map((primary) => ({
      id: primary.id,
      primary,
      children: visible.filter((field) => field.groupedUnder === primary.id),
    }));
}

export function isStepComplete(step: FormStep, answers: Answers): boolean {
  return (
    isAnswered(step.primary, answers) &&
    step.children.every((child) => isAnswered(child, answers))
  );
}

/** Em qual passo mora um campo — usado ao editar a partir da revisão. */
export function stepIndexOfField(steps: FormStep[], fieldId: string): number {
  return steps.findIndex(
    (step) => step.primary.id === fieldId || step.children.some((c) => c.id === fieldId)
  );
}

export function isAnswered(field: FieldDef, answers: Answers): boolean {
  const value = answers[field.id];
  if (!value) return false;
  if (typeof value !== "string") return Boolean(value.dataUrl);
  if (!value.trim()) return false;
  return !field.validate || field.validate(value) === null;
}

/**
 * Forma do envio, para quando houver integração. Hoje nada é enviado:
 * o app é protótipo e encerra na tela de confirmação.
 *
 *   { formId: "70YT8hnz",
 *     fields: [{ fieldId: <pipefyUuid>, fieldValue: [<valor>] }, ...] }
 *
 * Anexos precisam antes ser subidos via presigned URL do Pipefy, e o valor
 * enviado passa a ser o path retornado.
 */
export const PIPEFY_FORM_ID = "70YT8hnz";
