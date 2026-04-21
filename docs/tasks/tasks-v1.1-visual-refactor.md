# Tasks — v1.1 Refactor visual + Kanban tela cheia (pós-deploy)

> PRD de origem: [`docs/prd/prd-product-experiment-tracker.md`](../prd/prd-product-experiment-tracker.md) — seção 0, subseção "Incremento v1.1" (RV-01 a RV-06).
> Status: **Subtarefas detalhadas geradas — pronto para implementação.**
> Contexto: incremento exclusivamente visual, sem novas funcionalidades. Executado **após o primeiro deploy** em produção (Vercel + Supabase).

## Arquivos relevantes

> Atualizada com base na análise do código existente.

**CSS e Layout global**

- `src/app/globals.css` — Tokens dark mode RV-05 (Shadcn: `--background` zinc-950, `--card`/`--popover` zinc-900, bordas/input preservados) e custom properties `--glow-lime*`, `--glow-rose*` com `@utility shadow-glow-*` (Tailwind v4). Contém `:root`, `.dark` overrides, `@layer base`, focus ring global e `html` anti-flash.
- `src/app/page.tsx` — Shell RSC: `<main className="min-h-screen py-6">` sem `max-w`; título e subtítulo vivem na toolbar em `hypothesis-tracker.tsx`.
- `src/app/layout.tsx` — Layout raiz com `<html lang="pt-BR" class="dark">`, fontes Geist, `<body>` com classes base. Sem alterações previstas.

**Componentes de hipóteses**

- `src/components/hypotheses/hypothesis-tracker.tsx` — Toolbar: tab ativo com `shadow-glow-lime`, container do tablist `border-zinc-700`, botão "Nova hipótese" com glow quando formulário aberto; banner → formulário colapsável → conteúdo por `viewMode`.
- `src/components/hypotheses/hypothesis-kanban.tsx` — Kanban: colunas responsivas, cabeçalhos `COLUMN_HEADING_CLASS`, cards com hover de borda; excluir com `hover:shadow-glow-rose`.
- `src/components/hypotheses/new-hypothesis-form.tsx` — Formulário inline: submit "Adicionar hipótese" com `shadow-glow-lime` / `hover:shadow-glow-lime-hover` (tokens `globals.css`).
- `src/components/hypotheses/hypothesis-list-item.tsx` — Item de lista: `li` com `bg-zinc-900/60` e `hover:border-zinc-700` (alinhado ao Kanban); excluir com `hover:shadow-glow-rose`.
- `src/components/hypotheses/status-text.tsx` — Mapeamento status → classe de cor: `STATUS_CLASS` record. Usado na lista; será reutilizado para cabeçalhos do Kanban.
- `src/components/hypotheses/import-local-banner.tsx` — Banner condicional para importação de dados legados do `localStorage`. Sem alterações de lógica, mas precisa de wrapper com padding no novo layout.

### Notas

- Stack: Next.js App Router, TypeScript strict, Tailwind v4, Shadcn (button, input, label, select), Lucide.
- Gerenciador de pacotes: **npm** (`npm run dev`, `npm run build`, `npm test`).
- Nenhuma dependência nova é esperada neste incremento.
- Nenhuma alteração no módulo de storage (`src/lib/storage/`) nem na camada Supabase.
- Testes existentes (`npm test`) devem continuar passando sem alteração — este incremento é puramente visual.
- O botão "Adicionar hipótese" em `new-hypothesis-form.tsx` já usa o estilo neon lime — essa é a referência para o padrão.
- **Tailwind v4:** utilitários customizados devem usar a diretiva `@utility nome { ... }` (não `@layer utilities { .nome { ... } }`) para que variantes como `hover:`, `focus:` e `active:` funcionem automaticamente.
- **Dois botões distintos com glow lime:** (1) botão **"Nova hipótese"** na toolbar — toggle que abre/fecha o formulário; (2) botão **"Adicionar hipótese"** dentro do formulário — submit que cria a hipótese. Ambos usam glow lime mas têm papéis diferentes.

## Tarefas

### 1.0 Tokens dark mode e utilitários CSS de glow neon (RV-05 + RV-04 parcial) ✅

**Gatilho:** Início do incremento v1.1; fundação para todas as demais tarefas visuais.
**Habilita:** Tarefas 2.0–5.0 (todas consomem os tokens e utilitários definidos aqui).
**Depende de:** v1.0 entregue e deployed; `globals.css` existente com tokens Shadcn.

**Critérios de aceitação:**

- Tokens dark mode em `.dark {}` de `globals.css` estão padronizados conforme RV-05 (background `zinc-950`, superfícies `zinc-900`, bordas `zinc-800`/`zinc-700`, texto `zinc-100`/`zinc-400`/`zinc-500`).
- Custom properties de glow estão definidas (`--glow-lime`, `--glow-rose`) e utilitários registrados com `@utility` (não `@layer utilities`) para suporte a variantes Tailwind (`hover:`, `focus:`, etc.).
- Focus ring acessível (`outline: 2px solid #a1a1aa`) mantido sem regressão.
- `npm run build` passa; nenhum componente existente quebra visualmente.

