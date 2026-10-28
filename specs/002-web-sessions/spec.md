# Especificação: identidade e sessões web

**Feature**: `002-web-sessions`  
**Data de captura**: 2026-10-27  
**Estado**: baseline retrospectiva do comportamento existente; revisão humana e homologação não registradas.  
**Origem**: solicitação de adotar Spec-Driven Development no sistema existente.

Esta especificação descreve comportamento observado no código. Ela não afirma
que o desenvolvimento anterior foi orientado por especificações. Daqui em
diante, alterações de intenção devem atualizar este contrato antes da
implementação e reconciliar plano, tarefas, contratos e verificações.

## Cenários de usuário e verificação

### US1 — Entrar e recuperar a sessão (prioridade P1)

Uma pessoa com conta ativa provisionada pela administração entra na aplicação
e recupera sua identidade ao recarregar a página.

**Motivo da prioridade**: estabelecer identidade é pré-requisito dos futuros
fluxos autenticados. **Teste independente**: executar login e consulta da sessão
com uma conta de teste e inspecionar a resposta pública e o cookie.

**Cenários de aceitação**:

1. Dada uma conta ativa e credenciais corretas, quando o navegador entra por
   uma origem permitida, então recebe sua identidade e uma sessão utilizável.
2. Dadas credenciais incorretas ou conta inexistente, quando há uma tentativa
   de entrada, então a resposta não distingue a existência da conta.
3. Dada uma sessão válida, quando a página consulta sua sessão, então recebe
   identidade, token CSRF e expiração, sem o identificador privado da sessão.

### US2 — Encerrar, renovar e expirar a sessão (prioridade P1)

A pessoa encerra o acesso, renova o identificador da sessão e perde o acesso
quando os prazos configurados vencem ou sua conta é desativada.

**Motivo da prioridade**: identidade deve ter um ciclo de vida controlável.
**Teste independente**: criar uma sessão e testar revogação, rotação e relógio
controlado sem depender da limpeza automática de registros.

**Cenários de aceitação**:

1. Dada uma sessão e prova CSRF válidas, quando há saída, então o servidor
   revoga a sessão antes de remover o cookie e rejeita seu identificador antigo.
2. Dada uma sessão válida, quando seu identificador é renovado, então o novo
   funciona, o anterior falha e o prazo absoluto original permanece igual.
3. Dado prazo absoluto ou de inatividade vencido, quando há consulta, então a
   sessão falha mesmo que o registro ainda exista no armazenamento.
4. Dada rotação concorrente com a saída, quando a revogação é confirmada,
   então a rotação não mantém a mesma sessão utilizável.

### US3 — Respeitar fronteiras e falhas (prioridade P2)

O navegador recebe respostas controladas e o operador distingue falhas de
dependência da saúde do processo web.

**Motivo da prioridade**: preservar o contrato durante entradas inválidas e
indisponibilidade. **Teste independente**: simular origens, conteúdo e respostas
inválidos, além de uma dependência indisponível.

**Cenários de aceitação**:

1. Dada origem ausente ou não permitida, quando há operação que altera estado,
   então a operação é rejeitada; sem a prova CSRF correta, saída e renovação falham.
2. Dada dependência indisponível, quando o navegador tenta sair, então recebe
   indisponibilidade e mantém o cookie, sem confirmação falsa de encerramento.
3. Dada chamada interna sem credencial de serviço válida, quando se tenta
   gerenciar uma sessão, então a chamada é rejeitada.
4. Dado um domínio indisponível, quando o painel consulta a saúde agregada,
   então os estados dos demais domínios continuam identificáveis.

## Requisitos funcionais

- **FR-001**: O sistema DEVE permitir entrada de conta ativa provisionada pela
  administração e rejeitar credenciais inválidas com resposta uniforme.
- **FR-002**: O navegador DEVE receber o identificador privado somente por
  cookie protegido contra leitura por JavaScript; a visão pública DEVE omiti-lo.
- **FR-003**: A consulta de sessão válida DEVE retornar identidade, prova CSRF
  e expiração, atualizando a atividade sem prorrogar o prazo absoluto.
- **FR-004**: Sessões vencidas, desconhecidas, revogadas ou de contas
  desativadas DEVEM ser rejeitadas independentemente da limpeza de registros.
- **FR-005**: A renovação DEVE invalidar o identificador anterior e preservar
  a identidade, a prova CSRF e a expiração absoluta da sessão.
- **FR-006**: A saída confirmada DEVE revogar a sessão no servidor antes de
  remover o cookie, inclusive quando houver rotação concorrente.
- **FR-007**: Operações de alteração DEVERÃO exigir origem explicitamente
  permitida e conteúdo JSON; saída e renovação exigirão prova CSRF da sessão.
- **FR-008**: Somente chamadores internos autenticados DEVERÃO acessar a
  administração interna de sessões.
- **FR-009**: Falhas de rede, dependência ou formato inesperado DEVERÃO falhar
  de forma controlada, sem expor credenciais nem indicar uma saída não confirmada.
- **FR-010**: Respostas públicas do backend web DEVERÃO impedir armazenamento
  em cache; o frontend não deverá persistir o identificador em `localStorage`.
- **FR-011**: O serviço web DEVE manter saúde própria sem conexão direta ao
  banco e agregar a saúde dos oito processos por destinos definidos pelo operador.
- **FR-012**: A administração DEVE poder preparar os índices e criar contas
  com senha oculta e armazenamento protegido, sem cadastro público ou conta padrão.

## Critérios de sucesso

- **SC-001**: Login e consulta válidos satisfazem FR-001–FR-003 e o contrato
  público, sem `session_token` ou hash de senha no corpo JSON.
- **SC-002**: Os cenários de expiração, desativação, rotação e revogação
  rejeitam os identificadores que deixaram de ser válidos.
- **SC-003**: Casos de origem, CSRF, credencial interna e dependência inválidos
  produzem os estados definidos nos contratos, preservando os limites de exposição.
- **SC-004**: Cada requisito tem fonte e verificação identificadas em
  [verification.md](verification.md), separando observação de execução e homologação.

## Entidades e limites

Conta, sessão, visão pública e estado de serviço estão detalhados em
[data-model.md](data-model.md). Recuperação de conta, cadastro público,
autorização das futuras regras de negócio, mensagens e integrações de IA não
fazem parte deste comportamento implementado. Limites de capacidade e SLA
de produção não foram definidos nem medidos nesta baseline.

## Premissas

Contas são criadas pela ferramenta administrativa. O operador configura as
origens permitidas e usa HTTPS no ambiente publicado. A evidência existente
inclui testes com clientes Flask e armazenamento simulado; isso não comprova
execução completa com Kong, MongoDB real ou navegador de produção.
