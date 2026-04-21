---
name: frontend-development
description: Aplica Next.js App Router, React, TypeScript (strict), Tailwind CSS v4, Shadcn/Radix via packages/ui, ícones Lucide e padrões RSC-first neste repositório. Usar ao criar ou editar UI, páginas, layouts, rotas, loading/error UI, componentes de feature, hooks, className e estilo Tailwind, formulários, Server Actions, validação Zod na fronteira cliente/servidor, diretivas client-only, busca de dados em Server Components, estado URL/busca, modais, tabelas, painéis, navegação, acessibilidade ou a estética escura minimalista "Clean Architect". Disparar quando a tarefa tocar src/app, src/components, src/hooks, src/lib para apresentação, ou quando o usuário mencionar frontend, UI, interface, página, componente, Next.js, React, Tailwind ou Shadcn.
disable-model-invocation: false
---

# Desenvolvimento frontend

## Agente — carregar esta skill automaticamente quando

A conversa envolver qualquer um dos tópicos: desenhar ou alterar telas; adicionar ou refatorar `.tsx` em `src/app` ou `src/components`; Tailwind, layout ou comportamento responsivo; escolher Server vs Client Components; formulários, mutações ou Server Actions; UI compartilhada de `packages/ui`; a11y ou estilo visual conforme regras do projeto.

## Quando usar (checklist humano)

- Implementar ou refatorar rotas, layouts ou componentes de feature em `src/`.
- Escolher Server vs Client Components, carregamento de dados ou mutações.
- Aplicar Tailwind, tokens de design ou UI compartilhada de `packages/ui`.

## Antes de codar

1. Ler `.cursor/rules/qualidade-codigo.mdc` (código limpo geral) e `.cursor/rules/boas-praticas-frontend.mdc` (stack e UI).
2. Para formulários, rotas de API e entrada não confiável, validar com **Zod** nas fronteiras cliente/servidor (regra de segurança adicional pode ser adicionada em `.cursor/rules/` quando existir).

## Checklist de implementação

### Padrões da stack

- **Next.js**: só App Router; não adicionar `pages/`.
- **TypeScript**: tipos strict; sem `any` implícito em props públicas ou handlers.
- **Estilo**: utilities Tailwind + `cn` / `cntl` para classes condicionais; evitar pixels arbitrários; preferir tokens do tema.
- **UI**: Preferir primitivos Shadcn/Radix de `packages/ui` a HTML cru para controles interativos.
- **Ícones**: Lucide React.

### Server Components primeiro

- Padrão: Server Components; `"use client"` só para eventos, hooks ou APIs do navegador.
- Empurrar limites de cliente para baixo na árvore; manter shell/layout no servidor.
- Carregar dados com `fetch` em RSCs ou Server Actions; evitar `useEffect` para carga inicial de dados.

### Mutações e formulários

- Preferir Server Actions com `<form action={...}>` (ou `formAction` em botões).
- Validar payloads com Zod na action ou no handler da rota.

### Design (“Clean Architect”)

- UI minimalista: fundos zinc escuro ou preto puro, bordas de 1px, texto alto contraste.
- Sem brilhos neon pesados ou gradientes decorativos, salvo especificação explícita.

### Estrutura

- Rotas/layouts: `src/app/`
- UI de feature: `src/components/`
- Helpers compartilhados: `src/lib/`
- Hooks: `src/hooks/`

### Estado

1. Parâmetros de URL/busca para filtros compartilháveis e estado de navegação.
2. RSC + cache para estado no servidor.
3. `useState` / `useReducer` para estado local de UI.
4. Zustand só quando prop drilling for claramente pior que um store pequeno.

### Acessibilidade

- Landmarks semânticos (`main`, `article`) e papéis corretos onde o Radix não os fornece.
- Teclado e foco para widgets interativos.

## Expectativas de saída

- Alinhar nomenclatura, imports e padrões de componentes à pasta tocada.
- Manter o diff limitado à funcionalidade pedida; evitar refatorações não relacionadas.

## Referência mais profunda

- Qualidade geral: `.cursor/rules/qualidade-codigo.mdc`
- Stack e estética: `.cursor/rules/boas-praticas-frontend.mdc`