**Subtarefas:**

- [x] 1.1 Padronizar tokens dark mode no bloco `.dark {}` de `globals.css`
  - **Arquivo**: `src/app/globals.css` (alterar existente)
  - **O quê**: Revisar o bloco `.dark { ... }` (linhas 98–130) e ajustar os tokens para garantir consistência com a paleta RV-05: `--card` para oklch equivalente a `zinc-900` (não `zinc-800/0.205`), `--popover` idem, `--border` para `oklch(1 0 0 / 10%)` (já está), `--input` para `oklch(1 0 0 / 15%)` (já está). Verificar que `--background` mapeia para `zinc-950` e `--foreground` para `zinc-100`. Ajustar valores divergentes.
  - **Por quê**: Os tokens Shadcn no `.dark` foram gerados pelo CLI e podem não refletir exatamente a paleta desejada (ex.: `--card: oklch(0.205 0 0)` é mais próximo de `zinc-900` mas ligeiramente diferente). Padronizar agora evita inconsistências visuais nos componentes Shadcn.
  - **Padrão**: Referência de cores Tailwind v4: `zinc-950` = `oklch(0.145 0 0)` ≈ `#09090b`, `zinc-900` = `oklch(0.21 0 0)` ≈ `#18181b`, `zinc-800` = `oklch(0.274 0 0)` ≈ `#27272a`.
  - **Verificação**: `npm run build` passa; abrir `/` no navegador e inspecionar que backgrounds, bordas e textos estão coerentes com a paleta zinc. Nenhum componente existente aparece "quebrado" visualmente.

- [x] 1.2 Definir custom properties e utilitários CSS para glow neon
  - **Arquivo**: `src/app/globals.css` (alterar existente)
  - **O quê**: Adicionar custom properties para os valores de glow ao `:root` existente (linhas 51–85):
    ```css
    :root {
      /* ... tokens Shadcn existentes ... */
      --glow-lime: 0 0 18px -2px rgba(163, 230, 53, 0.65);
      --glow-lime-hover: 0 0 24px -2px rgba(163, 230, 53, 0.9);
      --glow-rose: 0 0 12px -3px rgba(244, 63, 94, 0.4);
      --glow-rose-hover: 0 0 18px -3px rgba(244, 63, 94, 0.6);
    }
    ```
    Registrar utilitários usando a diretiva `@utility` do **Tailwind v4** (não `@layer utilities`), para que variantes como `hover:`, `focus:` e `active:` funcionem automaticamente:
    ```css
    @utility shadow-glow-lime {
      box-shadow: var(--glow-lime);
    }
    @utility shadow-glow-lime-hover {
      box-shadow: var(--glow-lime-hover);
    }
    @utility shadow-glow-rose {
      box-shadow: var(--glow-rose);
    }
    @utility shadow-glow-rose-hover {
      box-shadow: var(--glow-rose-hover);
    }
    ```
    **⚠️ Não usar `@layer utilities { .shadow-glow-lime { ... } }`** — no Tailwind v4, classes em `@layer utilities` não participam do sistema de variantes. Apenas `@utility` registra a classe corretamente.
  - **Por quê**: Centralizar os valores de glow em variáveis CSS evita duplicação dos valores `shadow-[...]` inline em cada componente (como o botão "Adicionar hipótese" em `new-hypothesis-form.tsx` linha 167) e facilita ajuste global de intensidade. Usar `@utility` garante que `hover:shadow-glow-rose` funcione nas Tarefas 3.4 e 5.2.
  - **Padrão**: Valores baseados no glow existente do botão "Adicionar hipótese" (`shadow-[0_0_18px_-2px_rgba(163,230,53,0.65)]`). Rose derivado de `text-rose-400` (`#f43f5e`).
  - **Verificação**: `npm run build` passa. Teste rápido: adicionar temporariamente `hover:shadow-glow-lime` a qualquer elemento e confirmar que o glow aparece no hover (valida que `@utility` registrou corretamente).
  - **Integração**: Consumido pela Tarefa 3.4 (botão submit do form), Tarefa 3.1 (botão toggle toolbar), Tarefa 5.1 (toggle ativo), Tarefa 5.2 (botões excluir).

- [x] 1.3 Verificar integridade: build + visual spot-check
  - **Arquivo**: nenhum arquivo novo; conferência sobre o repositório.
  - **O quê**: Rodar `npm run build` e `npm test`. Abrir `http://localhost:3000` com `npm run dev` e verificar visualmente que a UI existente (lista, kanban, formulário, banner de importação) não sofreu regressão. Inspecionar no DevTools que os tokens `.dark` estão aplicados corretamente.
  - **Por quê**: Garantir que ajustes em tokens e novos utilitários não quebraram nada antes de avançar.
  - **Padrão**: Regra `qualidade-codigo.mdc` — build verde antes de prosseguir.
  - **Verificação**: `npm run build` e `npm test` passam sem erros; UI visual inalterada.

