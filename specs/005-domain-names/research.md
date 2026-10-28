# Decisões de nomenclatura

O pedido atual substitui a preservação anterior da identidade composta da API
de administração. A pasta também será `administrations`, para evitar tradução
entre diretório e identidade. Os demais mapeamentos seguem literalmente a
solicitação, incluindo `informations` e `agents`.

Não foi inferida uma mudança de significado para os dados de IA. A existência
dessas coleções ainda não representa provedores ou fluxos de IA implementados.

Uma inicialização de volume vazio não atualiza um banco existente. Por isso,
a alteração inclui ferramenta explícita de migração, com inspeção por padrão
e sem execução real nesta entrega.
