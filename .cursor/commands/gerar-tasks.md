# Gerar uma lista de tarefas a partir de um PRD

## Objetivo

Orientar um assistente de IA na criação de uma lista de tarefas detalhada, passo a passo, em Markdown, com base em um Documento de Requisitos de Produto (PRD) existente. A lista deve guiar um desenvolvedor (ou um modelo de IA menos capaz) na implementação.

## Saída

- **Formato:** Markdown (`.md`)
- **Local:** `docs/tasks/` (raiz do repositório; alinhado ao passo 10 abaixo)
- **Nome do arquivo:** `tasks-[nome-do-arquivo-prd].md` (ex.: `tasks-prd-user-profile-editing.md`)

## Processo

1. **Receber referência ao PRD:** O usuário indica ao IA um arquivo de PRD específico.
2. **Analisar o PRD:** O IA lê e analisa os requisitos funcionais, histórias de usuário e demais seções do PRD indicado.
3. **Fase 1: gerar tarefas-pai:** Com base na análise, criar o arquivo e gerar as principais tarefas de alto nível necessárias para implementar a funcionalidade. Usar julgamento sobre quantas tarefas de alto nível usar (em geral, cerca de 5). Apresentar essas tarefas ao usuário no formato especificado (ainda sem subtarefas). Informar o usuário: "Gerei as tarefas de alto nível com base no PRD. Posso gerar as subtarefas? Responda com 'Ok, siga' para continuar."
4. **Aguardar confirmação:** Pausar e esperar o usuário responder com "Ok, siga".
5. **Fase 2: gerar subtarefas:** Após a confirmação, detalhar cada tarefa-pai em subtarefas menores e acionáveis. **Usar o formato detalhado** (ver abaixo) para que modelos de IA menos capazes executem corretamente. Para tarefas que fazem parte de um fluxo ou têm dependências, incluir **Gatilho/ponto de entrada**, **Habilita** e **Depende de** no nível da tarefa. Dar a cada tarefa-pai seus próprios **critérios de aceitação** (verificáveis e específicos daquela tarefa).
6. **Identificar arquivos relevantes:** Com base nas tarefas e no PRD, identificar arquivos que provavelmente precisarão ser criados ou modificados. Listá-los na seção `Arquivos relevantes`, incluindo arquivos de teste quando aplicável.
7. **Tornar dependências explícitas:** Para qualquer tarefa que faça parte de um fluxo maior ou tenha dependências (jornada do usuário, etapa de pipeline, consumidor de API, script que lê a saída de outra tarefa), incluir **Gatilho/ponto de entrada**, **Habilita** e **Depende de** (ver "Dependências e integração" abaixo). Garantir que os critérios de aceitação pertençam à tarefa que os entrega — nenhum critério de aceitação deve descrever o resultado de outra tarefa.
8. **Gerar saída final:** Combinar tarefas-pai, subtarefas, arquivos relevantes, notas de dependência e critérios de aceitação na estrutura final em Markdown.
9. **Checklist pós-geração:** Antes de salvar, verificar: (a) tarefas com dependências têm Gatilho/Habilita/Depende de quando relevante; (b) cada tarefa tem critérios de aceitação próprios e nenhum descreve o resultado de outra tarefa; (c) pontos de integração (onde a saída de uma tarefa é entrada de outra) estão declarados nas subtarefas ou nas notas da tarefa.
10. **Salvar a lista de tarefas:** Salvar o documento em `docs/tasks/` com o nome `tasks-[nome-do-arquivo-prd].md`. Para PRDs grandes (ex.: releases multi-sprint), organizar a saída em pasta versionada (ex.: `docs/tasks/v2.1.0/`) com arquivo de roadmap (`tasks-v2.1.0-roadmap.md`) e arquivos por sprint (`sprint-E1-*.md`, etc.); a seção Documentos relacionados do PRD deve apontar para o roadmap.

## Formato de saída

A lista de tarefas gerada *deve* seguir esta estrutura:

```markdown
## Arquivos relevantes

- `caminho/do/modulo-principal.ext` — Breve descrição de por que este arquivo é relevante.
- `caminho/do/arquivo-de-teste.ext` — Testes ou especificações que cobrem o módulo principal (ajuste ao padrão do projeto).

### Notas

- Coloque testes ou checks automatizados onde o repositório já costuma mantê-los (ex.: `tests/`, `__tests__/`, ao lado do código fonte, etc.).
- Para **Verificação** nas subtarefas, use o comando ou fluxo de teste **do próprio projeto** (ex.: `npm test`, `pnpm test`, `pytest`, `go test`, UI/E2E conforme o stack).

## Tarefas

- [ ] 1.0 Título da tarefa-pai
  - [ ] 1.1 [Descrição da subtarefa 1.1]
  - [ ] 1.2 [Descrição da subtarefa 1.2]
- [ ] 2.0 Título da tarefa-pai
  - [ ] 2.1 [Descrição da subtarefa 2.1]
```

### Dependências e integração (quando aplicável)

