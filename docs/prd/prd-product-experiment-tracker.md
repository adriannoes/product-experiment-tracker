# PRD — Product Experiment Tracker (MVP)

> Versão: 1.3 (v1.1 — refactor visual + Kanban tela cheia, pós-deploy)
> Data: 2026-04-21
> Autor: Adrianno (PM)
> Status do documento: Aprovado para implementação (escopo recortado — ver seção 0)

---

## 0. Atualização de escopo — corte moderado (2026-04-20)

Após revisão de prioridade com foco em entregar o mais rápido possível um MVP capaz de validar a métrica primária (cadastro <30s) e a estética visual, o escopo da v1.0 foi **recortado** sem alterar a visão de produto deste documento. As seções abaixo permanecem como **visão completa (north star)**; o que entra na primeira entrega está consolidado na lista a seguir e detalhado em [`docs/tasks/tasks-prd-product-experiment-tracker.md`](../tasks/tasks-prd-product-experiment-tracker.md).

**No escopo da v1.0 enxuta:**

- HU-01 — Cadastrar hipótese rapidamente.
- HU-02 — Listar todas as hipóteses (ordenadas por `criadoEm` desc).
- HU-05 — Excluir hipótese irrelevante.
- HU-06 — Persistência local (`localStorage`).
- RF-01 (parcial) — Criar hipótese com 3 campos obrigatórios (`nome`, `metricaSucesso`, `status`), **sem** o campo `aprendizado` e **sem** modal/`Dialog` (formulário inline no topo de `/`).
- RF-02 (parcial) — Listar hipóteses com `nome`, `status` (texto simples com cor sutil — **sem** componente `Badge`) e `metricaSucesso`, com estado vazio textual.
- RF-04 — Excluir hipótese com confirmação, usando `window.confirm()` nativo (sem `AlertDialog` Shadcn nesta versão).
- RF-05 — Persistência local versionada (`pet:hypotheses:v1`) com fallback gracioso em dados corrompidos.

**v1.1 — Refactor visual pós-deploy (2026-04-21):**

- RV-01 a RV-06 — Kanban tela cheia, toolbar unificada, formulário colapsável, estilo neon sóbrio, tokens dark mode e cabeçalhos coloridos. Detalhes completos na subseção "Incremento v1.1" abaixo.

**Adiado para a v1.2+ (após estabilizar a v1.1):**

- HU-04 / RF-03 — Editar hipótese existente.
- HU-07 e todo o campo `aprendizado` (modelo, RF-06 — limpeza em regressão de status — e indicador visual na lista).
- RF-07 — Validação com Zod e botão "Salvar" desabilitado durante a operação. Substituídos por validação trivial (HTML `required` + `trim().length > 0`) no MVP enxuto.
- Formulário em `Dialog` (modal) — substituído por formulário colapsável na v1.1.
- Componente `Badge` estilizado para status — substituído por texto simples com cor sutil.
- Confirmação de exclusão via `AlertDialog` Shadcn — substituída por `window.confirm()`.

**Por que este recorte é seguro:**

- A métrica primária do PRD (seção 7) só depende de HU-01 + HU-02; editar e `aprendizado` não a afetam.
- O campo `aprendizado` + RF-06 concentram a maior complexidade do PRD original (renderização condicional, regra de limpeza no update, indicador na lista) e só fazem sentido depois de existir um experimento concluído na ferramenta.
- A camada de storage permanece isolada em `src/lib/storage/hypotheses.ts` (ver seção 4.3), portanto adicionar `updateHypothesis`, `aprendizado`, `Dialog`, `Badge` e `AlertDialog` na v1.1 será refactor pontual, sem retrabalho.

### Incremento entregue (2026-04-20) — visão Kanban e atualização de status

