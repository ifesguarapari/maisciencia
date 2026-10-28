# Especificação: nomes dos domínios

**Feature**: `005-domain-names` | **Data**: 2026-10-27
**Origem**: solicitação de simplificar os nomes dos conceitos durante a adoção de SDD.

## Histórias e aceitação

### US1 — Identificar conceitos com nomes simples (P1)

Como mantenedor, quero usar os nomes solicitados de forma consistente para
encontrar um domínio sem traduzir identidades diferentes entre as camadas.

- Dada a API de administração, quando consulto sua saúde, então a identidade
  e o prefixo público usam `administrations`.
- Dado um conceito renomeado, quando consulto código, configuração e contratos,
  então encontro o mesmo nome em suas referências atuais.

### US2 — Preservar dados e configuração na atualização (P1)

Como operador, quero distinguir instalações novas de bancos existentes para
adotar os nomes sem perder dados, índices ou senhas locais.

- Dado um ambiente novo, quando inicializo os dados, então somente os nomes
  novos são preparados.
- Dado um banco existente, quando examino a migração, então posso identificar
  conflitos antes de aplicar mudanças explicitamente.
- Dada uma configuração local, quando sua chave muda de nome, então seu valor
  é preservado e continua fora do Git.

## Requisitos

- **FR-001**: O domínio antes identificado por `school-management` DEVE usar
  `administrations` na pasta, identidade de execução, HTTP, usuário de dados,
  variáveis específicas e referências dos consumidores.
- **FR-002**: As coleções DEVEM adotar o mapeamento abaixo em inicialização,
  permissões, declarações dos serviços e documentação.
- **FR-003**: A mudança DEVE preservar os valores locais de configuração e
  manter segredos fora de arquivos versionáveis e saídas de verificação.
- **FR-004**: A migração de dados existentes DEVE ser explícita, oferecer
  inspeção sem mutações por padrão e recusar conflitos sem sobrescrever dados.
- **FR-005**: Contratos, testes e especificações vivas DEVEM refletir os novos
  nomes, distinguindo a evidência local da integração com banco real.

| Nome anterior | Nome atual |
| --- | --- |
| `school-management` / `school_management` | `administrations` |
| `progress_records` | `records` |
| `attendance_records` | `attendances` |
| `institutional_information` | `informations` |
| `account_recoveries` | `recoveries` |
| `ai_runs` | `pipelines` |
| `ai_usage` | `agents` |

## Critérios de sucesso

- **SC-001**: As oito identidades de serviço, incluindo `administrations`,
  permanecem distintas e os testes usam o prefixo novo.
- **SC-002**: Os sete mapeamentos aparecem coerentemente nas configurações e
  contratos atuais; os nomes anteriores ficam restritos ao histórico e à migração.
- **SC-003**: A migração recusa colisões e sua inspeção padrão não altera o banco.
- **SC-004**: Os checks executados e a ausência de migração real são registrados.

## Premissas e limites

A pasta `management` também passa a `administrations` para unificar a identidade.
O prefixo antigo deixa de ser publicado; esta é uma mudança incompatível de
contrato autorizada pelo pedido de renomeação. Os consumidores devem atualizar
suas URLs. `pipelines` e `agents` são nomes de coleções reservadas: a troca não
implementa fluxos de IA nem transforma dados existentes em novos modelos.

A migração não será executada contra um banco real nesta entrega. As baselines
vivas serão atualizadas e apontarão esta alteração para preservar sua origem.