---

### 2.0 Toolbar unificada no topo com layout responsivo (RV-02 + RV-01 parcial) ✅

**Gatilho:** Tokens definidos (Tarefa 1.0); reestruturação do layout principal.
**Habilita:** Tarefa 3.0 (formulário colapsável depende do slot na toolbar) e Tarefa 4.0 (Kanban full-width depende do layout condicional).
**Depende de:** Tarefa 1.0 (tokens/utilitários); `page.tsx` e `hypothesis-tracker.tsx` existentes.

**Critérios de aceitação:**

- O cabeçalho (título + subtítulo) e os controles (toggle Lista/Kanban) estão organizados em uma barra horizontal: título à esquerda, controles à direita.
- Em telas <640px, a toolbar quebra em duas linhas sem perda de funcionalidade.
- O layout de `<main>` em `page.tsx` não tem `max-w-2xl` fixo; a decisão de largura fica em `hypothesis-tracker.tsx` via `viewMode`.
- Texto do subtítulo atualizado (remover referência a "dados ficam no navegador").
- Toggle Lista/Kanban mantém funcionalidade e acessibilidade (`role="tablist"`, `aria-selected`).
- `aria-labelledby` da `<section>` atualizado para apontar ao novo `<h1>`.
- `ImportLocalBanner` envolvido em wrapper com padding consistente com a toolbar.
- Texto do estado vazio atualizado para refletir o formulário colapsável.

**Subtarefas:**

- [x] 2.1 Simplificar `page.tsx` — remover header e restrição de largura
  - **Arquivo**: `src/app/page.tsx` (alterar existente)
  - **O quê**: Remover o `<header>` com título/subtítulo (linhas 6–14) — essa responsabilidade vai para a toolbar em `hypothesis-tracker.tsx`. Simplificar o `<main>` para apenas: `<main className="min-h-screen py-6"><HypothesisTracker /></main>`. Remover `mx-auto max-w-2xl space-y-8 px-4` do `<main>` — a decisão de largura e padding agora fica dentro de `HypothesisTracker` (Tarefa 2.3), que tem acesso ao estado `viewMode`.
  - **Por quê**: O layout condicional (RV-01) exige que o Kanban ocupe toda a viewport. Como `viewMode` é estado do componente cliente, a decisão de largura deve ficar dentro de `HypothesisTracker`, não no Server Component pai.
  - **Padrão**: RSC-first conforme skill `frontend-development` — manter `page.tsx` como Server Component fino.
  - **Verificação**: `npm run build` passa; `/` renderiza sem `<header>` duplicado; `<main>` não tem `max-w-2xl` fixo.
  - **Integração**: O `HypothesisTracker` (Tarefa 2.2) assume o título e o padding internamente.

- [x] 2.2 Criar toolbar unificada em `hypothesis-tracker.tsx` com estrutura-alvo completa
  - **Arquivo**: `src/components/hypotheses/hypothesis-tracker.tsx` (alterar existente)
  - **O quê**: Reorganizar o bloco de render (linhas 105–189). **Estrutura-alvo final** (inclui slots para Tarefas 3.x e 5.x — implementar o esqueleto agora, preencher detalhes depois):
    ```
    <section className="space-y-4" aria-labelledby="tracker-heading">

      {/* Banner de importação — com padding próprio */}
      <div className="px-4 md:px-8">
        <ImportLocalBanner />
      </div>

      {/* Toolbar — sempre full-width */}
      <header className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between md:px-8">
        <div>
          <h1 id="tracker-heading" className="text-xl font-semibold tracking-tight text-zinc-100">
            Product Experiment Tracker
          </h1>
          <p className="text-xs text-zinc-500">
            Cadastre e acompanhe hipóteses de experimento.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Toggle Lista/Kanban (mover o tablist existente para cá) */}
          <div className="flex rounded-lg border border-zinc-800 p-0.5" role="tablist" aria-label="Modo de visualização">
            <button ...>Lista</button>
            <button ...>Kanban</button>
          </div>
          {/* Slot para botão "Nova hipótese" — preenchido na Tarefa 3.1 */}
        </div>
      </header>

      {/* Slot para formulário colapsável — preenchido na Tarefa 3.2 */}

      {/* Conteúdo com layout condicional — Tarefa 2.3 */}
      <div className={viewMode === "list" ? "mx-auto max-w-2xl px-4" : "px-4 md:px-8"}>
        {isLoading ? ... : hasError ? ... : items.length === 0 ? ... : viewMode === "list" ? <ul>...</ul> : <HypothesisKanban ... />}
      </div>
    </section>
    ```
    **Mudanças específicas:**
    - Substituir `aria-labelledby="hypotheses-heading"` por `aria-labelledby="tracker-heading"` e dar `id="tracker-heading"` ao novo `<h1>`.
    - Remover o `<h2 id="hypotheses-heading">Suas hipóteses</h2>` (agora o `<h1>` cumpre esse papel).
    - Envolver `<ImportLocalBanner />` em `<div className="px-4 md:px-8">` para que não encoste nas bordas da viewport.
    - Mover os botões de toggle (role="tablist") que já existem (linhas 117–148) para o `<div>` da direita da toolbar.
    - Subtítulo atualizado: "Cadastre e acompanhe hipóteses de experimento." — sem referência a "dados ficam no navegador" (agora usa Supabase).
    - `<h1>` com `text-xl` (menor que o anterior `text-2xl` para caber na toolbar).
    - Atualizar texto do estado vazio de `"Cadastre sua primeira hipótese no formulário acima."` para `"Nenhuma hipótese cadastrada. Use o botão \"Nova hipótese\" acima para começar."` — reflete o formulário colapsável.
  - **Por quê**: RV-02 exige controles organizados horizontalmente no topo. Esta subtarefa define a **estrutura completa** de uma vez para evitar retrabalho nas Tarefas 3.x e 5.x, que apenas preenchem os slots marcados.
  - **Padrão**: Padrão de toolbar flexbox com `sm:flex-row sm:justify-between`.
  - **Verificação**: Abrir `/`; título e toggle visíveis na mesma linha em telas ≥640px; em 360px, quebra em duas linhas; toggle Lista/Kanban funciona como antes; banner de importação (se visível) tem margens alinhadas com a toolbar.