- Na tela principal (`/`), o usuário pode alternar entre **Lista** e **Kanban**: o Kanban exibe **quatro colunas** (uma por valor de `status`), com **scroll horizontal** em viewports estreitas (≥360px).
- **HU-03 (parcial):** o `status` pode ser alterado por **Select** em cada card do Kanban; a persistência usa `updateHypothesisStatus` em [`src/lib/storage/hypotheses.ts`](../../src/lib/storage/hypotheses.ts) (atualiza `status` e `atualizadoEm`). **HU-04 / RF-03 completos** (edição de `nome` e `metricaSucesso`, formulário de edição) permanecem adiados para a v1.1.
- UI: [`src/components/hypotheses/hypothesis-tracker.tsx`](../../src/components/hypotheses/hypothesis-tracker.tsx) (alternância de modo), [`src/components/hypotheses/hypothesis-kanban.tsx`](../../src/components/hypotheses/hypothesis-kanban.tsx). Arrastar-e-soltar entre colunas **não** faz parte deste incremento.

**Como ler o resto deste PRD:** as seções 1–9 abaixo descrevem a **visão completa** (north star). Sempre que uma seção se referir a `aprendizado`, edição, RF-06, modal/`Dialog`, `Badge` ou validação Zod, considere que aquele item está **adiado para versão futura**, conforme listado acima.

### Incremento v1.1 — Refactor visual + Kanban tela cheia (2026-04-21, pós-deploy)

> **Contexto:** este incremento ocorre **após o primeiro deploy em produção** (Vercel + Supabase). A v1.0 validou o fluxo principal e a métrica primária (cadastro <30s). Com a ferramenta já publicada e funcional, o foco agora é **elevar a qualidade visual** e otimizar o uso do espaço em tela, sem alterar funcionalidades existentes nem adicionar features novas.

**Motivação:**

1. O Kanban, principal modo de visualização do pipeline de experimentos, está restrito a um container `max-w-2xl` (672px), forçando scroll horizontal mesmo em telas largas — um desperdício de espaço que prejudica a visão panorâmica das colunas.
2. Os controles de ação (formulário de criação, toggle de visualização) estão distribuídos verticalmente, empurrando o conteúdo principal para baixo e exigindo scroll desnecessário.
3. A estética do MVP é funcional mas não coesa: apenas o botão "Adicionar hipótese" usa o estilo neon (glow lime); os demais controles usam estilos padrão Shadcn sem identidade visual própria.

**Escopo do incremento v1.1:**

- **RV-01 — Kanban em tela cheia:** ao ativar o modo Kanban, o layout deve expandir para a largura total da viewport (removendo a restrição `max-w-2xl`), de forma que as 4 colunas de status ocupem o espaço disponível proporcionalmente. Em telas estreitas (<1024px), manter scroll horizontal com largura mínima por coluna (~260px) para garantir legibilidade dos cards e selects de status. O modo Lista permanece com largura contida (`max-w-2xl`) para legibilidade de texto.

- **RV-02 — Toolbar unificada no topo:** reorganizar os controles existentes em uma **barra horizontal fixa no topo** da seção de hipóteses, composta por:
  - **Esquerda:** título "Product Experiment Tracker" + subtítulo conciso.
  - **Direita:** toggle Lista/Kanban + botão para abrir/colapsar o formulário de criação (substituir o formulário sempre-visível por um formulário expansível/colapsável acionado por botão).
  - Em telas estreitas (<640px), a toolbar pode quebrar em duas linhas, mantendo os controles acessíveis.

- **RV-03 — Formulário colapsável:** o formulário de criação (hoje inline e sempre visível) deve poder ser **expandido/colapsado** via botão na toolbar. Quando aberto, exibe os 3 campos e o botão de submit abaixo da toolbar; quando fechado, libera espaço para o Kanban/Lista. O formulário inicia **fechado** por padrão (o usuário já tem hipóteses cadastradas após o deploy).

- **RV-04 — Estilo neon sóbrio padronizado:** aplicar consistência visual nos controles interativos usando glow sutil inspirado no botão existente ("Adicionar hipótese"), com as seguintes diretrizes:
  - **Botões primários (ações construtivas):** glow lime (`shadow-[0_0_18px_-2px_rgba(163,230,53,0.65)]`) — já aplicado no botão "Adicionar hipótese"; estender ao toggle ativo de visualização.
  - **Botões destrutivos (excluir):** glow sutil rose/vermelho (`shadow-[0_0_12px_-3px_rgba(244,63,94,0.4)]`) no hover, mantendo `variant="ghost"` no estado padrão para não poluir visualmente.
  - **Controles secundários (selects, toggles inativos):** bordas `zinc-700` com transição de borda para `zinc-500` no hover; sem glow — sobriedade deliberada.
  - **Cards do Kanban:** borda sutil `zinc-800` padrão, com transição para `zinc-700` no hover; fundo `zinc-900/60` para leve diferenciação do background.
  - **Regra geral:** glow apenas em botões de ação direta (criar, excluir, toggle ativo). Inputs, labels e texto estático **nunca** recebem glow. Efeito controlado via `box-shadow` com valores baixos de spread para manter sobriedade.

