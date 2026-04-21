# Product Experiment Tracker

Ferramenta enxuta para PMs cadastrarem hipóteses de testes A/B em segundos. **Supabase** é a fonte de verdade: dados compartilhados entre dispositivos e **Realtime** ativo.

> **MVP (armazenamento)** — a camada de storage foi migrada de `localStorage` para o Supabase.  
> **v1.1 (interface, pós-deploy)** — refactor visual: toolbar unificada, formulário de criação colapsável, Kanban em largura total em telas grandes, tokens dark padronizados, botões primários com variante `emphasis` (zinc) no design system, hovers e brilho rose nos botões de excluir. **Não há novas regras de negócio** na v1.1. Edição completa, campo `aprendizado` e validação Zod seguem no roadmap (veja o PRD).

## Stack

- [Next.js 16](https://nextjs.org/) (App Router) + React 19
- TypeScript em modo `strict`
- Tailwind CSS v4 (utilitários customizados com `@utility` quando necessário, ex.: sombra rose em hovers destrutivos)
- [shadcn/ui](https://ui.shadcn.com/) — `button`, `input`, `label`, `select` e variantes do `Button` (ex.: `emphasis` para ações principais)
- [lucide-react](https://lucide.dev/) para ícones
- [@supabase/supabase-js](https://supabase.com/docs/reference/javascript) — client apenas no browser (sem `@supabase/ssr`)
- [Vitest](https://vitest.dev/) + [happy-dom](https://github.com/capricorn86/happy-dom) para testes

## O que mudou na v1.1 (resumo)

- **Layout da home** — `max-w-2xl` deixa de prender a página inteira; título, subtítulo (sem copy de “dados só no navegador”) e controles ficam numa **barra superior**; modo **Lista** continua com conteúdo contido; modo **Kanban** usa a largura útil, com colunas flexíveis a partir de `lg` e scroll horizontal em telas menores.
- **Formulário de criação** — inicia **fechado**; o botão **“Nova hipótese”** abre e fecha; **Esc** fecha; foco e fluxo pós-salvamento alinhados ao PRD.
- **Kanban** — títulos de coluna com a mesma paleta de status da lista; cards com fundo e hover de borda; lista de itens com visual alinhado aos cards.
- **Estilo** — tokens `.dark` revisados; botões alinhados ao componente `Button` (variante `emphasis` em zinc, não CTA verde).
- Comportamento de **criar / listar / alterar status / excluir** e integração com **Supabase** permanecem os mesmos do MVP.

## Pré-requisitos

- [Node.js](https://nodejs.org/) em **v22** (veja `engines` no `package.json`)
- **npm** 10+ (vem com o Node)
- Projeto **Supabase** com a tabela `experiments` (veja `supabase/migrations/`)

## Variáveis de ambiente

Crie o arquivo a partir do exemplo e preencha com a URL pública e a **anon key** do seu projeto:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://<seu-projeto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<sua-anon-key>
```

Onde obter: **Supabase Dashboard → Project Settings → API**. Em produção (ex.: Vercel), defina as mesmas variáveis em **Environment Variables** do projeto.

> **Segurança (estilo demo):** a anon key fica no bundle do browser. As políticas RLS do repositório não substituem um produto multiusuário com Auth. Plano: Supabase Auth + `user_id` + RLS por usuário (detalhes no PRD).

## Como rodar localmente

Segue um fluxo mínimo do zero até abrir o app no navegador.

1. **Clonar o repositório** (se ainda não tiver a pasta do projeto):
   - `git clone <url-do-repo>`  
   - Explicação: copia o código para a sua máquina.

2. **Entrar na pasta do projeto:**
   - `cd product-experiment-tracker`  
   - Explicação: os próximos comandos precisam rodar na raiz do app.

3. **Instalar dependências:**
   - `npm install`  
   - Explicação: baixa as dependências listadas no `package-lock.json`.

4. **Configurar ambiente (obrigatório para falar com o Supabase):**
   - Copie `.env.example` para `.env.local` (como na seção acima) e preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.  
   - Sem isso, o app pode subir, mas a listagem e criação de hipóteses vão falhar.

5. **Subir o servidor de desenvolvimento:**
   - `npm run dev`  
   - Explicação: inicia o Next.js com hot reload, em geral em `http://localhost:3000`.

6. **Abrir no navegador** a URL exibida no terminal (padrão `http://localhost:3000/`) e validar criação de hipóteses, troca Lista/Kanban, etc.

**Comandos úteis (ainda em local):**

- `npm run build` — gera o build de produção (TypeScript + páginas estáticas); use para checar se tudo compila.
- `npm start` — após `npm run build`, sobe o servidor de produção localmente (porta 3000 por padrão).
- `npm test` — roda a suíte **Vitest** uma vez.
- `npm run test:watch` — Vitest em modo watch.
- `npm run lint` — **ESLint** no projeto.

## Banco de dados (Supabase)

A migração está em `supabase/migrations/20260420000000_create_experiments.sql`. Para um projeto novo:

1. **SQL Editor** no Dashboard do Supabase → cole e execute o arquivo de migração.
2. Ative **Realtime** na tabela `experiments` (em **Database**: Replication/Publications, conforme a UI do seu projeto).

## Estrutura do repositório

```
src/
  app/                    # rotas e layout (App Router)
  components/
    ui/                   # primitivos shadcn
    hypotheses/            # feature (tracker, lista, kanban, form, banner)
  lib/
    utils.ts              # helper `cn`
    storage/              # CRUD assíncrono (Supabase) + types
    supabase/              # client singleton, mappers, import de dados legado
supabase/
  migrations/              # SQL versionado
docs/
  prd/                     # PRD
  tasks/                    # listas de tarefas (MVP, v1.1, etc.)
```

## Decisões principais

- **Supabase** como fonte de verdade; tabela `experiments`.
- **`id` gerado no cliente** (`crypto.randomUUID()`), alinhado à migração a partir do `localStorage`.
- **`atualizado_em` só via trigger** no banco — o app não grava esse campo.
- **Sem `select *`** — colunas explícitas nas consultas.
- **Realtime** — alterações na tabela refletem em outras abas sem refresh forçado.
- **Tema dark único** — paleta zinc e contraste alto; import one-shot de `localStorage` quando o banner aparecer.

## Documentação de referência

- [PRD — Product Experiment Tracker](docs/prd/prd-product-experiment-tracker.md)
- [Tasks — MVP enxuto](docs/tasks/tasks-prd-product-experiment-tracker.md)
- [Tasks — refactor visual v1.1](docs/tasks/tasks-v1.1-visual-refactor.md)

## Validação manual (referência de produto)

### Tempo até a primeira hipótese visível (da carga de `/` até o item na lista)

Critério de aceite (PRD): três tentativas **&lt; 30 s** cada. Ajuste a tabela com as suas medições reais.

| Tentativa | Tempo (s) | Observações |
|-----------|-----------|-------------|
| 1 | 8.2 | Exemplo: dev local |
| 2 | 6.5 | Exemplo: após limpar o formulário |
| 3 | 7.1 | Exemplo: cadastros em sequência |

### Checklist rápido

- **Teclado:** Tab na ordem visual; **Enter** no formulário; **Esc** com o painel de criação aberto; foco visível global (`globals.css`).
- **Viewport ~360×640:** toolbar quebra em linha(s); Kanban com scroll horizontal abaixo de `lg` se necessário.
- **Console:** sem erros não tratados em criar / listar / excluir.
- **Contraste:** textos e bordas em zinc; cores de status discretas (`status-text`, títulos do Kanban).