- [x] 2.3 Aplicar layout condicional (contido vs. full-width) baseado em `viewMode`
  - **Arquivo**: `src/components/hypotheses/hypothesis-tracker.tsx` (alterar existente — já feito como parte da estrutura na 2.2)
  - **O quê**: Verificar que o wrapper do conteúdo principal usa classe condicional conforme definido na estrutura da 2.2: `className={viewMode === "list" ? "mx-auto max-w-2xl px-4" : "px-4 md:px-8"}`. A toolbar fica **fora** desse wrapper (sempre full-width com `px-4 md:px-8`). **Nota de design:** no modo Lista, o conteúdo é centralizado com `max-w-2xl` (672px), enquanto a toolbar ocupa 100% da largura. Esta desconexão visual é **intencional** e segue o pattern de GitHub/Linear (toolbar full-width, conteúdo contido); não tentar "corrigir" alinhando as bordas.
  - **Por quê**: RV-01 exige que o Kanban ocupe a largura total; o modo Lista mantém `max-w-2xl` para legibilidade. A toolbar deve ser full-width em ambos os modos.
  - **Padrão**: Layout condicional via ternário em `className`.
  - **Verificação**: No modo Lista, o conteúdo tem largura máxima de 672px e fica centralizado. No modo Kanban, o conteúdo se expande para 100% da viewport. Alternar entre os modos muda o layout instantaneamente.

- [x] 2.4 Verificar responsividade e acessibilidade da toolbar
  - **Arquivo**: nenhum arquivo novo; conferência visual e funcional.
  - **O quê**: Testar a toolbar em 360px, 640px, 768px, 1024px e 1920px usando DevTools de redimensionamento. Verificar: (a) Tab navega pelos controles na ordem visual; (b) `role="tablist"` e `aria-selected` mantidos nos toggles; (c) `aria-labelledby="tracker-heading"` na `<section>` aponta para o `<h1 id="tracker-heading">`; (d) foco visível em todos os controles; (e) `ImportLocalBanner` tem padding alinhado com a toolbar.
  - **Por quê**: Critério de aceitação 8 do PRD v1.1 — responsividade de 360px a 1920px.
  - **Padrão**: WCAG AA; HTML semântico (`header`, `section`).
  - **Verificação**: Checklist manual em 5 breakpoints; teclado navega todos os controles; `npm run build` passa.

---

### 3.0 Formulário de criação colapsável (RV-03) ✅

**Gatilho:** Slot na toolbar (Tarefa 2.2) pronto para receber o botão de toggle.
**Habilita:** Libera espaço vertical para o Kanban/Lista quando fechado.
**Depende de:** Tarefa 2.0 (toolbar com slot para botão e slot para formulário).

**Critérios de aceitação:**

- O formulário inicia **fechado** por padrão.
- Clicar no botão "Nova hipótese" na toolbar abre o formulário com transição suave.
- Clicar novamente no botão ou pressionar `Esc` fecha o formulário.
- Ao submeter com sucesso, o formulário permanece aberto e o foco retorna ao campo `nome`.
- Foco automático no campo `nome` ao abrir o formulário.
- Acessibilidade por teclado mantida (Tab, Enter, Esc).
- **Dois botões distintos:** "Nova hipótese" (toolbar toggle, abre/fecha) e "Adicionar hipótese" (submit dentro do form, cria hipótese). Ambos com glow lime.

**Subtarefas:**

