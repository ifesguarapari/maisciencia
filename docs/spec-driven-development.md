# Desenvolvimento orientado por especificações

O projeto adota **Spec-Driven Development (SDD)** com GitHub Spec Kit e
especificações vivas. A intenção permanece em `spec.md` durante a manutenção;
o plano descreve a solução e as tarefas ligam execução e evidência. Essa escolha
corresponde ao nível *spec-anchored* discutido por
[Birgitta Böckeler](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html).

Os arquivos da aplicação continuam editáveis. Uma divergência de implementação
é corrigida conforme a especificação; mudanças de intenção exigem atualizar
primeiro os requisitos pertinentes. A adoção não comprova que o código anterior
foi produzido por SDD.

## Organização

| Local | Responsabilidade |
| --- | --- |
| `.specify/memory/constitution.md` | Princípios e decisões comuns |
| `docs/architecture.md` | Contexto arquitetural permanente |
| `.specify/commands/` | Instruções das etapas do Spec Kit, adaptadas ao projeto |
| `.specify/templates/overrides/` | Modelos locais de especificação, plano e tarefas |
| `specs/001-platform-foundation/` | Baseline retrospectiva da plataforma |
| `specs/002-web-sessions/` | Baseline retrospectiva de autenticação e BFF |
| `specs/003-web-pwa/` | Baseline retrospectiva do frontend e PWA |
| `specs/004-sdd-workflow/` | Adoção deste fluxo |
| `specs/005-domain-names/` | Evolução dos nomes solicitada durante a adoção |
| `specs/006-landing/` | Página institucional especificada antes da implementação |
| `specs/007-web-delivery/` | Integração contínua da web e artefato estático para GitHub Pages |

As baselines capturam o sistema existente e declaram suas lacunas. Sua existência
não representa aprovação humana ou testes de integração concluídos. A mudança
`005` foi especificada antes da renomeação; as baselines vivas apontam essa evolução.
A página `006` evolui a entrada pública descrita em `003`, com a exceção de
idioma autorizada e a rota provisória do futuro aplicativo. O inventário
retrospectivo permanece identificado, sem transformar a interface antiga
em requisito vigente da landing page.

## Preparar a ferramenta

Requer Python 3.11 ou superior e acesso ao índice de pacotes na instalação.
A versão adotada é `specify-cli==1.2.4`, isolada das dependências da aplicação:

```bash
bash scripts/specify.sh bootstrap
bash scripts/specify.sh version
bash scripts/specify.sh check
```

O ambiente `.specify/.venv/` é ignorado pelo Git. A configuração, os scripts e
os modelos são versionáveis. O scaffold veio do comando oficial abaixo,
executado em diretório temporário e depois adaptado para este projeto:

```bash
specify init /tmp/maisciencia-spec-kit-generated --integration generic --integration-options='--commands-dir .specify/commands' --script sh --ignore-agent-tools --non-interactive
```

A [integração genérica oficial](https://github.github.io/spec-kit/integrations/generic.html)
foi escolhida porque os diretórios de integração nativa deste ambiente são
protegidos. Ela não acrescenta descoberta de slash commands nem despacho de
workflows pelo CLI. O agente deve ler explicitamente o arquivo da etapa.
Os scripts Bash oficiais foram preservados; os comandos e modelos Markdown
foram localizados e adaptados, conforme `.specify/tooling.json`.

## Conduzir uma mudança

1. Leia constituição, arquitetura e especificação afetada. Escolha evoluir a
   especificação viva ou criar uma nova feature e registre a decisão.
2. Use `speckit.specify.md` para definir objetivo, histórias, requisitos `FR-###`,
   critérios `SC-###` e cenários verificáveis. Resolva dúvidas materiais com
   `speckit.clarify.md`; registre pressupostos rotineiros.
3. Use `speckit.plan.md` para escolher solução, dados, contratos e validação.
4. Use `speckit.tasks.md` para ordenar tarefas `T###`, indicando história `US#`,
   requisitos, arquivos e evidência esperada.
5. Use `speckit.analyze.md` para verificar coerência sem modificar arquivos.
6. Use `speckit.implement.md` para implementar e verificar as tarefas autorizadas.
7. Use `speckit.converge.md` para confrontar o resultado com a intenção. Essa
   etapa apenas acrescenta tarefas de lacunas; não altera código ou requisitos.

Exemplo de solicitação nesta integração:

```text
Leia .specify/commands/speckit.specify.md e especifique o cadastro de oficinas.
Leia .specify/commands/speckit.plan.md para a feature selecionada.
```

Para selecionar uma feature nos scripts oficiais, sem depender da branch:

```bash
SPECIFY_FEATURE_DIRECTORY=specs/005-domain-names bash .specify/scripts/bash/check-prerequisites.sh --json --require-spec --require-tasks --include-tasks
```

O ponteiro `.specify/feature.json` é local e ignorado. Uma branch e uma feature
são conceitos independentes nesta versão. Nenhuma extensão Git foi instalada;
o fluxo não cria commits ou branches automaticamente.

## Rastreabilidade e verificação

Cada feature mantém `spec.md`, `plan.md`, `tasks.md` e `verification.md`.
Adicione `research.md`, `data-model.md`, `quickstart.md` e `contracts/` conforme
a solução exigir. Requisitos devem aparecer nas tarefas e na verificação.

```bash
python3 scripts/validate-specs.py
python3 -m unittest discover -s tests -v
```

O validador confere estrutura, IDs, referências e links locais. Ele não comprova
qualidade semântica ou atendimento do comportamento. Complete os checks de
[CONTRIBUTING.md](../CONTRIBUTING.md) conforme o impacto e registre comando,
resultado e limitações em `verification.md`.

Testes com mocks não comprovam RBAC MongoDB real; inspeção de Compose não
comprova containers em execução; build PWA não comprova instalação ou offline
em navegador. Checklists de revisão humana permanecem sem aprovação até sua
realização. Autorizações já dadas pelo usuário continuam válidas.

## Atualizar o Spec Kit

Atualize a versão em `.specify/requirements.txt` e `.specify/tooling.json` de
forma deliberada. Gere a nova versão fora do projeto, compare scripts, comandos,
modelos e metadados e reconcilie as adaptações em português. Execute os checks
novamente e registre a atualização em uma especificação ou plano pertinente.

Referências: [Spec Kit](https://github.com/github/spec-kit),
[adoção em projetos existentes](https://github.github.io/spec-kit/guides/existing-projects.html)
e [persistência das especificações](https://github.github.io/spec-kit/concepts/spec-persistence.html).
