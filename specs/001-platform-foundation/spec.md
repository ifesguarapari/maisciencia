# Especificação: base da plataforma

**Identificador da feature**: `001-platform-foundation`  
**Captura**: 2026-10-27  
**Estado**: baseline retrospectiva em revisão, com validações de integração pendentes  
**Entrada**: adotar SDD e Spec Kit na arquitetura existente do Mais Ciência na Escola.

Esta especificação registra comportamentos observados no repositório antes da
adoção de SDD. Ela não afirma que o código foi produzido a partir de uma spec,
que uma branch foi criada ou que houve aprovação humana dos artefatos.
Mudanças futuras deverão atualizar a intenção, os contratos e sua verificação.

## Cenários de usuário e testes

### US1 — Operar capacidades independentes (prioridade P1)

Como responsável pela operação, quero identificar e publicar cada capacidade
separadamente, para alterar um domínio sem reiniciar os demais.

**Motivo da prioridade**: estabelece os limites usados pelas outras features.
**Teste independente**: iniciar os serviços e consultar suas identidades; parar
um domínio e consultar os processos restantes.

**Cenários de aceitação**:

1. **Dado** um ambiente configurado, **quando** os serviços forem iniciados,
   **então** oito identidades distintas deverão responder por seus pontos de saúde.
2. **Dado** um domínio indisponível, **quando** outro processo saudável for
   consultado, **então** sua identidade e disponibilidade deverão ser preservadas.
3. **Dada** uma chamada pública válida, **quando** seu prefixo for reconhecido,
   **então** ela deverá alcançar somente a capacidade correspondente.

### US2 — Compartilhar dados com limites de acesso (prioridade P1)

Como responsável pelos dados, quero manter uma fonte central com permissões
por domínio, para preservar a responsabilidade de cada capacidade.

**Motivo da prioridade**: processos separados precisam de limites de dados explícitos.
**Teste independente**: para cada usuário de serviço, realizar uma operação
permitida e uma operação em coleção de outro responsável; inspecionar o BFF.

**Cenários de aceitação**:

1. **Dadas** as credenciais de um domínio, **quando** ele acessar suas coleções,
   **então** as operações concedidas deverão ser autorizadas.
2. **Dadas** as mesmas credenciais, **quando** ele acessar dados fora do escopo,
   **então** a operação deverá ser recusada pelo controle de acesso.
3. **Dado** o backend do navegador, **quando** ele resolver identidade ou sessão,
   **então** deverá consultar o serviço responsável sem acessar o banco diretamente.

### US3 — Distinguir falhas de processo e dependência (prioridade P2)

Como responsável pela operação, quero distinguir um processo ativo de uma
dependência indisponível, para localizar falhas sem expor credenciais.

**Teste independente**: consultar a saúde de uma API com banco indisponível.

**Cenários de aceitação**:

1. **Dado** um processo ativo sem acesso aos dados, **quando** sua saúde for
   consultada, **então** o processo deverá continuar respondendo.
2. **Dada** a indisponibilidade dos dados, **quando** a dependência for consultada,
   **então** deverá haver uma resposta distinta e sem detalhes de conexão.

### Casos de borda

- Um prefixo parecido, mas pertencente a outro nome, não deve selecionar o domínio.
- Uma rota interna de identidade não deve se tornar pública por causa do gateway.
- Um volume já inicializado não deve ter dados ou credenciais recriados silenciosamente.
- O BFF deve responder pela própria saúde mesmo com autenticação indisponível.

## Requisitos

### Requisitos funcionais

- **FR-001**: a plataforma DEVE manter oito capacidades com execução e identidade próprias.
- **FR-002**: chamadas públicas DEVEM ser encaminhadas conforme os contratos de cada capacidade.
- **FR-003**: os prefixos públicos DEVEM respeitar seus limites e excluir rotas internas de identidade.
- **FR-004**: as APIs com dados DEVEM distinguir saúde do processo e saúde da dependência.
- **FR-005**: os dados da aplicação DEVEM permanecer centralizados, com responsabilidade e permissões por coleção.
- **FR-006**: o BFF DEVE delegar identidade e sessões ao responsável e operar sem credenciais de banco.
- **FR-007**: falhas de dependência DEVEM produzir respostas sanitizadas, sem credenciais ou endereço privado.
- **FR-008**: a publicação de um domínio DEVE usar seu código e suas dependências declaradas.
- **FR-009**: configurações locais DEVEM ser externas ao código versionado e preservadas nas atualizações.
- **FR-010**: a preparação inicial dos dados DEVE ser distinguida de migrações de ambientes existentes.

### Entidades principais

- **Capacidade de serviço**: identidade, responsabilidade e pontos de acesso.
- **Responsabilidade de dados**: vínculo entre domínio, usuário de acesso e coleções.
- **Estado de saúde**: disponibilidade do processo e de sua dependência de dados.

## Critérios de sucesso

- **SC-001**: as oito identidades esperadas podem ser consultadas individualmente.
- **SC-002**: para cada um dos sete usuários de dados, uma operação própria é aceita e uma fora do escopo é recusada.
- **SC-003**: a interrupção de um domínio preserva a resposta dos demais processos já ativos.
- **SC-004**: os sete serviços com banco distinguem processo saudável de dependência indisponível; o BFF não exige banco.
- **SC-005**: nenhuma configuração de publicação atribui credenciais de banco ao BFF ou expõe rotas internas de identidade.

O estado de comprovação de cada critério está em [verification.md](verification.md).

## Premissas e limites

- A nomenclatura atual incorpora a alteração autorizada em `005-domain-names`;
  a captura inicial e a evolução posterior não são apresentadas como a mesma decisão histórica.
- Os domínios de negócio ainda oferecem somente inicialização e saúde.
- CRUD, regras educacionais, mensagens, provedores de IA e recuperação de conta
  exigem novas especificações; a existência de coleções não comprova essas funções.
- Identidade e sessões são detalhadas em [002-web-sessions](../002-web-sessions/spec.md).
- Interface e PWA são detalhadas em [003-web-pwa](../003-web-pwa/spec.md).
