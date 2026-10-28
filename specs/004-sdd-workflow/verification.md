# Verificação: adoção de SDD

**Data**: 2026-10-27. Esta verificação registra execução local e inspeção;
não representa aprovação humana ou homologação de infraestrutura.

## Rastreabilidade

| Requisito | Evidência |
| --- | --- |
| FR-001 | Constituição, contexto arquitetural, guia, instruções de agente e features com IDs estáveis. |
| FR-002 | Tarefas e tabelas de verificação relacionam requisitos; contratos e fontes nas baselines. |
| FR-003 | Baselines 001, 002 e 003 identificadas como retrospectivas e com validações externas pendentes. |
| FR-004 | Dez comandos e modelos em pt-BR; convenções de idioma, `.env` e qualidade preservadas. |
| FR-005 | Instalação local isolada do CLI; `version` reportou 1.2.4 e `check` concluiu com sucesso. |
| FR-006 | Validador estrutural e nove testes positivos/negativos, incluindo requisito inexistente e artefato ausente. |
| FR-007 | Adoção incorporada ao repositório existente; diretórios protegidos e dados reais não alterados. A troca autorizada de nomes pertence à feature 005. |

## Comandos e alcance da evidência

| Comando ou inspeção | Resultado observado | Limite |
| --- | --- | --- |
| `bash scripts/specify.sh bootstrap` | CLI 1.2.4 instalado em `.specify/.venv/` | Requer acesso ao índice; primeira tentativa sem rede falhou e instalação com rede autorizada passou. |
| `bash scripts/specify.sh version` | Versão 1.2.4, Python 3.14.4 | Não executa etapas de desenvolvimento. |
| `bash scripts/specify.sh check` | CLI pronto; Codex CLI disponível | A integração configurada continua sendo genérica. |
| `SPECIFY_FEATURE_DIRECTORY=specs/004-sdd-workflow bash .specify/scripts/bash/check-prerequisites.sh --json --require-spec --require-tasks --include-tasks` | Feature e documentos reconhecidos | Confere pré-requisitos; não avalia requisitos. |
| `bash .specify/scripts/bash/resolve-template.sh spec-template --json` | Modelo local em português resolvido | Não preenche uma nova feature. |
| `python3 -m unittest discover -s tests -v` | Nove testes passaram | Fixtures do validador; sem aplicação, rede ou banco. |
| Black e Pylint nos dois arquivos Python da ferramenta | Passaram; Pylint 10/10 | Análise estática. |
| Metadados YAML dos dez comandos | Parsing e IDs de encaminhamento conferidos | Não comprova execução autônoma dos comandos pelo agente. |
| `git check-ignore` para ambiente Spec Kit, ponteiro e `.env` locais | Caminhos ignorados confirmados | Conteúdo dos segredos não integra o relatório. |

## Verificações finais

- `python3 scripts/validate-specs.py`: passou com cinco features, 42 requisitos
  e 39 tarefas. A contagem inclui a evolução nominal solicitada durante a adoção.
- Os seis scripts Bash foram comparados byte a byte com um scaffold novo do
  CLI 1.2.4: correspondência confirmada. `bash -n` passou nos seis e no wrapper.
- Em diretório temporário, `setup-plan.sh` preparou o plano localizado e
  `setup-tasks.sh` retornou o modelo localizado e os metadados. O segundo
  script não grava `tasks.md`; essa escrita pertence ao agente.
- No mesmo ambiente isolado, a seleção com `SPECIFY_FEATURE_NO_PERSIST=1`
  foi executada e não criou `feature.json`.
- Links locais foram conferidos em 19 documentos da raiz, guias, READMEs e
  comandos, sem destinos ausentes. Os links das features também passaram
  pelo validador estrutural.

Durante a conferência, selecionar apenas `SPECIFY_FEATURE` não resolveu o
diretório. Os exemplos foram corrigidos para `SPECIFY_FEATURE_DIRECTORY` e
o comando corrigido passou. A primeira fixture também pressupunha que
`setup-tasks.sh` gravasse tarefas; o teste foi corrigido conforme o comportamento
real do script e passou. Esses ajustes não alteraram a aplicação.

## Limitações

Não houve revisão humana dos artefatos. O CLI genérico não descobre comandos
nativos nem despacha workflows. MongoDB/Kong reais, instalação PWA e uso offline
em navegador permanecem pendentes nas baselines pertinentes. A aprovação da
estrutura não substitui análise semântica, testes de comportamento ou essas
verificações externas.