- **RV-05 — Reforço de tokens dark mode:** revisar e padronizar tokens de cor em `globals.css` para garantir consistência em toda a UI:
  - Background principal: `zinc-950` (`#09090b`).
  - Superfícies elevadas (cards, popovers): `zinc-900` com opacidade.
  - Bordas: `zinc-800` padrão, `zinc-700` em hover/focus.
  - Texto primário: `zinc-100`; secundário: `zinc-400`; terciário: `zinc-500`.
  - Focus ring: manter `outline-2px solid #a1a1aa` (zinc-400) para acessibilidade WCAG AA.

- **RV-06 — Cabeçalhos de coluna Kanban com cor de status:** aplicar a mesma paleta de cor do `StatusText` nos títulos das colunas do Kanban (`zinc-400` para Backlog, `amber-400` para Em andamento, `emerald-400` para Validada, `rose-400` para Invalidada), reforçando a associação visual status ↔ coluna.

**Arquivos impactados (estimativa):**

| Arquivo | Tipo de mudança |
|---------|----------------|
| `src/app/page.tsx` | Layout condicional (full-width vs. contido) |
| `src/app/globals.css` | Tokens neon customizados, utilitários de glow |
| `src/components/hypotheses/hypothesis-tracker.tsx` | Toolbar unificada, formulário colapsável, prop de layout |
| `src/components/hypotheses/hypothesis-kanban.tsx` | Colunas flexíveis (fill), cabeçalhos coloridos, hover cards |
| `src/components/hypotheses/new-hypothesis-form.tsx` | Aceitar controle de visibilidade externo (colapsável) |
| `src/components/hypotheses/hypothesis-list-item.tsx` | Hover neon em botão excluir |
| `src/components/hypotheses/status-text.tsx` | Reutilizado para cores dos cabeçalhos Kanban |

**O que NÃO muda neste incremento:**

- Nenhuma funcionalidade nova (criar, listar, excluir, atualizar status — todos permanecem iguais).
- Nenhum componente Shadcn novo (sem `Dialog`, `Badge`, `AlertDialog`, `Textarea`).
- Nenhuma alteração no módulo de storage ou na camada Supabase.
- Nenhuma alteração no modelo de dados.
- A visão Lista mantém layout contido (`max-w-2xl`) e aparência atual (ajustes de glow pontuais).

**Critérios de aceitação do incremento v1.1:**

1. No modo Kanban, as 4 colunas ocupam a largura total da viewport em telas ≥1024px; em telas <1024px, mantém scroll horizontal sem quebra de layout.
2. A toolbar está organizada horizontalmente no topo, com título à esquerda e controles à direita.
3. O formulário de criação é colapsável e inicia fechado; ao abrir, exibe os 3 campos; ao submeter com sucesso, permanece aberto para encadear cadastros.
4. Todos os botões de ação seguem a paleta neon definida em RV-04 (lime para construtivo, rose para destrutivo, sem glow em secundários).
5. Cards do Kanban apresentam hover sutil com transição de borda.
6. Cabeçalhos de coluna do Kanban refletem a cor do status correspondente.
7. Console limpo (zero erros) durante o fluxo principal em ambos os modos (Lista e Kanban).
8. Responsividade validada de 360px a 1920px; acessibilidade por teclado mantida (Tab, Enter, Esc para fechar formulário).
9. `npm run build` passa sem erros de TypeScript ou lint.

---

## 1. Introdução / Visão geral

O **Product Experiment Tracker** é uma ferramenta web simples para Product Managers (PMs) registrarem, acompanharem e revisarem hipóteses de experimentos de produto.

