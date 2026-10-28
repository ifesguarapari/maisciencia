# Plano: base da plataforma

**Identificador**: `001-platform-foundation` | **Data**: 2026-10-27  
**Especificação**: [spec.md](spec.md)

## Resumo

Consolidar a arquitetura existente como baseline rastreável. Esta adoção
produz especificações e contratos do estado observado; não reimplementa os
serviços nem transforma funcionalidades futuras em entregas concluídas.

## Contexto técnico

| Aspecto | Decisão observada |
| --- | --- |
| Linguagens | Python 3.11+; JavaScript com Node.js 24+ no frontend. |
| Serviços | Flask; sete factories com infraestrutura comum e um BFF independente. |
| Execução | Gunicorn, dois workers por imagem, sem preload da aplicação. |
| Gateway | Kong DB-less, rotas declarativas e CORS com origens explícitas. |
| Dados | Um banco MongoDB da aplicação; sete usuários com roles por coleção. |
| Dependências | Poetry e lockfile próprios por serviço; pacote local `maisciencia-common`. |
| Testes | `unittest`, cliente Flask e persistência simulada nos testes de sessão. |
| Qualidade | Black e Pylint na API; ESLint e build Vite no web; Commitizen. |
| Plataforma alvo | Linux/Bash e Docker Compose 2.24+. |
| Desempenho | Não há SLO ou capacidade sob carga comprovados nesta baseline. |
| Escopo | Oito serviços, gateway e banco; dez containers declarados. |

## Verificação da constituição

A verificação se refere à baseline documentada; a consolidação da
[constituição](../../.specify/memory/constitution.md) é responsabilidade da adoção.

| Princípio | Tratamento e evidência |
| --- | --- |
| Especificações mantidas | Requisitos, contratos, tarefas e evidências permanecem em `specs/`. |
| Limites de serviço | `contracts/platform.yaml` identifica oito capacidades e seus responsáveis. |
| Banco central e BFF | Sete usuários de dados; BFF sem cliente MongoDB. |
| Idioma | Documentos em PT-BR; caminhos, código e contrato YAML em inglês. |
| Qualidade verificável | Testes existentes são rastreados; execução atual fica em `verification.md`. |
| Configuração local | `.env` permanece local; valores não são copiados para as especificações. |

## Estrutura do projeto

```text
api/common/                 Shared Flask and MongoDB initialization
api/services/administrations/    Administration service implementation
api/services/authentication/ Identity and session owner
api/services/web/           Browser backend without database access
api/services/               Other independent domain services
api/gateway/kong.yaml       Public routing and CORS
api/mongo/init-services.js  Initial collections, roles, users, and indexes
api/compose.yaml            Ten-container local topology
api/tests/                  Existing runtime and session tests
web/                        Vite frontend and PWA
specs/001-platform-foundation/ Baseline artifacts and platform contract
docs/architecture.md        Permanent architectural context
```

## Sequência de adoção

1. Capturar limites e decisões em [research.md](research.md) e [data-model.md](data-model.md).
2. Registrar identidades, saúde e responsabilidades no [contrato](contracts/platform.yaml).
3. Relacionar FR, fontes e testes em [verification.md](verification.md).
4. Executar os checks locais adequados e anexar resultados reais.
5. Manter pendentes os testes com gateway, banco e permissões reais até sua execução.

Não há violação arquitetural nova proposta por esta baseline. O banco
compartilhado mantém dependência de capacidade e disponibilidade entre domínios;
separar os processos não elimina esse vínculo.
