# Executar o fluxo SDD

Na raiz do repositório:

```bash
bash scripts/specify.sh bootstrap
bash scripts/specify.sh version
python3 scripts/validate-specs.py
python3 -m unittest discover -s tests -v
SPECIFY_FEATURE_DIRECTORY=specs/004-sdd-workflow bash .specify/scripts/bash/check-prerequisites.sh --json --require-spec --require-tasks --include-tasks
```

Use o [guia do projeto](../../docs/spec-driven-development.md) para conduzir
as etapas por leitura explícita dos comandos em `.specify/commands/`.