Hoje, muitos PMs gerenciam suas hipóteses de teste em planilhas, anotações soltas ou ferramentas genéricas (Notion, Trello), o que dificulta visualizar rapidamente o que está em andamento, o que foi validado e o que foi descartado.

O MVP resolve esse problema oferecendo uma interface dedicada, leve e sem fricção: o PM consegue cadastrar uma nova hipótese em menos de 30 segundos e visualizar todas as suas hipóteses em uma única tela. Nesta primeira versão, todos os dados ficam armazenados **localmente no navegador do usuário** (via `localStorage`), eliminando a necessidade de backend, autenticação ou infraestrutura.

**Objetivo principal:** entregar a forma mais rápida possível de um PM individual cadastrar e acompanhar suas hipóteses de experimento.

---

## 2. Objetivos

1. Permitir que um PM cadastre uma hipótese completa em **menos de 30 segundos**.
2. Disponibilizar uma visão em **lista** e, opcionalmente, uma visão **Kanban** (colunas por status) com todas as hipóteses cadastradas; em ambos os modos, a ordenação padrão é por `criadoEm` decrescente (dentro de cada coluna no Kanban).
3. Suportar o ciclo de vida de uma hipótese através de status (Backlog → Em andamento → Concluído Validada/Invalidada).
4. Persistir os dados no navegador sem necessidade de backend, login ou conta.
5. Garantir uma experiência minimalista, responsiva e acessível, alinhada à identidade visual "Clean Architect" do repositório.

---

## 3. Histórias de usuário

- **HU-01** — Como PM, quero cadastrar uma nova hipótese rapidamente, para registrar uma ideia antes de esquecê-la.
- **HU-02** — Como PM, quero visualizar todas as minhas hipóteses em uma lista única, para entender o que está no meu pipeline de experimentação.
- **HU-03** — Como PM, quero atualizar o status de uma hipótese (ex.: mover de "Em andamento" para "Concluído — Validada"), para refletir o estado real do experimento.
- **HU-04** — Como PM, quero editar os dados de uma hipótese existente, para corrigir informações ou refinar a métrica de sucesso ao longo do tempo.
- **HU-05** — Como PM, quero excluir uma hipótese que não é mais relevante, para manter minha lista limpa.
- **HU-06** — Como PM, quero que meus dados permaneçam disponíveis ao reabrir o navegador, para não perder o histórico das minhas hipóteses.
- **HU-07** — Como PM, ao concluir um experimento (validado ou invalidado), quero registrar o aprendizado obtido, para construir uma memória das descobertas ao longo do tempo.

---

## 4. Requisitos funcionais

### 4.1 Modelo de dados — Hipótese

Cada hipótese deve conter os seguintes campos:

| Campo | Tipo | Obrigatório | Origem |
|---|---|---|---|
| `id` | string (UUID) | Sim | Gerado automaticamente |
| `nome` | string | **Sim** | Preenchido pelo usuário |
| `status` | enum | **Sim** | Preenchido pelo usuário (default: `Backlog`) |
| `metricaSucesso` | string | **Sim** | Preenchido pelo usuário |
| `aprendizado` | string (texto longo) | Não | Preenchido pelo usuário ao concluir o experimento |
| `criadoEm` | datetime (ISO 8601) | Sim | Gerado automaticamente |
| `atualizadoEm` | datetime (ISO 8601) | Sim | Gerado/atualizado automaticamente |

> **Nota sobre `aprendizado`:** o campo é opcional e tem como propósito capturar o que foi descoberto após a conclusão do experimento (validação ou invalidação da hipótese). No formulário, ele só deve ser exibido/encorajado quando o `status` selecionado for `Concluído — Validada` ou `Concluído — Invalidada` (ver RF-01).

**Valores possíveis de `status`:**

1. `Backlog` (default ao criar)
2. `Em andamento`
3. `Concluído — Validada`
4. `Concluído — Invalidada`

### 4.2 Funcionalidades

