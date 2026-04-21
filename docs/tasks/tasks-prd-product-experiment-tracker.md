# Tasks — Product Experiment Tracker (MVP — corte moderado, v1.0 enxuta)

> PRD de origem: [`docs/prd/prd-product-experiment-tracker.md`](../prd/prd-product-experiment-tracker.md) — seção 0 (corte moderado) é a fonte oficial do recorte.
> Status: **MVP v1.0 enxuto + incremento Kanban (tarefa 4.0) entregue** — Tarefas 1.0–4.0 concluídas; demais evoluções adiadas conforme seção "Adiado para v1.1".
> Recorte aplicado: **MVP enxuto** focado em validar visual + fluxo principal antes de investir em refinamentos.

## Escopo recortado para esta entrega

A entrega cobre apenas o caminho mínimo capaz de validar a métrica primária do PRD (cadastro <30s) e a estética "Clean Architect", mantendo gancho de evolução para as funções diferidas.

**No escopo (v1.0 enxuta):**

- HU-01 — Cadastrar hipótese rapidamente.
- HU-02 — Listar todas as hipóteses.
- HU-05 — Excluir hipótese irrelevante.
- HU-06 — Persistência local (`localStorage`).
- RF-01 (parcial) — Criar hipótese com 3 campos obrigatórios (`nome`, `metricaSucesso`, `status`).
- RF-02 (parcial) — Listar hipóteses ordenadas por `criadoEm` desc, com estado vazio.
- RF-04 — Excluir hipótese com confirmação.
- RF-05 — Persistência local versionada (`pet:hypotheses:v1`) com fallback gracioso.

**Adiado para v1.1 (após validar o MVP com uso real):**

- HU-04 / RF-03 — Editar hipótese existente.
- HU-07 — Registrar aprendizado ao concluir experimento (e, por consequência, todo o campo `aprendizado` do modelo, RF-06 e o indicador visual de aprendizado na lista).
- RF-07 — Validação com Zod e botão "Salvar" desabilitado durante a operação. Substituído por validação trivial (HTML `required` + `trim().length > 0`) no MVP enxuto.
- Formulário em `Dialog` (modal). Substituído por **formulário inline** no topo da tela `/`, eliminando a necessidade de gerenciar foco/Esc/overlay e o componente Shadcn `Dialog`.
- Badge estilizado de status. Substituído por texto simples com cor sutil indicando o status.
- Confirmação de exclusão via `AlertDialog` Shadcn. Substituída por `window.confirm()` nativo, suficiente para o MVP e alinhado à filosofia "sem fricção".

**Justificativa do recorte:**

- A métrica primária do PRD (cadastro <30s) só depende de HU-01 + HU-02. Editar e aprendizado não fazem diferença antes de existir uso real.
- O campo `aprendizado` + RF-06 concentram a maior complexidade do PRD original (renderização condicional, regra de limpeza no update, indicador na lista). Faz sentido construir após o primeiro experimento real ser concluído na ferramenta.
- A camada de storage continua isolada em `src/lib/storage/hypotheses.ts`, então adicionar `updateHypothesis`, `aprendizado` e `Dialog`/`Badge`/`AlertDialog` Shadcn na v1.1 é refactor pontual sem retrabalho.

## Arquivos relevantes

> Atualizada após Tarefa 3.0 (MVP enxuto).

**Bootstrap (Tarefa 1.0 — ✅ entregue)**

- `package.json` / `package-lock.json` — Manifesto npm. Stack: Next 16.2.4, React 19, Tailwind v4, Shadcn (radix-nova/neutral), lucide-react 1.x, Vitest 4 + happy-dom 20 + @testing-library/jest-dom + vite-tsconfig-paths.
- `tsconfig.json` — TypeScript strict, alias `@/*` → `./src/*` (gerado pelo create-next-app, sem ajustes).
- `next.config.ts` / `postcss.config.mjs` / `eslint.config.mjs` / `.gitignore` / `next-env.d.ts` — configurações geradas pelo scaffold; Tailwind v4 via `@tailwindcss/postcss`.
- `components.json` — configuração Shadcn (style `radix-nova`, baseColor `neutral`, alias `@/components`, `@/lib/utils`).
- `vitest.config.ts` — runner com `environment: "happy-dom"`, alias via `vite-tsconfig-paths`, `setupFiles: ["./vitest.setup.ts"]`, `include: ["src/**/*.{test,spec}.{ts,tsx}"]`.
- `vitest.setup.ts` — importa matchers `@testing-library/jest-dom/vitest` e roda `localStorage.clear()` em `beforeEach` global.
- `src/app/layout.tsx` — Server Component raiz com `lang="pt-BR"`, `class="dark"`, `<body className="bg-zinc-950 text-zinc-100 antialiased font-sans flex flex-col">`, fontes Geist Sans/Mono e `metadata` em pt-BR.
- `src/app/globals.css` — `@import "tailwindcss"` + `tw-animate-css` + `shadcn/tailwind.css`; `@custom-variant dark`; tokens Shadcn (`:root` light + `.dark` overrides); `@layer base { body { @apply bg-background text-foreground } }`; preserva `html { background-color: #09090b }` (anti-flash) e `*:focus-visible` (a11y).
- `src/app/page.tsx` — Shell RSC: `main` + cabeçalho pt-BR + `<HypothesisTracker />`.
- `src/components/ui/{button,input,label,select}.tsx` — Primitivos Shadcn; `input` com `forwardRef` para foco no formulário da Tarefa 3.0.
- `src/lib/utils.ts` — Helper `cn(...inputs)` (clsx + tailwind-merge) gerado pelo Shadcn init.
- `README.md` — pt-BR: stack, comandos, decisões v1.0 enxuta, validação manual cronometrada e checklist a11y/responsividade.

