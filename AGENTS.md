# Instruções do projeto

## Desenvolvimento orientado por especificações

Este repositório usa Spec-Driven Development (SDD) com GitHub Spec Kit.
Antes de modificar comportamento, leia `.specify/memory/constitution.md`,
`docs/spec-driven-development.md`, `docs/architecture.md` e a especificação
da funcionalidade afetada em `specs/`.

A especificação descreve intenção e comportamento; `plan.md` registra a
solução técnica; `tasks.md` organiza execução e evidências. Atualize esses
artefatos junto com contratos e testes quando a intenção mudar. Corrija
desvios de implementação sem reescrever o requisito para justificar o erro.

As baselines `001`, `002` e `003` são reconstruções retrospectivas do sistema
existente. Elas não provam que o código original foi desenvolvido por SDD.
Novas mudanças seguem o fluxo do Spec Kit e podem usar uma nova pasta ou
evoluir a especificação viva pertinente, registrando a decisão.

## Integração do agente

Os comandos oficiais adaptados ao projeto ficam em `.specify/commands/`.
Na integração genérica, leia explicitamente o arquivo do comando solicitado:
por exemplo, `.specify/commands/speckit.specify.md`. Não presuma descoberta
automática de slash commands ou execução de workflows pelo CLI.

Respeite as autorizações já dadas pelo usuário. Resolva escolhas rotineiras
e registre pressupostos; peça esclarecimento quando faltar uma decisão
material. Não invente aprovação humana, resultado de teste ou homologação.
Checklists de revisão humana não podem ser aprovados automaticamente.

## Convenções preservadas

- Explique os arquivos Markdown em português do Brasil.
- Use inglês em caminhos, código, identificadores e comentários. A interface
  permanece em inglês por padrão; a página institucional e `/login` provisório
  usam português do Brasil por solicitação específica de `006-landing`.
- Use `.env` local, ignorado pelo Git; preserve os valores existentes.
- Mantenha Black e Pylint na API e ESLint no frontend, além de Commitizen.
- Use nomes simples e consistentes para os conceitos. O domínio `administrations`
  usa a mesma identidade na pasta, no HTTP e no MongoDB. O histórico e a migração
  dos nomes estão em `specs/005-domain-names/`.
- O BFF em `api/services/web` acessa sessões pelo serviço `authentication`.
  O banco da aplicação é centralizado; cada domínio tem responsabilidade
  definida sobre seus dados.

## Verificação

Execute `python3 scripts/validate-specs.py` para a estrutura e rastreabilidade
dos artefatos. Essa verificação não substitui análise semântica, testes de
comportamento ou revisão humana. Use os comandos de qualidade de
`CONTRIBUTING.md` conforme o impacto da mudança e registre as limitações
reais em `verification.md`. Não marque Docker, MongoDB real ou navegador
como verificados com base apenas em mocks ou inspeção de configuração.