- [x] 3.1 Adicionar estado `isFormOpen` e botão "Nova hipótese" na toolbar
  - **Arquivo**: `src/components/hypotheses/hypothesis-tracker.tsx` (alterar existente)
  - **O quê**: Adicionar `const [isFormOpen, setIsFormOpen] = useState(false);` ao componente. No slot da toolbar (marcado na Tarefa 2.2, `<div className="flex items-center gap-2">`, após o toggle de visualização), adicionar:
    ```tsx
    <Button
      type="button"
      onClick={() => setIsFormOpen(prev => !prev)}
      className={cn(
        "bg-lime-400 text-zinc-950 hover:bg-lime-300 focus-visible:ring-lime-400/60",
        isFormOpen ? "shadow-glow-lime" : ""
      )}
    >
      <Plus className="size-4" />
      Nova hipótese
    </Button>
    ```
    Importar `Plus` de `lucide-react`, `Button` de `@/components/ui/button` e `cn` de `@/lib/utils` (se ainda não importados). Quando `isFormOpen` é `true`, o botão tem glow ativo; quando `false`, sem glow (mas mantém cor lime).
  - **Por quê**: RV-03 exige que o formulário seja acionado por botão na toolbar. O botão **"Nova hipótese"** é distinto do botão **"Adicionar hipótese"** (submit) — um abre/fecha o form, o outro cria a hipótese.
  - **Padrão**: Utilitário `shadow-glow-lime` (Tarefa 1.2); `cn()` para classe condicional.
  - **Verificação**: Botão visível na toolbar ao lado do toggle; clicar alterna `isFormOpen`; glow aparece/desaparece.

- [x] 3.2 Renderizar `NewHypothesisForm` condicionalmente e adicionar listener de `Esc`
  - **Arquivo**: `src/components/hypotheses/hypothesis-tracker.tsx` (alterar existente)
  - **O quê**: No slot de formulário (marcado na Tarefa 2.2, entre `</header>` e o wrapper de conteúdo), adicionar render condicional:
    ```tsx
    {isFormOpen ? (
      <div className="px-4 md:px-8">
        <NewHypothesisForm onCreated={handleCreated} />
      </div>
    ) : null}
    ```
    Remover o `<NewHypothesisForm>` que antes era renderizado incondicionalmente. Adicionar `useEffect` com listener de `Escape`:
    ```tsx
    useEffect(() => {
      if (!isFormOpen) return;
      function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") setIsFormOpen(false);
      }
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isFormOpen]);
    ```
  - **Por quê**: RV-03 — formulário colapsável; Esc fecha para fluxo rápido de teclado. O formulário é **montado/desmontado** (não oculto via CSS), então o `useEffect` de foco do `NewHypothesisForm` já funciona corretamente (foca ao montar = ao abrir).
  - **Padrão**: Pattern de listener de `keydown` em `useEffect` com cleanup.
  - **Verificação**: Formulário só aparece quando `isFormOpen=true`; Esc fecha; re-abrir foca no campo `nome`.

- [x] 3.3 Validar foco automático e persistência do formulário após submit
  - **Arquivo**: `src/components/hypotheses/new-hypothesis-form.tsx` (verificar — possivelmente sem alteração)
  - **O quê**: Com o formulário agora montado/desmontado via `isFormOpen`, o `useEffect` existente (linhas 44–46: `nomeInputRef.current?.focus()` no mount) já garante foco ao abrir. Verificar que após submit com sucesso (linha 72: `nomeInputRef.current?.focus()`), o foco retorna ao campo `nome` e o formulário **permanece aberto** — nenhuma chamada a `setIsFormOpen(false)` deve existir no handler de `onCreated`. **Nenhuma alteração deve ser necessária** neste arquivo para esta subtarefa; apenas validação funcional.
  - **Por quê**: RV-03 critério — foco automático no campo `nome` ao abrir; formulário persiste aberto após submit para encadear cadastros.
  - **Padrão**: Comportamento existente; validar que não regrediu com o render condicional.
  - **Verificação**: Abrir o formulário via botão → cursor está no campo `nome`; submeter com sucesso → cursor volta ao `nome`; formulário continua aberto.

- [x] 3.4 Migrar botão submit do form para utilitários CSS centralizados
  - **Arquivo**: `src/components/hypotheses/new-hypothesis-form.tsx` (alterar existente)
  - **O quê**: Substituir a className inline do botão submit (linha 167):
    **Antes:** `className="bg-lime-400 text-zinc-950 shadow-[0_0_18px_-2px_rgba(163,230,53,0.65)] hover:bg-lime-300 hover:shadow-[0_0_24px_-2px_rgba(163,230,53,0.9)] focus-visible:ring-lime-400/60 disabled:opacity-50"`
    **Depois:** `className="bg-lime-400 text-zinc-950 shadow-glow-lime hover:bg-lime-300 hover:shadow-glow-lime-hover focus-visible:ring-lime-400/60 disabled:opacity-50"`
    Usa os utilitários `@utility` definidos na Tarefa 1.2. **Este é o botão "Adicionar hipótese"** (submit do form), distinto do botão "Nova hipótese" (toggle na toolbar, Tarefa 3.1).
  - **Por quê**: Eliminar duplicação do valor de glow inline; centralizar em variáveis CSS facilita ajuste global.
  - **Padrão**: Utilitários `shadow-glow-lime` / `shadow-glow-lime-hover` (Tarefa 1.2).
  - **Verificação**: Botão "Adicionar hipótese" visualmente idêntico ao anterior (glow lime no default, glow intensificado no hover); `npm run build` passa.