**Storage (Tarefa 2.0 — ✅ entregue)**

- `src/lib/storage/types.ts` — Tipos `Hypothesis`, `HypothesisStatus`, `CreateHypothesisInput`. **Sem `aprendizado`** nesta versão; JSDoc em `Hypothesis` aponta v1.1.
- `src/lib/storage/hypotheses.ts` — Funções soltas síncronas (`listHypotheses`, `createHypothesis`, `removeHypothesis`) sobre `localStorage` (chave `pet:hypotheses:v1`); helpers internos `readAll`/`writeAll` com fallback e guard SSR.
- `src/lib/storage/__tests__/hypotheses.test.ts` — Testes unitários do módulo de storage (criar, listar ordenado desc, remover, JSON corrompido).

**UI (Tarefa 3.0 — ✅ entregue)**

- `src/components/hypotheses/hypothesis-tracker.tsx` — Cliente raiz: hidrata lista via `listHypotheses`, `refresh`, exclusão com `window.confirm`, estado vazio textual.
- `src/components/hypotheses/new-hypothesis-form.tsx` — Formulário inline com `Input`/`Select`/`Label`, validação `trim`, foco em `nome`, `createHypothesis`.
- `src/components/hypotheses/hypothesis-list-item.tsx` — Item de lista com `StatusText`, métrica e botão ghost + `Trash2` + `aria-label`.
- `src/components/hypotheses/status-text.tsx` — Cores sutis por `HypothesisStatus` (sem `Badge`).

**Kanban (Tarefa 4.0 — ✅ entregue)**

- `src/lib/storage/types.ts` — `HYPOTHESIS_STATUS_ORDER` para ordem de colunas/formulário.
- `src/lib/storage/hypotheses.ts` — `updateHypothesisStatus` (patch mínimo de `status` + `atualizadoEm`).
- `src/components/hypotheses/hypothesis-kanban.tsx` — Colunas por status, cards com `Select` e exclusão.
- `src/components/hypotheses/hypothesis-tracker.tsx` — Toggle Lista/Kanban e integração com `updateHypothesisStatus`.

### Notas

- Stack alvo: Next.js (App Router) + TypeScript strict + Tailwind v4 + Shadcn (`src/components/ui`) + Lucide + sem Zod nesta entrega.
- Toda UI em pt-BR; código/identificadores em inglês.
- Toda leitura/escrita em `localStorage` deve passar exclusivamente por `src/lib/storage/hypotheses.ts` — nenhum componente acessa `window.localStorage` diretamente.
- Para os testes do módulo de storage, usar Vitest com `happy-dom`. Gerenciador de pacotes: **npm** (regra `working-demo.mdc`); comandos: `npm test` (run único) e `npm run test:watch`.

**Desvios registrados durante a Tarefa 1.0** (não bloqueiam o MVP, mas vale anotar):

- O CLI do Shadcn (v4.3.1) descontinuou `--style new-york` e `--base-color zinc` em favor do preset `radix-nova` + `baseColor: "neutral"`. Visualmente equivalente em dark mode.
- O scaffold do Next.js 16 instala automaticamente `lucide-react` como dependência transitiva via Shadcn (`select.tsx`); a 1.4 apenas validou.
- O bug `--font-sans: var(--font-sans)` introduzido pelo Shadcn em `globals.css` foi corrigido manualmente na 1.4 (apontado para `var(--font-geist-sans)`).
- O `@vitejs/plugin-react` previsto na 1.5 foi adiado para a Tarefa 3.0 (a camada de storage testa funções puras, sem renderizar React).
- O projeto não tem `.git/` próprio; está dentro do repo guarda-chuva em `/Users/adrianno`. Avaliar `git init` separado antes da Tarefa 3.0 (não é pré-requisito).

## Tarefas

### 1.0 Bootstrap mínimo do Next.js (App Router) com Tailwind v4 e primitivos Shadcn essenciais ✅

**Gatilho / ponto de entrada:** Início da implementação do MVP em repositório vazio (só existem `docs/` e `.cursor/`).
**Habilita:** Storage (Tarefa 2.0) e UI (Tarefa 3.0).
**Depende de:** PRD aprovado (`docs/prd/prd-product-experiment-tracker.md`), regras `boas-praticas-frontend.mdc` / `qualidade-codigo.mdc` e o recorte declarado neste arquivo.

**Critérios de aceitação:**

