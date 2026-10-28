# Especificação: fluxo de desenvolvimento orientado por especificações

**Feature**: `004-sdd-workflow` | **Data**: 2026-10-27
**Estado**: adoção solicitada; verificação em `verification.md`.

Esta especificação descreve a alteração de processo desta entrega. As
baselines `001` a `003` registram retrospectivamente o sistema existente.

## Histórias e aceitação

### US1 — Desenvolver com intenção rastreável (P1)

Como colaborador, quero relacionar intenção, solução e tarefas para avaliar
uma alteração antes de implementar e manter seus artefatos coerentes.

- Dada uma funcionalidade, quando a planejo, então encontro uma especificação,
  um plano e tarefas com requisitos e caminhos identificáveis.
- Dada uma mudança de intenção, quando atualizo os artefatos, então consigo
  identificar os contratos e testes afetados sem substituir a intenção pelo código.

### US2 — Conhecer o alcance da evidência existente (P1)

Como mantenedor, quero distinguir o comportamento inventariado das verificações
executadas para priorizar as lacunas reais de validação.

- Dada uma baseline, quando consulto sua verificação, então encontro fontes,
  testes, resultados conhecidos e verificações pendentes.

### US3 — Usar o processo no ambiente disponível (P2)

Como colaborador, quero preparar as ferramentas e encontrar as instruções sem
alterar configurações protegidas ou misturar dependências com a aplicação.

- Dada a instalação local, quando consulto a versão, então encontro a versão
  fixada para o projeto e a integração efetivamente configurada.
- Dada a integração genérica, quando solicito uma etapa ao agente, então ele
  lê o arquivo correspondente sem prometer descoberta nativa de comandos.

## Requisitos

- **FR-001**: O projeto deve manter princípios comuns, contexto arquitetural e
  especificações vivas com requisitos e critérios de aceitação identificáveis.
- **FR-002**: Cada funcionalidade deve relacionar requisitos, tarefas, contratos,
  fontes e verificação, distinguindo evidência de aprovação humana.
- **FR-003**: A adoção deve registrar as três baselines retrospectivas sem
  declarar funcionalidades futuras como implementadas.
- **FR-004**: As instruções e modelos devem respeitar os padrões de idioma,
  configuração local e qualidade já acordados.
- **FR-005**: A ferramenta de processo deve ter versão fixada e instalação
  isolada, com instruções reproduzíveis para o ambiente do projeto.
- **FR-006**: Deve ser possível detectar automaticamente artefatos essenciais
  ausentes, identificadores duplicados e referências de rastreabilidade inválidas.
- **FR-007**: O fluxo deve preservar o código, as configurações locais e as
  autorizações existentes durante a adoção.

## Critérios de sucesso

- **SC-001**: As três baselines e a especificação desta adoção possuem os
  artefatos exigidos e requisitos relacionados a tarefas e verificação.
- **SC-002**: A verificação estrutural aceita os artefatos entregues e rejeita
  uma referência inexistente em uma cópia de teste.
- **SC-003**: O CLI reporta a versão fixada e o script oficial reconhece a
  funcionalidade selecionada com seu plano e suas tarefas.
- **SC-004**: Os documentos separam verificações executadas, inspeções e
  verificações ainda pendentes, sem atribuir homologação humana.

## Limites e pressupostos

Esta feature adapta o processo. A renomeação solicitada durante a adoção está
especificada separadamente em `005-domain-names`, que autoriza a troca de rotas.
A integração genérica exige leitura explícita dos comandos pelo agente.
Ela não acrescenta descoberta nativa nem despacho de workflows pelo CLI.
Homologação Docker/MongoDB real e navegador continua distinta dos checks locais.