- [x] 3.5 Verificar fluxo completo: abrir → criar → formulário persiste → fechar via Esc
  - **Arquivo**: nenhum arquivo novo; conferência funcional.
  - **O quê**: Executar manualmente: (1) Carregar `/` → formulário fechado, botão "Nova hipótese" sem glow. (2) Clicar "Nova hipótese" → formulário abre com foco no campo `nome`, botão com glow. (3) Preencher e submeter → item aparece na lista/kanban; formulário permanece aberto; foco volta ao `nome`. (4) Pressionar Esc → formulário fecha, botão perde glow. (5) Repetir no modo Kanban. (6) Console limpo.
  - **Por quê**: Validar critérios de aceitação da Tarefa 3.0 end-to-end.
  - **Padrão**: Fluxo descrito nos critérios de aceitação do PRD v1.1.
  - **Verificação**: Todos os 7 critérios de aceitação da Tarefa 3.0 satisfeitos; `npm run build` passa.

---

### 4.0 Kanban tela cheia com cabeçalhos coloridos e hover nos cards (RV-01 + RV-06 + RV-04 parcial) ✅

**Gatilho:** Usuário ativa o modo Kanban no toggle da toolbar.
**Habilita:** Visão panorâmica completa do pipeline de experimentos.
**Depende de:** Tarefa 1.0 (tokens/glow), Tarefa 2.0 (layout full-width condicional).

**Critérios de aceitação:**

- As 4 colunas do Kanban ocupam a largura total da viewport proporcionalmente em telas ≥1024px.
- Em telas <1024px, as colunas mantêm largura fixa com scroll horizontal (preservando legibilidade dos cards com Select).
- Cabeçalhos de coluna usam a cor correspondente ao status (`zinc-400` Backlog, `amber-400` Em andamento, `emerald-400` Validada, `rose-400` Invalidada).
- Cards têm fundo `zinc-900/60`, borda `zinc-800` padrão e transição para `zinc-700` no hover.
- Funcionalidade de alterar status (Select) e excluir nos cards permanece intacta.

**Subtarefas:**

- [x] 4.1 Tornar colunas flexíveis (fill) em telas ≥1024px
  - **Arquivo**: `src/components/hypotheses/hypothesis-kanban.tsx` (alterar existente)
  - **O quê**: Alterar a classe da `<section>` de cada coluna (linha 104: `className="flex w-[min(100%,280px)] shrink-0 flex-col gap-3"`) para: `className="flex min-w-[260px] shrink-0 flex-col gap-3 lg:flex-1 lg:min-w-0"`. Alterar o wrapper externo (linha 95: `className="flex min-h-[12rem] min-w-min gap-4"`) para: `className="flex min-h-[12rem] gap-4 lg:gap-6"`. Manter o container de scroll (linha 94) para telas menores, desabilitando-o em lg+: `className="-mx-1 overflow-x-auto px-1 pb-1 lg:overflow-x-visible lg:mx-0 lg:px-0"`.
    **⚠️ Usar breakpoint `lg` (1024px), não `md` (768px).** Em 768px, com `px-4 md:px-8` de padding (64px total) e 4 colunas + 3 gaps de 24px (72px), cada coluna teria apenas ~158px — insuficiente para o `SelectTrigger` (dropdown de status) dentro dos cards. Em 1024px: (1024 - 64 - 72) / 4 = 222px por coluna, suficiente.
  - **Por quê**: RV-01 — as colunas devem preencher a viewport em telas largas. O breakpoint `lg` evita cards espremidos em tablets.
  - **Padrão**: Pattern `flex-1 lg:min-w-0` do Tailwind para colunas equidistantes.
  - **Verificação**: Em 1920px, as 4 colunas dividem o espaço igualmente. Em 768px, colunas com 260px mínimo e scroll horizontal. Em 1024px, transição suave para flex. Sem quebra de layout.

- [x] 4.2 Aplicar cores de status nos cabeçalhos de coluna
  - **Arquivo**: `src/components/hypotheses/hypothesis-kanban.tsx` (alterar existente)
  - **O quê**: Criar constante local `COLUMN_HEADING_CLASS` com o mesmo mapeamento de `STATUS_CLASS` em `status-text.tsx`: `const COLUMN_HEADING_CLASS: Record<HypothesisStatus, string> = { Backlog: "text-zinc-400", "Em andamento": "text-amber-400", "Concluído — Validada": "text-emerald-400", "Concluído — Invalidada": "text-rose-400" };`. Importar `cn` de `@/lib/utils`. Aplicar no `<h3>` do cabeçalho da coluna (linha 110: `className="text-xs font-semibold text-zinc-300"`) substituindo `text-zinc-300` pela classe dinâmica: `className={cn("text-xs font-semibold", COLUMN_HEADING_CLASS[status])}`.
    **Por que duplicar em vez de importar de `status-text.tsx`**: `STATUS_CLASS` não é exportado; exportá-lo criaria acoplamento de implementação. A constante local é 4 linhas e mantém o componente auto-contido.
  - **Por quê**: RV-06 — cabeçalhos coloridos reforçam a associação visual status ↔ coluna.
  - **Padrão**: Mesma paleta de cores usada em `status-text.tsx`.
  - **Verificação**: Cada coluna tem título na cor correspondente ao status; contraste WCAG AA mantido.

