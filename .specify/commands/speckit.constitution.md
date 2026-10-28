---
description: Criar ou atualizar os princípios e a governança do projeto.
handoffs:
  - label: Especificar funcionalidade
    agent: speckit.specify
    prompt: Especificar a funcionalidade conforme a constituição atualizada.
---

# Atualizar a constituição

Leia [o protocolo comum](README.md), considere `$ARGUMENTS` e execute
`before_constitution`.

O trabalho próprio desta etapa se limita a `.specify/memory/constitution.md`.
Separe intenções de implementação ou publicação e apresente-as como próximos
passos; não execute essas intenções dentro de `constitution`.

1. Execute `.specify/scripts/bash/resolve-template.sh constitution-template --json`
   e use `TEMPLATE_CONTENT`, considerando todas as camadas resolvidas. Falha
   de resolução exige informar o erro, sem usar silenciosamente modelo parcial.
2. Leia a constituição existente e preserve decisões aplicáveis. Derive os
   valores da solicitação e do contexto; não invente princípios aprovados,
   datas de adoção ou homologação. Identifique placeholders pendentes.
3. Ajuste a quantidade de princípios à necessidade expressa. Registre regras
   claras, justificativas necessárias, governança e procedimento de alteração.
4. Aplique versão semântica: mudança incompatível de princípios, major;
   nova regra ou ampliação material, minor; esclarecimento semântico neutro,
   patch. Preserve a data original de adoção e use a data real da emenda.
5. Registre o impacto de sincronização em comentário HTML temporário, com
   versão anterior/nova, princípios alterados, seções e pendências. O comentário
   auxilia revisão e pode ser removido antes de um commit; não é governança.
6. Confira versão, datas ISO, regras verificáveis e ausência de placeholders
   inexplicados. Não edite modelos ou comandos nesta etapa: eles leem a
   constituição; informe separadamente qualquer ajuste necessário.

Execute `after_constitution`. Informe versão, motivo, pendências e as intenções
adiadas com etapas sugeridas, sem dispará-las automaticamente.