- `pnpm dev` (ou equivalente do gerenciador escolhido) sobe a aplicação em `http://localhost:3000` exibindo a tela inicial sem erros no console.
- `pnpm build` (ou equivalente) conclui sem erros de TypeScript ou lint.
- Tailwind v4 está aplicando o tema dark "Clean Architect" (fundo zinc/preto, texto alto contraste) na tela inicial.
- Estão instalados e funcionais apenas os primitivos Shadcn necessários ao MVP enxuto: `button`, `input`, `select`, `label`. **Não instalar** `dialog`, `alert-dialog`, `textarea` nem `badge` nesta entrega.
- Lucide está instalado e renderiza um ícone de teste em `/` (ex.: ícone "Plus").
- Runner de testes (Vitest + happy-dom) instalado e configurado; `pnpm test` roda e termina sem falhar (com zero testes ou um teste sentinela).

**Subtarefas:**

- [x] 1.1 Inicializar projeto Next.js (App Router) com TypeScript strict, Tailwind v4 e estrutura `src/`
  - **Arquivo**: raiz do repositório (criar `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `.gitignore`, `eslint.config.mjs`).
  - **O quê**: Rodar `pnpm dlx create-next-app@latest .` com flags: TypeScript ✓, ESLint ✓, Tailwind v4 ✓, `src/` ✓, App Router ✓, sem Turbopack opcional, alias `@/*` para `src/*`. Conferir que `tsconfig.json` tem `"strict": true`.
  - **Por quê**: Estabelecer a base canônica do scaffold antes de qualquer feature. Sem isso, nenhuma outra tarefa pode rodar.
  - **Padrão**: Seguir a skill `.cursor/skills/frontend-development/SKILL.md` (App Router, RSC-first, `src/`) e a regra `.cursor/rules/boas-praticas-frontend.mdc` (Tailwind, TS strict).
  - **Verificação**: `pnpm dev` sobe em `http://localhost:3000` mostrando a tela default do Next; `pnpm build` conclui sem erro; `tsc --noEmit` (ou `pnpm build`) não acusa configuração frouxa.

- [x] 1.2 Aplicar tema dark "Clean Architect" no layout raiz e tokens globais
  - **Arquivo**: `src/app/layout.tsx` (alterar) e `src/app/globals.css` (alterar).
  - **O quê**: Definir `<html lang="pt-BR" class="dark">`, `<body>` com `bg-zinc-950 text-zinc-100 antialiased` e fonte sans (Geist ou Inter já trazida pelo scaffold). Em `globals.css`, deixar apenas `@import "tailwindcss";`, ajustar contraste base e adicionar `:focus-visible` com outline visível. Atualizar `metadata` para `title: "Product Experiment Tracker"`, `description` curta em pt-BR.
  - **Por quê**: Garantir desde o primeiro commit a estética alvo do PRD (seção 6) e que toda UI subsequente herde os tokens.
  - **Padrão**: Estética "Clean Architect" descrita em `.cursor/rules/boas-praticas-frontend.mdc` (fundos zinc/preto, bordas sutis, alto contraste, sem neon).
  - **Verificação**: Abrir `/` no navegador e ver fundo escuro + texto claro; inspecionar `<html>` e ver classe `dark` aplicada; rodar `pnpm build` sem erros de Tailwind.

- [x] 1.3 Inicializar Shadcn no projeto e instalar apenas os primitivos do MVP enxuto
  - **Arquivo**: `components.json` (criar), `src/components/ui/button.tsx`, `src/components/ui/input.tsx`, `src/components/ui/label.tsx`, `src/components/ui/select.tsx` (todos criados pelo CLI), `src/lib/utils.ts` (criado pelo CLI).
  - **O quê**: Rodar `pnpm dlx shadcn@latest init` aceitando estilo "new-york", base color "zinc", caminhos `@/components` e `@/lib/utils`. Em seguida, `pnpm dlx shadcn@latest add button input label select`. **Não** adicionar `dialog`, `alert-dialog`, `textarea`, `badge` (estão fora do MVP enxuto — ver "Escopo recortado").
  - **Por quê**: Disponibilizar exatamente os controles que a Tarefa 3.0 vai consumir, sem inflar bundle nem tentar usar componentes diferidos para a v1.1.
  - **Padrão**: Convenção Shadcn padrão (arquivos copiados em `src/components/ui/`); regra `boas-praticas-frontend.mdc` ("Preferir primitivos Shadcn/Radix a HTML cru").
  - **Verificação**: Confirmar que apenas os 4 arquivos esperados existem em `src/components/ui/`; importar `Button` em `src/app/page.tsx`, renderizar e ver que recebe estilos.

- [x] 1.4 Instalar Lucide React e validar com um ícone na tela inicial
  - **Arquivo**: `package.json` (alterar — dependência `lucide-react`); `src/app/page.tsx` (alterar para renderizar ícone de teste).
  - **O quê**: `pnpm add lucide-react`. Importar `Plus` em `src/app/page.tsx` e renderizar um botão sentinela `<Button><Plus className="size-4" /> Nova hipótese</Button>` (será reaproveitado/substituído na Tarefa 3.0).
  - **Por quê**: Validar que o ícone-set padrão do projeto está pronto para uso pelos componentes da Tarefa 3.0.
  - **Padrão**: Lucide React conforme regra `boas-praticas-frontend.mdc`; classe utilitária `size-4` (Tailwind v4) para dimensões consistentes.
  - **Verificação**: Recarregar `/` e ver botão com ícone alinhado, sem warnings no console.

- [x] 1.5 Configurar Vitest + happy-dom para testes da camada de storage
  - **Arquivo**: `package.json` (alterar — script `test`), `vitest.config.ts` (criar), `vitest.setup.ts` (criar).
  - **O quê**: `pnpm add -D vitest @vitejs/plugin-react happy-dom @testing-library/jest-dom`. Em `vitest.config.ts`, configurar `environment: "happy-dom"`, `setupFiles: ["./vitest.setup.ts"]`, alias `@` → `./src` (espelhar `tsconfig`). Em `vitest.setup.ts`, importar `@testing-library/jest-dom/vitest` e adicionar `beforeEach(() => { localStorage.clear(); })` global. Adicionar script `"test": "vitest run"` e `"test:watch": "vitest"`.
  - **Por quê**: Habilitar TDD na Tarefa 2.0 (storage). `localStorage.clear()` no `beforeEach` evita poluição entre testes — happy-dom já fornece a API.
  - **Padrão**: Convenção Vitest padrão; regra do usuário sobre testes (TDD antes de mudanças significativas).
  - **Verificação**: Criar um teste sentinela `src/__tests__/sanity.test.ts` com `expect(typeof localStorage.setItem).toBe("function")` e rodar `pnpm test` — deve passar 1 teste em verde. Remover o sentinela após confirmar.

- [x] 1.6 Criar `README.md` inicial com seção "Como rodar" e link para PRD/tasks
  - **Arquivo**: `README.md` (criar novo).
  - **O quê**: README curto em pt-BR com: nome do projeto + 1 linha do que é, requisitos (Node LTS, pnpm), comandos (`pnpm install`, `pnpm dev`, `pnpm build`, `pnpm test`), links para `docs/prd/prd-product-experiment-tracker.md` e `docs/tasks/tasks-prd-product-experiment-tracker.md`. Incluir aviso "MVP v1.0 enxuta — ver seção 0 do PRD para escopo".
  - **Por quê**: Onboarding rápido para revisores e para o smoke test cronometrado da Tarefa 3.8.
  - **Padrão**: Comentários/docs em inglês, mas como o público-alvo deste README é o autor + revisores brasileiros e a regra do usuário pede comunicação em pt-BR, manter o README em pt-BR (UI também é pt-BR conforme PRD seção 6). A checklist de smoke test será adicionada na Tarefa 3.8.
  - **Verificação**: Abrir `README.md` no preview do editor e conferir que todos os links apontam para arquivos existentes.

---

### 2.0 Camada de storage local (`src/lib/storage/`) com 3 funções soltas síncronas ✅

**Gatilho / ponto de entrada:** Concluído o bootstrap (Tarefa 1.0); a camada de dados é construída antes da UI para permitir TDD.
**Habilita:** Componente cliente raiz da Tarefa 3.0 (criar, listar e excluir hipóteses).
**Depende de:** Tarefa 1.0 (scaffold + TS strict + Vitest configurado).

**Critérios de aceitação:**

- Existem `src/lib/storage/types.ts` (com `Hypothesis`, `HypothesisStatus`, `CreateHypothesisInput`) e `src/lib/storage/hypotheses.ts`.
- O tipo `Hypothesis` **não** inclui `aprendizado` nesta entrega; comentário do tipo indica que o campo será adicionado na v1.1.
- API pública mínima: `listHypotheses(): Hypothesis[]`, `createHypothesis(input: CreateHypothesisInput): Hypothesis`, `removeHypothesis(id: string): void`. **Não implementar** `updateHypothesis` ainda.
- Todas as funções são síncronas, sem classe/interface/singleton; nenhuma leitura/escrita em `localStorage` ocorre fora deste arquivo.
- `id`, `criadoEm` e `atualizadoEm` são gerados dentro das funções (UI nunca os fornece). Mesmo sem `update` no MVP, manter `atualizadoEm` no objeto facilita a v1.1.
- Chave de `localStorage` usada é exatamente `pet:hypotheses:v1`.
- JSON corrompido faz `listHypotheses()` retornar `[]` e logar `console.error`, sem lançar.
- `listHypotheses()` retorna a lista ordenada por `criadoEm` decrescente.
- Suíte de testes (`pnpm test`) passa 100% e cobre: criar (gera id/timestamps e persiste), listar (ordem desc + array vazio inicial), remover (item some do array persistido), JSON corrompido (retorna `[]`).

**Subtarefas:**

- [x] 2.1 Definir tipos do domínio em `types.ts`
  - **Arquivo**: `src/lib/storage/types.ts` (criar novo).
  - **O quê**: Exportar `HypothesisStatus = "Backlog" | "Em andamento" | "Concluído — Validada" | "Concluído — Invalidada"`. Exportar `Hypothesis` com campos `id: string`, `nome: string`, `metricaSucesso: string`, `status: HypothesisStatus`, `criadoEm: string` (ISO 8601), `atualizadoEm: string` (ISO 8601). Exportar `CreateHypothesisInput = Pick<Hypothesis, "nome" | "metricaSucesso" | "status">`. Adicionar comentário JSDoc breve em `Hypothesis` indicando que `aprendizado?: string` será adicionado na v1.1.
  - **Por quê**: Centralizar a fonte da verdade do modelo antes de implementar funções; alinhar com PRD seção 4.1 (visão completa) sem incluir o que está adiado.
  - **Padrão**: Modelo do PRD seção 4.1, recorte da seção 0 do PRD.
  - **Verificação**: `pnpm build` passa; `tsc --noEmit` sem erros; importar `Hypothesis` em um arquivo qualquer compila.
  - **Integração**: Tipos são consumidos por `hypotheses.ts` (Tarefa 2.3–2.5) e pelos componentes cliente (Tarefa 3.x).

- [x] 2.2 Criar helpers privados de leitura/escrita JSON e a constante de chave
  - **Arquivo**: `src/lib/storage/hypotheses.ts` (criar novo).
  - **O quê**: Definir `const STORAGE_KEY = "pet:hypotheses:v1"`. Implementar funções privadas (não exportadas) `readAll(): Hypothesis[]` e `writeAll(items: Hypothesis[]): void`. `readAll` faz `localStorage.getItem(STORAGE_KEY)`, `JSON.parse`, valida que é array, e em qualquer falha (não-array, parse error, `localStorage` indisponível) faz `console.error("[storage] failed to read hypotheses", error)` e retorna `[]`. `writeAll` faz `JSON.stringify` + `localStorage.setItem`. Adicionar guard `typeof window === "undefined"` retornando `[]` no `readAll` para segurança em SSR (mesmo que a UI seja cliente).
  - **Por quê**: Encapsular o tratamento gracioso de erros (RF-05) em um lugar único; manter as funções públicas curtas e legíveis.
  - **Padrão**: Princípios da seção 4.3 do PRD ("Tratamento de erros encapsulado"); regra de qualidade "Encapsulamento" / "Responsabilidade única".
  - **Verificação**: Testes da Tarefa 2.3 vão exercitar esses helpers indiretamente; aqui basta `tsc --noEmit` passar.

- [x] 2.3 TDD: implementar `listHypotheses()` (testes primeiro)
  - **Arquivo**: `src/lib/storage/__tests__/hypotheses.test.ts` (criar novo) e `src/lib/storage/hypotheses.ts` (alterar).
  - **O quê**: No arquivo de teste, escrever **primeiro** três casos: (a) `localStorage` vazio → retorna `[]`; (b) duas hipóteses com `criadoEm` em ordens diferentes persistidas via `writeAll` → retorna ordenado por `criadoEm` desc; (c) `localStorage.setItem(STORAGE_KEY, "{not json")` → retorna `[]` e `console.error` foi chamado (usar `vi.spyOn(console, "error").mockImplementation(() => {})` para silenciar e auditar). Rodar `pnpm test` e confirmar **falha** (vermelho). Em seguida implementar `export function listHypotheses(): Hypothesis[]` que chama `readAll()` e retorna `.sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))`. Rodar `pnpm test` e confirmar **verde**.
  - **Por quê**: Cumprir a regra do usuário (TDD antes de mudanças significativas) e garantir desde já o comportamento de fallback exigido por RF-05.
  - **Padrão**: TDD vermelho-verde-refator; estrutura `__tests__` ao lado do código (já é convenção nas notas deste arquivo).
  - **Verificação**: `pnpm test -- hypotheses` mostra 3 testes em verde; remover o `mock` de console no `afterEach` para não vazar entre testes.
  - **Integração**: Consumido por `HypothesisTracker` na Tarefa 3.2 para hidratar o estado inicial.

- [x] 2.4 TDD: implementar `createHypothesis(input)` (testes primeiro)
  - **Arquivo**: `src/lib/storage/__tests__/hypotheses.test.ts` (alterar) e `src/lib/storage/hypotheses.ts` (alterar).
  - **O quê**: Adicionar testes: (a) `createHypothesis({ nome: "X", metricaSucesso: "Y", status: "Backlog" })` retorna objeto com `id` (string não vazia), `criadoEm` e `atualizadoEm` (strings ISO válidas, iguais entre si na criação), e os campos passados; (b) após criar, `listHypotheses()` contém o item; (c) criar dois itens em sequência produz `id`s distintos. Rodar e ver vermelho. Implementar `export function createHypothesis(input: CreateHypothesisInput): Hypothesis` que: gera `id` via `crypto.randomUUID()`, `now = new Date().toISOString()`, monta `Hypothesis`, faz `writeAll([...readAll(), novo])`, retorna o novo. Rodar e ver verde.
  - **Por quê**: TDD; isolar a geração de id/timestamps no storage conforme PRD seção 4.3 ("Geração de id/timestamps acontece dentro das funções, nunca na UI").
  - **Padrão**: `crypto.randomUUID()` (suportado em browsers modernos e em happy-dom); `new Date().toISOString()` para ISO 8601.
  - **Verificação**: `pnpm test` 100% verde com a nova suíte.
  - **Integração**: Consumido por `NewHypothesisForm` na Tarefa 3.3 ao submeter o formulário.

- [x] 2.5 TDD: implementar `removeHypothesis(id)` (testes primeiro)
  - **Arquivo**: `src/lib/storage/__tests__/hypotheses.test.ts` (alterar) e `src/lib/storage/hypotheses.ts` (alterar).
  - **O quê**: Adicionar testes: (a) criar duas hipóteses, remover a primeira pelo `id` → `listHypotheses()` retorna apenas a segunda; (b) remover `id` inexistente é no-op (não lança, lista permanece igual). Rodar e ver vermelho. Implementar `export function removeHypothesis(id: string): void` que faz `writeAll(readAll().filter(h => h.id !== id))`. Rodar e ver verde.
  - **Por quê**: TDD; cobrir o caminho de exclusão exigido por RF-04.
  - **Padrão**: Operação imutável simples (filter), alinhada à filosofia "Sem cache na camada de storage" (PRD 4.3).
  - **Verificação**: `pnpm test` mostra suíte completa do módulo em verde (≥ 7 casos).
  - **Integração**: Consumido por `HypothesisTracker` na Tarefa 3.5 após confirmação de exclusão.

- [x] 2.6 Validar suíte completa, lint e tipagem
  - **Arquivo**: nenhum arquivo novo; conferência sobre o repositório.
  - **O quê**: Rodar `pnpm test`, `pnpm lint` (se existir, criado pelo `create-next-app`) e `pnpm build`. Garantir que todos passam. Se aparecer warning de TS strict (ex.: `any` implícito), corrigir.
  - **Por quê**: Encerrar a Tarefa 2.0 com sinal verde antes de iniciar a UI.
  - **Padrão**: Regra `qualidade-codigo.mdc` — "Testes" e "Refatorar continuamente".
  - **Verificação**: 3 comandos verdes; `pnpm test` com todos os critérios da Tarefa 2.0 cobertos.

---

### 3.0 Tela `/`: formulário inline (criar) + lista textual + exclusão com `confirm()` + validação final do MVP ✅

**Gatilho / ponto de entrada:** Usuário abre a aplicação em `/`; sub-fluxos disparados ao submeter o formulário inline e ao clicar em "Excluir" em cada item.
**Habilita:** Encerramento do MVP enxuto pronto para validação manual cronometrada e captura da métrica primária do PRD (seção 7).
**Depende de:** Tarefas 1.0 (scaffold + Shadcn `button`/`input`/`select`/`label`) e 2.0 (`listHypotheses`, `createHypothesis`, `removeHypothesis`).

**Critérios de aceitação:**

- Rota `/` (`src/app/page.tsx`) é Server Component; toda lógica de hidratação e mutação fica em um componente cliente raiz (`HypothesisTracker`).
- Formulário **inline** no topo da tela com 3 campos: `nome` (input), `metricaSucesso` (input) e `status` (select Shadcn com `Backlog` pré-selecionado). **Sem modal/Dialog**.
- Foco automático no campo `nome` ao carregar a tela (e ao concluir uma criação, retorna foco para `nome` para encadear cadastros).
- Validação trivial: `required` no HTML + checagem de `trim().length > 0` antes de chamar `createHypothesis`. Mensagem de erro inline curta em pt-BR quando vazio.
- Lista logo abaixo do formulário, ordenada por `criadoEm` desc, exibindo `nome`, `status` (texto simples com cor sutil distinta por valor — sem componente `Badge`) e `metricaSucesso`.
- Quando não houver hipóteses, a lista é substituída por uma frase curta orientando a usar o formulário acima ("Cadastre sua primeira hipótese no formulário acima."). **Sem CTA dedicado** — o próprio formulário cumpre o papel.
- Cada item da lista oferece botão "Excluir" com `aria-label` descritivo; clicar dispara `window.confirm()` em pt-BR e, se confirmado, chama `removeHypothesis` e atualiza a UI imediatamente.
- Layout funciona corretamente a partir de 360px de largura.
- Toda a UI navegável por teclado (Tab/Shift+Tab/Enter), com foco visível e contraste WCAG AA.
- Console limpo (zero erros não tratados) durante o fluxo principal: criar → listar → excluir.
- Smoke test manual cronometrado executado: ao menos 3 medições do fluxo "abrir a página → preencher campos obrigatórios → confirmar criação", todas abaixo de 30s, registradas no `README.md`.
- `README.md` atualizado com: como rodar, decisões principais (storage local, sem auth, sem backend), referência ao recorte deste arquivo e checklist de validação manual.

**Subtarefas:**

- [x] 3.1 Tornar `src/app/page.tsx` um Server Component shell que monta o componente cliente raiz
  - **Arquivo**: `src/app/page.tsx` (alterar — substituindo o conteúdo de teste da Tarefa 1.4).
  - **O quê**: Página Server Component com `<main className="mx-auto max-w-2xl px-4 py-10 space-y-8">` contendo `<header>` (título "Product Experiment Tracker" + subtítulo curto em pt-BR descrevendo o propósito) e `<HypothesisTracker />` importado de `@/components/hypotheses/hypothesis-tracker`. **Sem `"use client"`** neste arquivo.
  - **Por quê**: Manter o shell estático no servidor conforme RSC-first (`boas-praticas-frontend.mdc`); empurrar o limite cliente para baixo na árvore.
  - **Padrão**: Estrutura `src/app/` da skill `frontend-development`; tipografia simples e alto contraste.
  - **Verificação**: `pnpm dev` mostra cabeçalho renderizado; React DevTools confirma que `page.tsx` é RSC e `HypothesisTracker` é client.

- [x] 3.2 Criar `HypothesisTracker` (componente cliente) com hidratação inicial e função de refresh
  - **Arquivo**: `src/components/hypotheses/hypothesis-tracker.tsx` (criar novo).
  - **O quê**: Componente com `"use client"`. Estado `const [items, setItems] = useState<Hypothesis[]>([])`. `useEffect` no mount chama `setItems(listHypotheses())` (evita mismatch SSR/CSR). Expor função local `refresh = () => setItems(listHypotheses())` passada como prop para o form (callback após criar) e usada após excluir. Render: `<NewHypothesisForm onCreated={refresh} />` seguido de `<HypothesisListSection items={items} onDeleted={refresh} />` (pode ser inline no mesmo arquivo se preferir reduzir indireção). Espaçamento Tailwind: `space-y-6`.
  - **Por quê**: Centralizar o ciclo "ler `localStorage` → renderizar → re-ler após mutação" em um único componente cliente, mantendo PRD 4.3 ("Sem cache na camada de storage. A UI cuida de re-renderizar via `useState`").
  - **Padrão**: Hooks padrão React; sem Zustand (estado local trivial — regra `boas-praticas-frontend.mdc` seção "Estado").
  - **Verificação**: Abrir `/`, ver lista (vazia ou populada conforme `localStorage` real do navegador); recarregar e confirmar persistência.

- [x] 3.3 Criar `NewHypothesisForm` inline com 3 campos, validação trivial e foco automático em `nome`
  - **Arquivo**: `src/components/hypotheses/new-hypothesis-form.tsx` (criar novo).
  - **O quê**: Componente com `"use client"`. Props: `onCreated: () => void`. Campos controlados (`useState`) para `nome`, `metricaSucesso` e `status` (default `"Backlog"`). Render `<form>` com `Input` (Shadcn) para `nome` e `metricaSucesso`, `Select` (Shadcn) para `status` listando os 4 valores de `HypothesisStatus`, e `<Button type="submit">` com ícone `Plus` (Lucide). Cada campo dentro de `<div className="space-y-1.5">` com `<Label htmlFor=...>`. `nome` recebe `ref` + `useEffect(() => ref.current?.focus(), [])` para foco automático. Atributo `required` em todos os inputs/select. No `onSubmit`: `event.preventDefault()`, validar `trim().length > 0` para `nome` e `metricaSucesso` (caso vazios mostrar mensagem inline em `<p className="text-sm text-red-400">` e abortar). Chamar `createHypothesis({ nome: nome.trim(), metricaSucesso: metricaSucesso.trim(), status })`, limpar estado dos campos, devolver foco para `nome` e chamar `props.onCreated()`.
  - **Por quê**: Atende RF-01 (parcial) e métrica primária (cadastro <30s). Foco devolvido a `nome` permite encadear cadastros sem mouse.
  - **Padrão**: Primitivos Shadcn em `src/components/ui` (Tarefa 1.3); regra `boas-praticas-frontend.mdc` ("Preferir primitivos Shadcn/Radix"); estado local com `useState` (regra de Estado).
  - **Verificação**: Abrir `/`, ver foco no campo `nome`; submeter vazio e ver bloqueio; preencher e submeter — item aparece na lista; foco volta para `nome`.
  - **Integração**: Consome `createHypothesis` (Tarefa 2.4) e dispara `onCreated` para o `HypothesisTracker` (Tarefa 3.2) atualizar a lista.

- [x] 3.4 Criar `HypothesisListItem` exibindo `nome`, `status` (texto colorido) e `metricaSucesso` + botão Excluir
  - **Arquivo**: `src/components/hypotheses/hypothesis-list-item.tsx` (criar novo) e `src/components/hypotheses/status-text.tsx` (criar novo, util pequeno).
  - **O quê**: `HypothesisListItem` recebe `item: Hypothesis` e `onDelete: (id: string) => void`. Renderiza `<li className="border border-zinc-800 rounded-md p-4 flex items-start justify-between gap-4">` com bloco de texto à esquerda (`<h3>` com `nome`, `<StatusText status={item.status}>` em fonte menor e cor sutil, `<p>` com `metricaSucesso` em `text-zinc-400`) e à direita um `Button` ghost com ícone `Trash2` (Lucide) e `aria-label={`Excluir hipótese ${item.nome}`}` que chama `onDelete(item.id)`. `StatusText` é uma função pura que mapeia `HypothesisStatus` para uma classe de cor sutil (`text-zinc-400`, `text-amber-400`, `text-emerald-400`, `text-rose-400`) — **sem componente `Badge`**.
  - **Por quê**: Atende RF-02 (parcial) sem inflar o bundle com `Badge` (cortado). Botão de exclusão por item viabiliza RF-04.
  - **Padrão**: Lucide para ícone; primitivos Shadcn (`Button`); estética "Clean Architect" (bordas zinc 800, fundos sóbrios).
  - **Verificação**: Renderizar manualmente uma hipótese de cada status no `localStorage` e ver as 4 cores sutis; testar `aria-label` no DevTools de acessibilidade.
  - **Integração**: Consumido pela seção de listagem em `HypothesisTracker` (Tarefa 3.2).

- [x] 3.5 Implementar exclusão com `window.confirm()` em pt-BR no `HypothesisTracker`
  - **Arquivo**: `src/components/hypotheses/hypothesis-tracker.tsx` (alterar).
  - **O quê**: Adicionar `handleDelete = (id: string, nome: string) => { if (window.confirm(`Excluir a hipótese "${nome}"? Essa ação não pode ser desfeita.`)) { removeHypothesis(id); refresh(); } }` e passar para cada `HypothesisListItem` como `onDelete={() => handleDelete(item.id, item.nome)}`.
  - **Por quê**: Atende RF-04 com a alternativa enxuta declarada na seção 0 do PRD (sem `AlertDialog`).
  - **Padrão**: API nativa do navegador; mensagem em pt-BR.
  - **Verificação**: Criar 2 hipóteses; clicar em Excluir na primeira; cancelar — nada muda; clicar de novo e confirmar — item some, recarregar a página e ele continua removido.
  - **Integração**: Consome `removeHypothesis` (Tarefa 2.5).

- [x] 3.6 Renderizar estado vazio textual quando não houver hipóteses
  - **Arquivo**: `src/components/hypotheses/hypothesis-tracker.tsx` (alterar — bloco da listagem).
  - **O quê**: Quando `items.length === 0`, em vez do `<ul>`, renderizar `<p className="text-sm text-zinc-500">Cadastre sua primeira hipótese no formulário acima.</p>`. Quando `items.length > 0`, renderizar `<ul className="space-y-3">` com os itens.
  - **Por quê**: Atende RF-02 sem o CTA dedicado da versão completa do PRD (substituído pelo formulário sempre visível).
  - **Padrão**: Texto sóbrio, baixo destaque, sem ícone — coerente com a estética minimalista.
  - **Verificação**: Limpar `localStorage` e abrir `/` — ver a frase; criar 1 item — frase desaparece e item aparece.

- [x] 3.7 Auditar acessibilidade, responsividade e console limpo
  - **Arquivo**: nenhum arquivo novo; possíveis ajustes em qualquer componente da Tarefa 3.x.
  - **O quê**: Percorrer manualmente o fluxo completo (criar → listar → excluir) usando apenas teclado: Tab navega na ordem visual; Enter submete formulário; foco visível em todos os controles. Redimensionar a janela para 360×640 (DevTools) e conferir que nada quebra ou cria scroll horizontal. Abrir o console e percorrer o fluxo — nenhum erro/warning não tratado. Conferir contraste com extensão (ex.: axe DevTools) — todos os textos e bordas em WCAG AA.
  - **Por quê**: Atender critérios de aceitação de a11y/responsividade do PRD seção 6.
  - **Padrão**: WCAG AA; viewport mínimo 360px; HTML semântico (`main`, `header`, `ul`, `li`, `form`, `label`).
  - **Verificação**: Checklist marcado nas 4 dimensões (teclado, viewport 360px, console, contraste).

- [x] 3.8 Atualizar `README.md` com checklist de validação manual cronometrada (<30s)
  - **Arquivo**: `README.md` (alterar).
  - **O quê**: Adicionar seção "Validação manual do MVP" com (a) descrição do fluxo a cronometrar (do clique inicial até o item aparecer na lista), (b) tabela com 3 medições contendo `Tentativa | Tempo (s) | Observações`, (c) critério de aceite "todas as 3 medições < 30s". Após executar as medições, preencher a tabela com os tempos reais. Adicionar seção "Decisões principais (v1.0 enxuta)" listando: storage local sem backend, sem auth, escopo conforme PRD seção 0, primitivos Shadcn instalados.
  - **Por quê**: Encerrar o MVP com a métrica primária do PRD (seção 7) registrada e auditável.
  - **Padrão**: Tabela Markdown simples; texto em pt-BR.
  - **Verificação**: README contém a tabela preenchida com 3 tempos < 30s; commit final do MVP referencia a evidência.

### 4.0 Incremento — visão Kanban + `updateHypothesisStatus` (✅ entregue)

**Gatilho:** Evolução pós-MVP enxuto; PRD v1.2 (seção 0 — incremento Kanban).

**Critérios de aceitação:**

- `src/lib/storage/hypotheses.ts` expõe `updateHypothesisStatus(id, status)` com testes em `src/lib/storage/__tests__/hypotheses.test.ts` (atualiza persistência, `null` se id inexistente).
- `src/components/hypotheses/hypothesis-tracker.tsx` oferece alternância **Lista | Kanban** (tabs acessíveis).
- `src/components/hypotheses/hypothesis-kanban.tsx` renderiza colunas por status, scroll horizontal em telas estreitas, cards com `Select` de status e exclusão; ordenação por coluna: `criadoEm` desc.
- `src/lib/storage/types.ts` exporta `HYPOTHESIS_STATUS_ORDER` reutilizado pelo formulário e pelo Kanban.

**Arquivos:** ver PRD e lista em [`docs/prd/prd-product-experiment-tracker.md`](../prd/prd-product-experiment-tracker.md) (incremento 2026-04-20).

## Próximo passo

MVP enxuto (Tarefas 1.0–3.0) e incremento Kanban (4.0) concluídos. Próximas melhorias: itens adiados para **v1.1** (edição completa, aprendizado, Zod, componentes Shadcn adicionais) conforme PRD seção 0 e tabela "Adiado" acima.