- [x] 4.3 Aplicar hover sutil nos cards do Kanban
  - **Arquivo**: `src/components/hypotheses/hypothesis-kanban.tsx` (alterar existente)
  - **O quê**: Alterar a classe do `<li>` em `HypothesisKanbanCard` (linha 43: `className="rounded-md border border-zinc-800 bg-zinc-950/50 p-3 shadow-sm"`) para: `className="rounded-md border border-zinc-800 bg-zinc-900/60 p-3 shadow-sm transition-colors duration-150 hover:border-zinc-700"`. Mudanças: (1) fundo de `bg-zinc-950/50` para `bg-zinc-900/60` (leve diferenciação do background principal); (2) adicionado `transition-colors duration-150 hover:border-zinc-700` para hover sutil.
  - **Por quê**: RV-04 (cards do Kanban) — diferenciação visual de superfície elevada e feedback de hover.
  - **Padrão**: Transição `transition-colors duration-150` — curta e sóbria.
  - **Verificação**: Cards têm fundo visivelmente diferente do background `zinc-950`; hover na borda é sutil e suave.

- [x] 4.4 Verificar Kanban em múltiplas viewports e funcionalidade intacta
  - **Arquivo**: nenhum arquivo novo; conferência funcional.
  - **O quê**: (1) Testar em 360px: colunas com scroll horizontal, cards legíveis. (2) Testar em 768px: colunas ainda com scroll horizontal (abaixo de `lg`). (3) Testar em 1024px: colunas começam a preencher sem scroll. (4) Testar em 1920px: 4 colunas dividem espaço igualmente. (5) Alterar status via Select em um card — persiste. (6) Excluir card — remove com confirmação. (7) Console limpo. (8) Cabeçalhos com cores corretas.
  - **Por quê**: Validar critérios de aceitação da Tarefa 4.0 end-to-end, garantir zero regressão funcional.
  - **Padrão**: Critérios de aceitação do PRD v1.1 itens 1, 5, 6.
  - **Verificação**: Todos os 5 critérios de aceitação da Tarefa 4.0 satisfeitos; `npm run build` passa.

---

### 5.0 Estilo neon padronizado nos controles interativos + validação final (RV-04 aplicação) ✅

**Gatilho:** Tarefas 1.0–4.0 concluídas; polish final e validação cruzada.
**Habilita:** Conclusão do incremento v1.1; pronto para deploy.
**Depende de:** Todas as tarefas anteriores (1.0–4.0); utilitários `@utility shadow-glow-*` (Tarefa 1.2).

**Critérios de aceitação:**

- Botão "Adicionar hipótese" (submit) mantém glow lime (migrado na 3.4).
- Botão "Nova hipótese" (toolbar toggle) tem glow lime quando ativo (feito na 3.1).
- Toggle ativo de visualização (Lista ou Kanban selecionado) recebe glow lime sutil.
- Botões de excluir (lista e Kanban) recebem glow rose no hover.
- Controles secundários (selects, toggles inativos) têm borda `zinc-700` com hover `zinc-500`, sem glow.
- Console limpo (zero erros) durante fluxo completo em ambos os modos.
- Responsividade validada de 360px a 1920px.
- Acessibilidade por teclado mantida em todos os controles.
- `npm run build` e `npm test` passam sem erros.

**Subtarefas:**

- [x] 5.1 Aplicar glow lime no toggle ativo de visualização
  - **Arquivo**: `src/components/hypotheses/hypothesis-tracker.tsx` (alterar existente)
  - **O quê**: Alterar as classes do botão de tab ativo no toggle Lista/Kanban. Atualmente (selecionado): `"rounded-md bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-100"`. Novo: `"rounded-md bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-100 shadow-glow-lime"`. O botão inativo permanece sem glow: `"rounded-md px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200"` (sem alteração).
  - **Por quê**: RV-04 — o toggle ativo é ação direta e recebe glow para coerência com os botões lime.
  - **Padrão**: Utilitário `shadow-glow-lime` (Tarefa 1.2).
  - **Verificação**: O tab selecionado (Lista ou Kanban) tem glow lime sutil; o inativo não tem glow; alternar muda o glow.