Para qualquer tarefa que faça parte de um fluxo maior ou tenha dependências — jornada do usuário, etapa de pipeline, consumidor de API, script que lê a saída de outra tarefa — tornar explícito no início daquela tarefa (ou tarefa-pai):

- **Gatilho / ponto de entrada:** O que invoca ou alcança este trabalho (ex.: ação do usuário, cron, webhook, chamada de outro serviço, etapa anterior do pipeline).
- **Habilita:** O que esta tarefa desbloqueia para outras tarefas, serviços ou funcionalidades (ex.: nova API para um cliente, novo campo no schema, próximo passo no fluxo).
- **Depende de:** O que já deve existir antes desta tarefa (outras tarefas, schema, endpoints, formato de arquivo).

Usar linguagem neutra para que as mesmas regras sirvam para backend, frontend, scripts e infraestrutura. Quando a saída de uma tarefa for entrada de outra, descrever a **integração** nas subtarefas ou na descrição da tarefa (ex.: contrato de API, formato do payload, arquivo, URL ou artefato).

Exemplo de bloco de dependência explícito no início de uma tarefa:

```markdown
## Tarefa 2.3: Formulário de edição de perfil

**Gatilho:** O usuário abre "Minha conta" a partir do menu principal (Tarefa 2.2).  
**Habilita:** Salvar alterações de perfil e refletir na listagem pública (Tarefa 2.4).  
**Depende de:** Tarefa 2.2 (navegação até a tela); Tarefa 2.5 (modelo de dados / contrato de persistência).
```

### Critérios de aceitação

- Cada tarefa-pai deve ter **critérios de aceitação** específicos daquela tarefa e **verificáveis** (comando, comportamento observável ou condição clara de conclusão).
- Nenhum critério de aceitação pode descrever resultado cuja responsabilidade seja de outra tarefa. Conferir se os critérios de aceitação estão atribuídos à tarefa que de fato os entrega.

## Formato detalhado de subtarefa (para modelos de IA menos capazes)

Ao gerar tarefas que serão executadas por modelos menos capazes, usar este **formato detalhado** para cada subtarefa:

```markdown
- [ ] X.Y.Z [Verbo de ação] [item específico]
  - **Arquivo**: `caminho/do/arquivo` (criar novo | alterar existente) — use extensão e pasta do stack do projeto
  - **O quê**: [Descrição detalhada do que criar ou alterar]
  - **Por quê**: [Contexto — por que é necessário e como encaixa no todo]
  - **Padrão**: [Onde espelhar no código existente — ex.: "Seguir o mesmo padrão de `src/.../modulo-similar`" ou "Conforme ADR/documentação do repo"]
  - **Verificação**: [Como confirmar — teste automatizado do projeto, checagem manual, build, ou critério observável acordado no PRD]
```

Quando o resultado desta subtarefa (ou tarefa) for consumido por outra, adicionar linha **Integração** para deixar o vínculo explícito:

- **Integração** (opcional): [Como esta saída é usada em outro lugar — ex.: "Resposta desta API consumida pela tela X (Tarefa N)"; "Artefato gerado lido pelo pipeline na Tarefa M"; "Tipos ou schema compartilhados entre camadas".]

### Exemplo: subtarefa ruim vs boa

❌ **Ruim** (vaga demais):
```markdown
- [ ] 1.1 Implementar autenticação
```

✅ **Boa** (explícita e contextualizada — adapte caminhos ao stack do projeto):
```markdown
- [ ] 1.1 Implementar fluxo de login com token de sessão
  - **Arquivo**: `src/auth/login` (criar novo ou alterar existente)
  - **O quê**: Validar credenciais, emitir sessão ou token conforme decisão de arquitetura do PRD, retornar erro claro em falha
  - **Por quê**: Desbloqueia telas e APIs que exigem usuário identificado
  - **Padrão**: Seguir o padrão de módulos existentes no repositório e a doc interna de segurança, se houver
  - **Verificação**: Suíte de testes do projeto passa (ou checklist manual: login ok, logout ok, sessão inválida rejeitada)
```

## Modelo de interação

O processo exige uma pausa após gerar as tarefas-pai para obter confirmação do usuário ("Ok, siga") antes de gerar as subtarefas detalhadas. Isso alinha o plano de alto nível às expectativas antes de entrar nos detalhes.

## Público-alvo

Assumir que o leitor principal da lista de tarefas é:
1. Um **desenvolvedor júnior** que implementará a funcionalidade
2. Um **modelo de IA menos capaz** que precisa de contexto explícito e passos de verificação

Ambos precisam de instruções claras e inequívocas, com contexto suficiente para entender não só *o quê* fazer, mas *por quê*.

## Modelos relacionados

- **Formato da lista de tarefas:** usar as seções **Formato de saída** e **Formato detalhado de subtarefa** deste mesmo arquivo — não há template externo no repositório.
- **Modelo de PRD**: [criar-prd.md](./criar-prd.md) — como criar PRDs
- **Durante a implementação**: [desenvolvimento.md](./desenvolvimento.md) — protocolo de uma subtarefa por vez e checklist
