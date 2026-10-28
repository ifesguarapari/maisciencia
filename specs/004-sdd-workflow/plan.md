# Plano: adoção do fluxo SDD

**Feature**: `004-sdd-workflow` | **Data**: 2026-10-27
**Especificação**: [spec.md](spec.md)

## Contexto técnico

- Spec Kit oficial `specify-cli==1.2.4`, instalado em ambiente Python isolado.
- Integração `generic`, comandos em `.specify/commands/`, scripts Bash oficiais.
- Python 3.11+ para bootstrap e validação estrutural; scripts próprios em inglês.
- Markdown em português do Brasil e modelos localizados, preservando marcadores
  técnicos e a semântica dos comandos oficiais.
- Repositório existente com código não consolidado em commit; scaffold gerado
  em `/tmp` e incorporado sem reescrever a aplicação ou os diretórios protegidos.

## Verificação da constituição

O fluxo mantém a arquitetura e as convenções existentes. As baselines são
retrospectivas, a evidência é qualificada e não há nova regra de aprovação
humana obrigatória para tarefas rotineiras. Segredos locais permanecem ignorados.

## Decisões

1. Preservar os scripts e registros oficiais gerados pela versão instalada.
2. Adaptar comandos e templates ao idioma do projeto, documentando essa camada.
3. Separar contexto permanente (`AGENTS.md`, constituição e arquitetura) dos
   contratos por funcionalidade (`specs/`).
4. Disponibilizar `scripts/specify.sh` para bootstrap e execução do CLI local.
5. Disponibilizar `scripts/validate-specs.py` com biblioteca padrão Python para
   verificar estrutura e referências. Essa ferramenta não aprova semântica,
   segurança, implementação ou checklists humanos.
6. Documentar as diferenças entre o artigo de 2025 e a versão atual do toolkit.

## Artefatos e rastreabilidade

| Requisito | Artefatos / verificação |
| --- | --- |
| FR-001 | `.specify/memory/constitution.md`, `AGENTS.md`, `docs/architecture.md` |
| FR-002 | `specs/*/spec.md`, `plan.md`, `tasks.md`, `verification.md` |
| FR-003 | `specs/001-platform-foundation/`, `002-web-sessions/`, `003-web-pwa/` |
| FR-004 | `.specify/commands/`, `.specify/templates/`, `CONTRIBUTING.md` |
| FR-005 | `.specify/requirements.txt`, `.specify/tooling.json`, `scripts/specify.sh` |
| FR-006 | `scripts/validate-specs.py` e verificação negativa em cópia temporária |
| FR-007 | `git diff`, inspeção dos caminhos e ausência de migração de dados |

## Validação

Executar o CLI local, os scripts oficiais de pré-requisitos, o validador próprio,
uma verificação negativa controlada e os checks existentes pertinentes à captura
da baseline. Registrar os resultados em `verification.md`, sem testes de rede
externa ou Docker inferidos a partir de arquivos de configuração.