**RF-01 — Criar hipótese**
1. O sistema deve permitir que o usuário crie uma nova hipótese a partir de um botão "Nova hipótese" claramente visível na tela principal.
2. O formulário de criação deve exibir, por padrão, apenas os 3 campos obrigatórios: `nome`, `metricaSucesso` e `status` (com `Backlog` pré-selecionado).
3. O campo `aprendizado` (textarea) deve aparecer no formulário **somente quando** o `status` selecionado for `Concluído — Validada` ou `Concluído — Invalidada`. Mesmo nesse caso, ele permanece **opcional**.
4. Os campos `nome`, `metricaSucesso` e `status` são obrigatórios; o sistema deve impedir o envio se algum deles estiver vazio e exibir mensagens de erro inline.
5. Ao salvar, a hipótese deve ser persistida em `localStorage` e a lista deve ser atualizada imediatamente.
6. O formulário pode ser apresentado em um modal/dialog ou em uma seção expansível — a escolha cabe ao desenvolvedor, desde que a tela principal continue sendo a lista.

**RF-02 — Listar hipóteses**
1. A tela principal (`/`) deve exibir todas as hipóteses cadastradas em uma lista (ou tabela compacta).
2. Cada item da lista deve exibir, no mínimo: `nome`, `status` (com indicador visual/badge) e `metricaSucesso`.
3. Para hipóteses concluídas com `aprendizado` preenchido, exibir um indicador visual sutil (ex.: ícone de "anotação") que permita visualizar o conteúdo (tooltip, expansão inline ou via modal de edição). A escolha cabe ao desenvolvedor, desde que não polua a listagem.
4. As hipóteses devem ser ordenadas por `criadoEm` decrescente (mais recente primeiro).
5. Quando não houver hipóteses, exibir um estado vazio com instrução clara para criar a primeira (CTA).
6. **(Incremento Kanban)** O usuário pode alternar para uma visão em colunas alinhadas aos valores de `status`; isso é um **modo de visualização**, não um filtro de busca — todas as hipóteses permanecem acessíveis ao alternar o modo ou rolar horizontalmente no Kanban.

**RF-03 — Editar hipótese**
1. Cada item da lista deve oferecer uma ação "Editar".
2. A ação deve abrir o mesmo formulário do RF-01, pré-preenchido com os dados atuais da hipótese.
3. Ao salvar, atualizar `atualizadoEm` e persistir em `localStorage`.

**RF-04 — Excluir hipótese**
1. Cada item da lista deve oferecer uma ação "Excluir".
2. O sistema deve solicitar confirmação antes de excluir definitivamente (modal de confirmação).
3. Após a confirmação, a hipótese é removida de `localStorage` e da lista imediatamente.

**RF-05 — Persistência local**
1. Todos os dados devem ser salvos em `localStorage` sob uma chave única e versionada: `pet:hypotheses:v1`.
2. Ao carregar a aplicação, os dados existentes em `localStorage` devem ser hidratados na interface.
3. Toda a leitura/escrita deve ser concentrada em **um único módulo** com funções soltas (sem interface/classe) — ver seção 4.3.
4. Em caso de dados corrompidos no `localStorage` (ex.: JSON inválido), o sistema deve falhar de forma graciosa: exibir uma lista vazia e logar o erro no `console`, sem quebrar a aplicação.

**RF-06 — Regressão de status limpa `aprendizado`**
1. Se o usuário editar uma hipótese cujo `status` esteja em `Concluído — Validada` ou `Concluído — Invalidada` e alterar o status para `Backlog` ou `Em andamento`, o campo `aprendizado` deve ser **limpo automaticamente** (definido como string vazia / removido do objeto persistido).
2. O comportamento deve ser silencioso, sem modal de confirmação, alinhado à filosofia "sem fricção" do MVP. O usuário pode reaprovar ao reescrever o aprendizado se voltar a concluir a hipótese.

**RF-07 — Validação e UX do formulário**
1. Validação dos campos obrigatórios deve ocorrer no cliente, com mensagens em português, usando Zod (já presente no stack do repositório).
2. O foco do primeiro campo (`nome`) deve ser dado automaticamente ao abrir o formulário.
3. O botão "Salvar" deve ficar desabilitado enquanto a operação está em andamento (mesmo que síncrona, manter o padrão para evolução futura).
4. O campo `aprendizado` deve ser exibido como texto puro com quebras de linha preservadas (CSS `whitespace-pre-wrap`). **Sem markdown, sem rich text** — alinhado ao princípio de simplicidade do MVP.

