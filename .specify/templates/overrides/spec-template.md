# Especificação da funcionalidade: [FEATURE NAME]

**Diretório da funcionalidade**: `specs/[###-feature-name]/`
**Branch, quando utilizada**: `[###-feature-name]`
**Criação**: [DATE]
**Estado**: Rascunho
**Solicitação**: "$ARGUMENTS"

## Objetivo e escopo

[Problema, pessoas atendidas, resultado esperado, limites e exclusões. Descrever o que deve acontecer e por quê; decisões de implementação pertencem ao plano.]

## Cenários de uso e aceitação

<!-- Priorizar histórias que entreguem valor e possam ser verificadas de forma independente. Remover exemplos sem aplicação. Usar identificadores estáveis US1, US2 etc. -->

### US1 — [Título da história] (Prioridade: P1)

[Descrever a jornada e o valor entregue.]

**Justificativa da prioridade**: [Motivo.]
**Verificação independente**: [Ação observável e resultado que demonstram a história isoladamente.]

**Cenários de aceitação**:

1. **Dado** [estado inicial], **quando** [ação], **então** [resultado observável].
2. **Dado** [condição de erro], **quando** [ação], **então** [comportamento esperado].

### US2 — [Título da história] (Prioridade: P2)

[Jornada, justificativa, verificação independente e cenários; remover se não houver uma segunda história.]

### Casos de borda

- [Condição de limite, falha ou conflito e resposta esperada.]

## Requisitos

### Requisitos funcionais

- **FR-001**: O sistema DEVE [comportamento específico e verificável].
- **FR-002**: O sistema DEVE [comportamento associado a uma história].

<!-- Quando uma decisão relevante não tiver resposta nem padrão razoável, usar [NEEDS CLARIFICATION: pergunta específica]. No máximo três marcadores por especificação inicial. -->

### Entidades principais

- **[Entity]**: [Significado, atributos e relações relevantes ao negócio, sem impor estrutura de código ou banco. Remover a seção quando não houver dados.]

## Critérios de sucesso

- **SC-001**: [Resultado mensurável para usuários ou negócio, verificável e independente da tecnologia.]
- **SC-002**: [Outro resultado mensurável, quando necessário.]

## Premissas e dependências

- [Premissa adotada, sua justificativa e dependência externa, quando houver.]

## Questões em aberto

- [Decisão pendente, impacto e responsável ou origem da informação; escrever "Nenhuma" quando resolvida.]

## Rastreabilidade da intenção

| Requisito | História | Critério de sucesso | Evidência de aceitação esperada |
|-----------|----------|---------------------|--------------------------------|
| FR-001 | US1 | SC-001 | [Comportamento observável; detalhes técnicos ficam no plano.] |

## Evolução e situação inicial

[Informar se é uma nova funcionalidade ou a documentação retrospectiva de comportamento existente. Na situação retrospectiva, apontar o código e a evidência observada, distinguindo o que existe, o que falta e o que ainda não foi verificado. Não alegar que a implementação anterior nasceu desta especificação.]

[Em mudanças posteriores, preservar IDs e atualizar primeiro a intenção; reconciliar plano, tarefas, contratos e validação. Decisões aceitas da constituição continuam aplicáveis.]
