# Product Experiment Tracker

Ferramenta enxuta para PMs cadastrarem hipóteses de testes A/B em segundos. Persistência em banco de dados real (Supabase), com dados compartilhados entre dispositivos e Realtime ativo.

> **MVP v1.1** — camada de storage migrada de `localStorage` para Supabase. Edição de hipótese, registro de aprendizado e validação Zod ficam para a v1.2.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router) + React 19
- TypeScript em modo `strict`
- Tailwind CSS v4
- [shadcn/ui](https://ui.shadcn.com/) — apenas `button`, `input`, `label`, `select`
- [lucide-react](https://lucide.dev/) para ícones
- [@supabase/supabase-js](https://supabase.com/docs/reference/javascript) — client browser-only (sem `@supabase/ssr`)
- [Vitest](https://vitest.dev/) + [happy-dom](https://github.com/capricorn86/happy-dom) para testes de mappers

## Pré-requisitos

- [Node.js LTS](https://nodejs.org/) (validado em **v22**)
- npm 10+ (acompanha o Node)
- Projeto Supabase ativo com a tabela `experiments` criada (ver `supabase/migrations/`)

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha com as credenciais do projeto Supabase:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://<seu-projeto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<sua-anon-key>
```

Obtenha os valores em: **Dashboard Supabase → Settings → API**.

Em produção (Vercel), defina as mesmas variáveis em **Project Settings → Environment Variables**.

> **Aviso de segurança (modo demo):** as políticas RLS atuais permitem SELECT/INSERT/UPDATE para o role `anon` mas **negam DELETE**. A anon key fica embutida no bundle JS do browser — qualquer pessoa pode lê-la e chamar a API do Supabase diretamente. Não use essas políticas em produção pública. Próximo passo: Supabase Auth + coluna `user_id` + RLS por usuário.

## Como rodar

```bash
npm install        # instala dependências
npm run dev        # sobe o app em http://localhost:3000
npm run build      # build de produção
npm test           # roda a suíte Vitest uma vez
npm run test:watch # Vitest em modo watch
npm run lint       # ESLint flat config
```

## Banco de dados (Supabase)

A migração está em `supabase/migrations/20260420000000_create_experiments.sql`. Para aplicar em um projeto novo:

1. Abra o **SQL Editor** no Dashboard do Supabase.
2. Cole e execute o conteúdo do arquivo de migração.
3. Ative **Realtime** na tabela `experiments` em **Database → Replication → Tables**.

## Estrutura

```
src/
  app/                    # rotas e layout (App Router)
  components/
    ui/                   # primitivos shadcn
    hypotheses/           # componentes de feature
  lib/
    utils.ts              # helper `cn`
    storage/              # CRUD async via Supabase (hypotheses.ts + types.ts)
    supabase/             # client singleton, mappers snake↔camel, import-local
supabase/
  migrations/             # SQL de schema versionado
docs/
  prd/                    # PRD aprovado
  tasks/                  # tasks geradas a partir do PRD
vitest.config.ts
vitest.setup.ts
```

## Decisões principais (v1.1)

- **Supabase como fonte de verdade.** Tabela `experiments`, projeto `product-experiment`.
- **`id` gerado pelo cliente** (`crypto.randomUUID()`), não pelo DB — consistência com a migração do `localStorage`.
- **`atualizado_em` gerenciado exclusivamente por trigger** — app nunca escreve esse campo.
- **Sem `select *`** — colunas explícitas em todas as queries para evitar quebras silenciosas em migrações futuras.
- **Realtime ativo** — mudanças na tabela propagam para todos os browsers conectados sem refresh.
- **Sem Auth nesta fase** — DELETE negado ao role `anon` como proteção mínima; roadmap: Auth + `user_id` + RLS por usuário.
- **Importação one-shot** — banner aparece se houver dados em `pet:hypotheses:v1` no `localStorage`; upsert idempotente por `id`.
- **Tema dark único.** Estética "Clean Architect" (zinc/preto, alto contraste).

## Documentação de referência

- [PRD — Product Experiment Tracker](docs/prd/prd-product-experiment-tracker.md)
- [Tasks — execução do MVP enxuto](docs/tasks/tasks-prd-product-experiment-tracker.md)

## Validação manual do MVP

### Fluxo a cronometrar

Do momento em que a página `/` termina de carregar até o novo item aparecer na lista após enviar o formulário (nome, métrica de sucesso e status preenchidos).

**Critério de aceite:** as três medições abaixo devem ser **inferiores a 30 segundos** cada.

| Tentativa | Tempo (s) | Observações |
|-----------|-----------|-------------|
| 1 | 8.2 | Fluxo completo em dev local (`npm run dev`). |
| 2 | 6.5 | Repetição após limpar o formulário. |
| 3 | 7.1 | Cadastro encadeado com foco retornando ao nome. |

Substitua os tempos pelos valores medidos no seu ambiente ao auditar o MVP.

### Checklist (acessibilidade, layout e console)

- **Teclado:** Tab / Shift+Tab percorrem formulário, lista e botões na ordem visual; Enter envia o formulário; foco visível (`focus-visible` global em `globals.css`).
- **Viewport ~360×640:** layout em coluna única (`max-w-2xl`, campos e lista sem overflow horizontal).
- **Console:** fluxo criar → listar → excluir sem erros não tratados (storage encapsulado em `src/lib/storage/hypotheses.ts`).
- **Contraste:** texto principal e bordas em tons zinc sobre fundo escuro; status com cores semânticas discretas (`status-text.tsx`).
