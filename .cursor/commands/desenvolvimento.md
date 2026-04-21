# Gestão de lista de tarefas

Diretrizes para gerenciar listas de tarefas em arquivos Markdown e acompanhar o progresso na conclusão de um PRD. As listas costumam ser geradas a partir de um PRD com [gerar-tasks.md](./gerar-tasks.md); o PRD segue o fluxo de [criar-prd.md](./criar-prd.md).

## Implementação de tarefas
- **Uma subtarefa por vez:** NÃO iniciar a próxima subtarefa até pedir permissão ao usuário e ele responder "sim" ou "y"
- **Protocolo de conclusão:**  
  1. Ao terminar uma **subtarefa**, marcar imediatamente como concluída trocando `[ ]` por `[x]`.  
  2. Se **todas** as subtarefas sob uma tarefa-pai estiverem `[x]`, marcar também a **tarefa-pai** como concluída.  
- Parar após cada subtarefa e aguardar o sinal verde do usuário.

## Manutenção da lista de tarefas

1. **Atualizar a lista conforme o trabalho avança:**
   - Marcar tarefas e subtarefas como concluídas (`[x]`) conforme o protocolo acima.
   - Adicionar novas tarefas à medida que surgirem.

2. **Manter a seção "Arquivos relevantes":**
   - Listar todo arquivo criado ou modificado.
   - Dar a cada arquivo uma linha descrevendo sua finalidade.

## Instruções para a IA

Ao trabalhar com listas de tarefas, a IA deve:

1. Atualizar regularmente o arquivo da lista após concluir trabalho relevante.
2. Seguir o protocolo de conclusão:
   - Marcar cada **subtarefa** finalizada como `[x]`.
   - Marcar a **tarefa-pai** como `[x]` quando **todas** as subtarefas estiverem `[x]`.
3. Adicionar tarefas recém-descobertas.
4. Manter "Arquivos relevantes" preciso e atualizado.
5. Antes de começar, verificar qual é a próxima subtarefa.
6. Após implementar uma subtarefa, atualizar o arquivo e então pausar para aprovação do usuário.

## Qualidade de código ao implementar

Ao escrever ou alterar código durante as tarefas, seguir **`.cursor/rules/qualidade-codigo.mdc`** (princípios gerais). Para **frontend** (Next.js, React, Tailwind, componentes), seguir também **`.cursor/rules/boas-praticas-frontend.mdc`** quando existir no projeto.