- [x] 5.2 Aplicar glow rose no hover dos botões de excluir (lista e Kanban)
  - **Arquivo**: `src/components/hypotheses/hypothesis-list-item.tsx` (alterar existente) e `src/components/hypotheses/hypothesis-kanban.tsx` (alterar existente)
  - **O quê**: No `HypothesisListItem` (linha 29: `className="shrink-0"`), adicionar classes de transição e glow rose no hover: `className="shrink-0 transition-shadow duration-150 hover:shadow-glow-rose"`. No `HypothesisKanbanCard` (linha 76: `className="size-8 shrink-0"`), idem: `className="size-8 shrink-0 transition-shadow duration-150 hover:shadow-glow-rose"`. Manter `variant="ghost"` e `size="icon"` em ambos. **Nota:** `hover:shadow-glow-rose` funciona porque o utilitário foi registrado com `@utility` na Tarefa 1.2.
  - **Por quê**: RV-04 — botões destrutivos recebem glow rose no hover para sinalizar ação irreversível sem poluir o estado padrão.
  - **Padrão**: Utilitário `shadow-glow-rose` (Tarefa 1.2); `transition-shadow duration-150` para suavidade.
  - **Verificação**: Hover no botão de excluir (lixeira) em item de lista e em card do Kanban mostra glow rose sutil; sem glow no estado padrão.

- [x] 5.3 Padronizar bordas dos controles secundários (selects, toggle container)
  - **Arquivo**: `src/components/hypotheses/hypothesis-tracker.tsx` (alterar existente)
  - **O quê**: No container do tablist (toggle Lista/Kanban, atualmente `className="flex rounded-lg border border-zinc-800 p-0.5"`), alterar borda para `border-zinc-700`: `className="flex rounded-lg border border-zinc-700 p-0.5"`. Os selects nos cards do Kanban herdam borda via token `--border` do Shadcn; verificar visualmente que o token `.dark { --border: oklch(1 0 0 / 10%) }` gera borda coerente. **Sem glow** em nenhum controle secundário.
  - **Por quê**: RV-04 — controles secundários não recebem glow mas devem ter bordas consistentes.
  - **Padrão**: Paleta RV-05: bordas `zinc-700`/`zinc-800`.
  - **Verificação**: Container do toggle tem borda visível `zinc-700`; selects nos cards do Kanban têm borda coerente sem glow.

- [x] 5.4 Aplicar hover sutil nos itens de lista (`hypothesis-list-item.tsx`)
  - **Arquivo**: `src/components/hypotheses/hypothesis-list-item.tsx` (alterar existente)
  - **O quê**: Alterar a classe do `<li>` (linha 17: `className="flex items-start justify-between gap-4 rounded-md border border-zinc-800 p-4"`) para: `className="flex items-start justify-between gap-4 rounded-md border border-zinc-800 bg-zinc-900/60 p-4 transition-colors duration-150 hover:border-zinc-700"`. Adiciona fundo `bg-zinc-900/60` e hover na borda — mesmo padrão dos cards do Kanban (Tarefa 4.3).
  - **Por quê**: Consistência com os cards do Kanban — ambos representam hipóteses e devem ter a mesma linguagem visual.
  - **Padrão**: Mesmo padrão de hover da Tarefa 4.3.
  - **Verificação**: Itens de lista têm fundo diferenciado e hover sutil na borda.

- [x] 5.5 Validação final cruzada: responsividade, a11y, console, build, tests
  - **Arquivo**: nenhum arquivo novo; conferência global.
  - **O quê**: Executar checklist completo do incremento v1.1:
    1. `npm run build` — sem erros de TS ou lint.
    2. `npm test` — todos os testes existentes passam.
    3. Responsividade: testar em 360px, 640px, 768px, 1024px, 1920px em ambos os modos.
    4. Acessibilidade: Tab navega todos os controles na ordem visual; foco visível; `role="tablist"` + `aria-selected` mantidos; botão "Nova hipótese" alcançável por Tab; Esc fecha formulário; `aria-labelledby` aponta para `<h1>`.
    5. Console: zero erros/warnings durante fluxo completo.
    6. Fluxo end-to-end: (a) carregar `/` → formulário fechado. (b) abrir formulário → criar → item aparece. (c) trocar para Kanban → colunas ocupam tela (≥1024px). (d) alterar status via Select. (e) excluir com confirm. (f) trocar para Lista → `max-w-2xl`. (g) fechar formulário via Esc.
    7. Visual: glow lime no toggle ativo, botão toolbar ativo e botão submit; glow rose no hover de excluir; cabeçalhos coloridos no Kanban; hover sutil em cards e itens.
    8. Banner de importação (se visível): padding alinhado com toolbar; funciona normalmente.
  - **Por quê**: Critérios de aceitação 1–9 do PRD v1.1 — validação completa antes de deploy.
  - **Padrão**: Critérios do PRD v1.1 seção 0.
  - **Verificação**: Todos os 9 critérios de aceitação satisfeitos; checklist anotado.

## Próximo passo

Após concluir todas as tarefas (1.0–5.0), o incremento v1.1 está pronto para commit e deploy. Seguir o fluxo Git do repositório e realizar deploy via Vercel. Itens da v1.2+ (edição completa, aprendizado, Zod, componentes Shadcn adicionais) permanecem adiados conforme PRD seção 0.
