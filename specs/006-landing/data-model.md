# Modelo de dados: conteúdo institucional

Esta feature não altera coleções, credenciais ou documentos MongoDB. O conteúdo
é local e separado da composição visual para permitir manutenção posterior.

| Entidade | Campos ou estado | Responsabilidade |
| --- | --- | --- |
| Instituição | `id`, `name`, `city`, `type` e detalhes apenas quando fornecidos | Identificar escola ou campus sem dados fabricados |
| Pessoa | Nome e função fornecidos | Representar três coordenadores e seis colaboradores |
| Oficina | Título, categoria, ambiente virtual, URL e culminância | Apresentar os três temas sem datas fixas; associação em `contracts/ui.json` |
| Projeto aprovado | `name`, `process`, `valueBrl` e `valueLabel` | Associar cada um dos dois títulos ao processo CNPq e ao valor fornecidos, conforme `contracts/ui.json` |
| Aba da rede | `schools` ou `campuses` | Selecionar o conjunto de instituições |
| Filtro | Texto de busca e município | Restringir resultados da aba ativa |
| Painel | Identificador da instituição aberta | Exibir detalhes disponíveis |
| Navegação | Menu aberto, seção ativa e estado de rolagem | Cabeçalho e navegação móvel |
| PWA | Atualização disponível e ação explícita | Atualizar recursos estáticos sem chamadas de sessão |

São 21 registros de escolas e nove de campi. Não se armazenam senhas, tokens,
contatos presumidos, endereços ou horários ausentes. A busca e os filtros
operam localmente; dados da rede não são enviados ao backend.

Os valores de projetos aprovados são individuais. O contrato os registra em
reais para evitar ambiguidade, com rótulos públicos “R$ 3 milhões” e “R$ 210 mil”.
Não há soma automática nem alteração do indicador de investimento global.