### 4.3 Módulo de storage

Toda a leitura/escrita em `localStorage` fica concentrada em **um único arquivo** com **funções soltas síncronas** (sem interface, sem classe, sem singleton).

**Estrutura de arquivos:**

```
src/lib/storage/
├── types.ts          # Tipos: Hypothesis, HypothesisStatus, CreateHypothesisInput, UpdateHypothesisInput (v1.1)
└── hypotheses.ts     # Funções: listHypotheses, createHypothesis, updateHypothesisStatus, updateHypothesis (v1.1), removeHypothesis
```

**API pública mínima do `hypotheses.ts`:**

| Função | Retorno | Responsabilidade |
|---|---|---|
| `listHypotheses()` | `Hypothesis[]` | Lê e parseia `localStorage`; retorna `[]` em caso de erro/dados corrompidos |
| `createHypothesis(input)` | `Hypothesis` | Gera `id`, `criadoEm` e `atualizadoEm`; persiste; retorna o objeto criado |
| `updateHypothesisStatus(id, status)` | `Hypothesis \| null` | Atualiza apenas `status` e `atualizadoEm`; retorna `null` se o `id` não existir |
| `updateHypothesis(id, patch)` | `Hypothesis` | *(v1.1)* Aplica `patch`; atualiza `atualizadoEm`; aplica regra de RF-06; persiste |
| `removeHypothesis(id)` | `void` | Remove do array e persiste |

**Princípios:**

1. **Funções síncronas** — `localStorage` é síncrono, e o MVP não precisa simular async.
2. **Sem cache na camada de storage** — sempre lê do `localStorage`. A UI cuida de re-renderizar via `useState`.
3. **Geração de `id`/timestamps acontece dentro das funções**, nunca na UI. Isso facilita uma futura migração: ao trocar para Supabase, o backend assume essa responsabilidade e a UI continua intacta.
4. **Tratamento de erros encapsulado** — try/catch no parse, log no `console.error` e fallback para lista vazia.
5. **Migração futura para Supabase:** quando chegar a hora, esse arquivo será reescrito (provavelmente tornando as funções async). Será um refactor pontual e localizado, justamente porque toda a app só consome as funções exportadas por este módulo.

---

## 5. Não-objetivos (fora do escopo do MVP)

Para manter o MVP enxuto e entregável rapidamente, **NÃO** estão no escopo desta versão:

- ❌ Backend, banco de dados remoto ou sincronização entre dispositivos.
- ❌ Autenticação, contas de usuário ou multiusuário (mesmo navegador → um único conjunto de dados).
- ❌ Campo de **responsável** (não faz sentido em uso pessoal — o usuário-alvo é PM individual).
- ❌ Campos de **datas de início/fim** ou prazo do experimento (evitamos sobrecarregar o cadastro; reavaliar após validação do MVP).
- ❌ Filtros, busca textual ou ordenação customizada na listagem.
- ❌ Tela de detalhe dedicada (ex.: `/hipoteses/[id]`) — a edição acontece direto no formulário modal.
- ❌ Exportação ou importação de dados (CSV, JSON).
- ❌ Anexos, comentários, histórico de alterações, logs de atividade.
- ❌ Tags, categorias, agrupamentos por squad/produto.
- ❌ Métricas quantitativas integradas (gráficos de resultado, dashboards).
- ❌ Notificações, lembretes ou integrações com calendário.
- ❌ Dark/light mode toggle (a aplicação seguirá a estética dark "Clean Architect" por padrão).

Esses itens podem ser revisitados em iterações futuras com base no feedback de uso.

---

## 6. Considerações de design

