# Modelo de dados da plataforma

Este documento descreve responsabilidades observadas, sem inventar esquemas
para as coleções de negócio. O contrato completo de nomes está em
[contracts/platform.yaml](contracts/platform.yaml).

## Definição de serviço

Uma definição possui `id`, `source_directory`, `compose_service`, `upstream`,
`public_prefix` e os pontos de saúde. Esses metadados descrevem configuração;
não constituem uma coleção persistida adicional.

O identificador `administrations` corresponde ao diretório `administrations`.
O identificador `web` representa o BFF, com cliente de autenticação e sem
cliente MongoDB.

## Responsabilidade de dados

Uma responsabilidade vincula `username`, `collections` e `allowed_actions`
a um serviço no banco definido por `MONGO_DB`, inicialmente `maisciencia`.
Os sete usuários são independentes; o BFF não recebe um usuário de banco.
As ações declaradas são leitura, escrita e manutenção dos índices permitidos
nas coleções atribuídas, sem acesso genérico às coleções dos demais domínios.

As coleções de negócio existentes são espaços reservados de responsabilidade.
Não há campos, validações de documentos ou relações educacionais implementados
nesses serviços além da configuração de saúde.

## Estado de saúde

- Processo: `status=ok` e `service` com a identidade esperada.
- Dependência disponível: `status=ok`, `database=connected`.
- Dependência indisponível: `status=error`, `database=unavailable`, HTTP `503`.

Os estados não comprovam disponibilidade de funcionalidades ainda ausentes.
A agregação pública é tratada na [feature do web](../003-web-pwa/spec.md).

## Identidade e sessões

`users`, `sessions` e `recoveries` pertencem a `authentication`.
Os campos efetivos de usuário e sessão são detalhados na
[feature de sessões](../002-web-sessions/data-model.md).
A coleção de recuperação existe como responsabilidade prevista, sem fluxo
de recuperação implementado.
