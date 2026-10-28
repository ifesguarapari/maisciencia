# Plano de implementação: [FEATURE]

**Diretório**: `specs/[###-feature-name]/` | **Data**: [DATE] | **Especificação**: [spec.md](spec.md)
**Branch, quando utilizada**: `[###-feature-name]`

## Resumo

[Relacionar o resultado definido na especificação à abordagem técnica escolhida. Este documento explica como implementar a intenção de spec.md.]

## Contexto técnico

**Linguagem e versão**: [Versões verificadas no repositório.]
**Dependências principais**: [Bibliotecas existentes e novas dependências justificadas.]
**Persistência**: [Armazenamento e responsabilidade pelos dados, ou não aplicável.]
**Validação**: [Testes e ferramentas adequados ao impacto da mudança.]
**Plataforma**: [Ambiente de execução.]
**Metas e restrições**: [Somente limites aceitos na especificação; usar NEEDS CLARIFICATION para uma decisão relevante sem resposta.]
**Escala e escopo**: [Dimensão conhecida; não inventar metas.]

## Verificação da constituição

[Conferir .specify/memory/constitution.md antes da pesquisa e depois do desenho. Relacionar os princípios aplicáveis, evidências de atendimento e desvios. Não inventar etapas de aprovação.]

| Princípio | Decisão e evidência | Pendência ou desvio |
|-----------|--------------------|--------------------|
| [Princípio aplicável] | [Atendimento] | [Nenhum ou justificativa] |

## Estrutura da funcionalidade

```text
specs/[###-feature-name]/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

[Indicar quais artefatos se aplicam. tasks.md é produzido por /speckit.tasks, não por /speckit.plan.]

### Código e testes

[Relacionar apenas caminhos reais do repositório afetados pela funcionalidade, com sua responsabilidade. Substituir exemplos e não impor uma nova estrutura.]

## Pesquisa e decisões

[Registrar em research.md as dúvidas resolvidas, decisão, justificativa e alternativas consideradas. Não deixar incerteza técnica relevante escondida.]

## Modelo e contratos

[Referenciar data-model.md e contracts/ quando aplicáveis. Cobrir dados, interfaces, erros, autorização e compatibilidade conforme a funcionalidade.]

## Validação planejada

[Referenciar quickstart.md com comandos executáveis, pré-condições, resultado esperado e limites do ambiente. Diferenciar teste planejado de evidência já obtida.]

## Complexidade e desvios

| Desvio ou complexidade | Necessidade concreta | Alternativa mais simples e motivo da rejeição |
|-----------------------|----------------------|---------------------------------------------|
| [Preencher somente quando aplicável] | [Motivo] | [Alternativa] |

## Contexto deste repositório

[Identificar o impacto no frontend Vite/Alpine/PWA, no gateway Kong, no BFF api/services/web e nos serviços Flask afetados. Respeitar os limites entre serviços e a responsabilidade pelos dados no MongoDB centralizado. Usar os caminhos reais, incluindo api/services/administrations.]

[Manter explicações Markdown em português do Brasil e identificadores, caminhos e código em inglês. Utilizar .env local ignorado pelo Git, sem .env.example. Aplicar Black e Pylint no Python e as verificações existentes de frontend e commits. Não inserir segredos nos artefatos.]

## Matriz de implementação e validação

| Requisito | História | Critério | Decisão, contrato e caminho afetado | Verificação planejada | Evidência existente ou pendência |
|-----------|----------|----------|------------------------------------|-----------------------|---------------------------------|
| FR-001 | US1 | SC-001 | [Arquivo e decisão] | [Comando ou teste] | [Executada ou ainda pendente] |

[Separar testes unitários de testes com MongoDB, Kong e serviços reais. Registrar impedimentos do ambiente sem apresentar simulações como execução ponta a ponta.]
