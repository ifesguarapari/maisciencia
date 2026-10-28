---
description: Analisar consistência e qualidade dos artefatos sem modificar arquivos.
---

# Analisar a consistência

Leia [o protocolo comum](README.md), considere `$ARGUMENTS` e consulte
`before_analyze`. A análise é estritamente de leitura: não modifique qualquer
arquivo nem aplique correções, mesmo quando forem evidentes. Hooks e etapas
posteriores devem respeitar esse limite e a autorização vigente.

1. Execute `SPECIFY_FEATURE_NO_PERSIST=1 .specify/scripts/bash/check-prerequisites.sh --json --require-spec --require-tasks --include-tasks`.
   Exija `spec.md`, `plan.md` e `tasks.md`. Se faltar algum, informe a etapa
   correspondente; não produza análise parcial fingindo completude.
   A variável impede a persistência de `feature.json`, mantendo a análise
   inteiramente de leitura inclusive quando a seleção vier do ambiente.
2. Leia os trechos relevantes dos três artefatos e da constituição. Inventarie
   FR-###, SC-### que exijam trabalho implementável, histórias, cenários,
   decisões, tarefas, caminhos e dependências. Indicadores posteriores ao
   lançamento não devem virar tarefas de implementação sem justificativa.
3. Procure duplicações, ambiguidades, requisitos sem objeto ou medida,
   placeholders, contradições, deriva de terminologia, arquivos não definidos,
   dependências invertidas, ausência de testes pertinentes e tarefas sem
   relação com intenção. Confira cobertura por requisitos e histórias.
4. Violações da constituição são `CRITICAL`; não reduza ou reinterprete um
   princípio para fazer o plano passar. Requisitos centrais contraditórios ou
   não verificáveis são `HIGH`; lacunas secundárias, `MEDIUM`; redação, `LOW`.
5. Apresente no máximo cinquenta achados com ID estável, categoria, severidade,
   localização, resumo e recomendação; agrupe excesso. Inclua matriz de
   cobertura requisito → tarefas, tarefas sem intenção identificável,
   violações e métricas: requisitos, tarefas, cobertura e achados por tipo.
6. Se não houver achados, informe o resultado com contagens e limites reais.
   Caso haja problemas, indique a etapa que pode corrigi-los, sem executar
   essa correção dentro de `analyze` ou fabricar autorização de revisão.

Consulte `after_analyze` pelo protocolo comum respeitando o limite de leitura.
Relate próximos passos; não altere spec, plano, tarefas ou implementação.
