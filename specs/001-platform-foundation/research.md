# Pesquisa e decisões da baseline

**Data**: 2026-10-27. Pesquisa realizada por inspeção de arquivos, sem acessar `.env`.

## D1 — Adoção em um sistema existente

Registrar o estado observado antes de propor mudanças evita atribuir à SDD
uma implementação que já existia. As especificações serão mantidas para a
evolução, seguindo uma abordagem ancorada em especificações.

A distinção entre contexto permanente e especificação de uma mudança segue
a discussão do [artigo indicado pelo usuário](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html).
O fluxo e os artefatos usam o [Spec Kit](https://github.com/github/spec-kit).

## D2 — Preservar os limites existentes

O Compose e o gateway definem oito identidades. Seis serviços de negócio
possuem somente factories e saúde. A autenticação e o BFF têm comportamento
de sessão implementado. A baseline não cria CRUD para preencher esses limites.

Fontes: `api/compose.yaml`, `api/services/*/app.py`, `api/gateway/kong.yaml`.

## D3 — Evoluir a nomenclatura por solicitação explícita

A captura inicial tinha nomes diferentes para diretório, contrato e usuário.
Depois da adoção iniciada, a solicitação `005-domain-names` definiu
`administrations` para a pasta, o serviço HTTP e o usuário MongoDB, além de
nomes simples para sete coleções. Esta baseline viva acompanha essa evolução,
sem afirmar que a nomenclatura nova existia anteriormente. Configurações de
volumes vazios e migração de volumes existentes são verificações distintas.

## D4 — Banco único com responsabilidade por coleção

As permissões são declaradas no script de inicialização. Não foram exercitadas
contra um banco real nesta inspeção. `OWNED_COLLECTIONS` descreve a intenção;
a aplicação efetiva da restrição pertence às roles do MongoDB.

## D5 — Separar evidência de intenção

Os testes existentes usam cliente Flask e simulações para dispensar MongoDB.
Eles são evidência de contratos de aplicação, sem provar o roteamento real
do Kong, as permissões do banco, a instalação PWA ou capacidade sob carga.
Essas verificações ficam abertas e não serão representadas como concluídas.
