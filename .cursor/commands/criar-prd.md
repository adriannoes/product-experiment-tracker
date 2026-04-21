# Gerar um Documento de Requisitos de Produto (PRD)

## Objetivo

Orientar um agente de IA na criação de um Documento de Requisitos de Produto (PRD) detalhado em Markdown, com base em um prompt inicial do usuário. O PRD deve ser claro, acionável e adequado para um desenvolvedor júnior entender e implementar a funcionalidade.

## Processo

1. **Receber o prompt inicial:** O usuário fornece uma descrição breve ou pedido de uma nova funcionalidade.
2. **Fazer perguntas de esclarecimento:** Antes de escrever o PRD, a IA *deve* fazer perguntas de esclarecimento para reunir detalhes suficientes. O objetivo é entender o "o quê" e o "porquê" da funcionalidade, não necessariamente o "como" (que o desenvolvedor definirá).
3. **Gerar o PRD:** Com base no prompt inicial e nas respostas às perguntas de esclarecimento, gerar um PRD usando a estrutura descrita abaixo.
4. **Salvar o PRD:** Salvar o documento gerado como `prd-[nome-da-funcionalidade].md` dentro do diretório `docs/prd/` (raiz do repositório).

## Perguntas de esclarecimento (exemplos)

A IA deve adaptar as perguntas ao prompt, mas estas são áreas comuns a explorar:

* **Problema/objetivo:** "Que problema esta funcionalidade resolve para o usuário?" ou "Qual é o principal objetivo que queremos alcançar com esta funcionalidade?"
* **Usuário-alvo:** "Quem é o usuário principal desta funcionalidade?"
* **Funcionalidade central:** "Pode descrever as principais ações que o usuário deve conseguir realizar com esta funcionalidade?"
* **Histórias de usuário:** "Pode fornecer algumas histórias de usuário? (ex.: Como [tipo de usuário], quero [realizar uma ação] para que [benefício].)"
* **Critérios de aceitação:** "Como saberemos quando esta funcionalidade estiver implementada com sucesso? Quais são os principais critérios de sucesso?"
* **Escopo/limites:** "Há algo específico que esta funcionalidade *não* deve fazer (não-objetivos)?"
* **Requisitos de dados:** "Que tipo de dados esta funcionalidade precisa exibir ou manipular?"
* **Design/UI:** "Existem mockups ou diretrizes de UI a seguir?" ou "Pode descrever a aparência e sensação desejadas?"
* **Casos extremos:** "Há casos extremos ou condições de erro que devemos considerar?"
* **Stack técnica:** "Esta funcionalidade exige implementação específica de Frontend (ex.: componente Shadcn) ou Backend (ex.: tarefa em Worker)?"

## Estrutura do PRD

O PRD gerado deve incluir as seguintes seções:

1. **Introdução/visão geral:** Descrever brevemente a funcionalidade e o problema que resolve. Declarar o objetivo.
2. **Objetivos:** Listar os objetivos específicos e mensuráveis desta funcionalidade.
3. **Histórias de usuário:** Detalhar as narrativas que descrevem o uso e os benefícios.
4. **Requisitos funcionais:** Listar as funcionalidades que a funcionalidade deve ter. Linguagem clara e objetiva (ex.: "O sistema deve permitir que o usuário envie uma foto de perfil."). Numerar estes requisitos.
5. **Não-objetivos (fora do escopo):** Declarar explicitamente o que esta funcionalidade *não* incluirá para controlar o escopo.
6. **Considerações de design (opcional):** Links para mockups, requisitos de UI/UX ou componentes/estilos relevantes, se aplicável.
7. **Métricas de sucesso:** Como o sucesso desta funcionalidade será medido? (ex.: "Aumentar engajamento em 10%", "Reduzir tickets de suporte relacionados a X").
8. **Questões em aberto:** Listar dúvidas remanescentes ou áreas que precisam de mais esclarecimento.

## Público-alvo

Assumir que o leitor principal do PRD é um **desenvolvedor júnior**. Portanto, os requisitos devem ser explícitos, inequívocos e evitar jargão quando possível. Incluir detalhe suficiente para entender o propósito da funcionalidade e a lógica central.

## Saída

* **Formato:** Markdown (`.md`)
* **Local:** `docs/prd/` (relativo à raiz do repositório)
* **Nome do arquivo:** `prd-[nome-da-funcionalidade].md`

## Instruções finais

1. NÃO começar a implementar o PRD
2. Garantir que perguntas de esclarecimento sejam feitas ao usuário
3. Usar as respostas às perguntas de esclarecimento para aprimorar o PRD

## Próximo passo no fluxo

Após o PRD estar salvo em `docs/prd/`, decompor em tarefas com [gerar-tasks.md](./gerar-tasks.md). Durante a implementação, usar [desenvolvimento.md](./desenvolvimento.md) para protocolo de checklist no Markdown.