- **Stack & padrões:** seguir rigorosamente a skill `frontend-development` do repositório (Next.js App Router, RSC-first quando possível, TypeScript strict, Tailwind v4, Shadcn via `packages/ui`, ícones Lucide).
- **Diretivas client-only:** o formulário, as ações de CRUD e o acesso a `localStorage` exigem `"use client"`; manter o layout e a página principal o mais "server" possível, com a lista hidratada por um componente cliente.
- **Estética:** dark minimalista "Clean Architect" — paleta neutra, hierarquia tipográfica clara, badges sutis para status, espaçamento generoso.
- **Componentes Shadcn sugeridos:** `Button`, `Dialog` (formulário), `Input`, `Textarea`, `Select` (status), `Badge` (status na lista), `Card` ou `Table` (listagem), `AlertDialog` (confirmação de exclusão).
- **Acessibilidade:** todos os controles devem ser acessíveis via teclado, com `aria-label` apropriados; foco visível; contraste mínimo WCAG AA.
- **Responsividade:** a tela principal deve funcionar bem em telas a partir de 360px (mobile) até desktop. No modo Kanban, as colunas podem dispor em **scroll horizontal** para preservar legibilidade.
- **Internacionalização:** todo o texto da UI em **português brasileiro** (alinhado com a regra de comunicação do repositório). Comentários e nomes de identificadores no código em **inglês**.

---

## 7. Métricas de sucesso

**Métrica primária do MVP:**

- ⏱️ **Tempo de cadastro:** um PM consegue criar uma nova hipótese (do clique em "Nova hipótese" até confirmar a criação) em **menos de 30 segundos**, considerando todos os campos obrigatórios preenchidos.

**Como medir:** validação manual cronometrada com 3 usuários reais (incluindo o autor) após o deploy do MVP. Critério de aceite: pelo menos 3 de 3 testes abaixo de 30s.

**Métricas secundárias (observação qualitativa, sem instrumentação):**

- A aplicação carrega em menos de 1 segundo em rede 4G.
- Zero erros não tratados no console do navegador durante o fluxo principal (criar → listar → atualizar status no Kanban, quando aplicável → excluir; edição completa de hipótese permanece fora do escopo enxuto).
- O autor consegue gerenciar pelo menos 10 hipóteses sem fricção perceptível na UI.

---

## 8. Decisões de produto (questões resolvidas)

1. ✅ **Limite do `localStorage`:** não será tratado no MVP. O limite típico (~5MB) é suficiente para milhares de hipóteses no caso de uso esperado.
2. ✅ **Migração para Supabase (concluída):** as funções em `src/lib/storage/hypotheses.ts` foram convertidas para `async` e agora operam sobre a tabela `experiments` no Supabase. A UI permaneceu intacta (consome as mesmas funções públicas). `localStorage` é mantido apenas como source de importação legado (`import-local-banner.tsx`).
3. ✅ **Nomenclatura na UI:** adotado **"Hipótese"** como termo principal.
4. ✅ **Botão "Limpar tudo":** fora do escopo do MVP.

---

## 9. Próximos passos

Conforme o fluxo definido em `.cursor/commands/`:

1. Decompor este PRD em tarefas executáveis usando `gerar-tasks.md`. ✅ Concluído — ver [`docs/tasks/tasks-prd-product-experiment-tracker.md`](../tasks/tasks-prd-product-experiment-tracker.md) (escopo da v1.0 enxuta conforme seção 0).
2. Implementar seguindo o protocolo de checklist em `desenvolvimento.md`.
3. ✅ MVP v1.0 enxuto validado e **deployed** (Vercel + Supabase). Persistência migrada de `localStorage` para Supabase com Realtime; `localStorage` mantido apenas como source de importação legado.
4. **v1.1 (em andamento):** implementar o incremento visual (RV-01 a RV-06) documentado na seção 0 — refactor pós-deploy focado em layout, Kanban tela cheia e estética neon sóbria.
5. Após estabilizar a v1.1, reabrir os itens listados em "Adiado para a v1.2+" na seção 0 (edição completa, aprendizado, Zod, componentes Shadcn adicionais).

## Documentos relacionados

- Plano de tarefas v1.0: [`docs/tasks/tasks-prd-product-experiment-tracker.md`](../tasks/tasks-prd-product-experiment-tracker.md) — reflete o **corte moderado** (v1.0 enxuta). ✅ Concluído.
- Plano de tarefas v1.1: [`docs/tasks/tasks-v1.1-visual-refactor.md`](../tasks/tasks-v1.1-visual-refactor.md) — refactor visual pós-deploy (RV-01 a RV-06).
