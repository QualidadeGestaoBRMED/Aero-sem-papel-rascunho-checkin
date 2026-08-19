# Triagem — Saúde Ocupacional

Check-in de triagem de saúde ocupacional pré-embarque, mobile-first, para colaboradores do segmento de óleo e gás. Front-end em Next.js + Tailwind CSS, com identidade visual própria (marca neutra).

Espelha o formulário público de Triagem de Saúde Ocupacional que hoje roda no Pipefy (form `70YT8hnz`), em português e inglês.

## Fluxo

1. **Boas-vindas** — capa navy com o que esperar e seletor PT/EN
2. **Formulário** — um campo por tela, com barra de progresso que se ajusta aos ramos condicionais
3. **Foto de identidade** — câmera in-app com moldura de enquadramento
4. **Revisão** — todas as respostas, tocáveis para corrigir; pendências marcadas em âmbar
5. **Confirmação** — protocolo e próximos passos

### Campos

Tipo de documento (CPF ou passaporte) · número do documento · documento digital? · nome completo · empresa de embarque · unidade (FPSO) · terceirização · empresa terceirizada · função · data de nascimento · foto de validação de identidade · arquivo do documento digital.

O caminho vai de **9 a 11 telas**, conforme os ramos condicionais. Campos dependentes não ganham tela própria: são revelados logo abaixo da escolha que os dispara (`groupedUnder` no schema), como o número do documento sob o tipo de documento.

## Arquitetura

O formulário é dirigido por dados. `src/lib/form-schema.ts` declara cada campo — widget, rótulo bilíngue, validação, `visibleWhen` e `groupedUnder` — e `formSteps(answers)` devolve os passos válidos para as respostas atuais, cada um com o campo principal e os filhos revelados. Acrescentar, agrupar ou reordenar um campo é editar esse arquivo.

Os controles (`fields/*.tsx`) não sabem em que contexto estão: `StepScreen` os monta tanto em tela cheia quanto agrupados sob o pai.

- `src/lib/options.ts` — listas das tabelas conectadas (9 unidades, 58 empresas terceirizadas, 175 funções)
- `src/lib/i18n.ts` — dicionário PT/EN; o idioma vive no `localStorage` via `useSyncExternalStore`
- `src/lib/validation.ts` — CPF com dígitos verificadores, data de nascimento, texto obrigatório
- `src/components/fields/` — um componente por widget, todos sob a mesma moldura (`FieldShell`)

## Design system

- **Cores**: tokens oficiais em `src/app/globals.css` — navy `#193B4F` (principal), teal `#007891` (apoio/estado atual)
- **Semântica de alerta**: normal = teal, pendência/atenção = âmbar `#CC851E`, crítico = terracota `#A05E1E`. Nunca vermelho ou verde puros.
- **Tipografia**: Work Sans (300–600, nunca 700+) para títulos, números e rótulos; Roboto (300 padrão, 400/500 para ênfase) para corpo — via `next/font`
- **Mobile-first**: shell de app com `max-w-md`, safe areas, CTA fixo na zona do polegar, transições de tela com Motion

## Rodando

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) — idealmente no modo device do DevTools.

A câmera exige contexto seguro. `localhost` já conta como seguro, então funciona no desktop. Para testar num celular pela rede local:

```bash
npm run dev -- --experimental-https
```

Quando a câmera não está disponível ou a permissão é negada, o app cai automaticamente para envio de arquivo.

## Stack

- Next.js 16 (App Router, Turbopack) + TypeScript
- Tailwind CSS v4
- Motion (animações); ícones próprios em `src/components/icons.tsx`

Apenas front-end: **nada é enviado a nenhum servidor**. Ao finalizar, o app gera um protocolo local e mostra a confirmação. A forma do payload para uma futura integração está documentada no fim de `src/lib/form-schema.ts`.
