# Checklist de [CHECKLIST TYPE]: [FEATURE NAME]

**Objetivo**: [Qualidade dos requisitos que será avaliada.]
**Criação**: [DATE]
**Funcionalidade**: [Link para spec.md.]
**Responsabilidade**: Revisão dos requisitos pelo revisor.

`[x]` significa que o revisor avaliou e considerou satisfeito o critério de qualidade dos requisitos. Não significa conclusão da implementação. `/speckit.checklist` gera itens em aberto; `/speckit.implement` somente consulta os marcadores.

<!-- Substituir todos os exemplos por perguntas específicas sobre clareza, completude, consistência, verificabilidade e cobertura dos requisitos. Não criar uma lista de testes da aplicação. -->

## Completude e clareza

- [ ] CHK001 [Pergunta verificável sobre a definição do requisito.] [Spec §FR-001]
- [ ] CHK002 [Pergunta sobre critérios mensuráveis ou uma ambiguidade.] [Spec §SC-001]

## Consistência e casos de borda

- [ ] CHK003 [Pergunta sobre coerência entre cenários e requisitos.] [Spec §US1]
- [ ] CHK004 [Pergunta sobre falha, dependência ou situação de limite.] [Gap]

## Observações

- Manter itens pendentes quando precisarem de esclarecimento, correção ou avaliação do revisor.
- Preservar IDs `CHK###` únicos e sequenciais ao acrescentar itens.
- Registrar achados e referências junto ao item correspondente.
- `checklists/requirements.md` tem ciclo próprio, mantido por `/speckit.specify` e `/speckit.clarify`; essa exceção não se aplica aos checklists personalizados.
