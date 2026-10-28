# Comandos do Spec Kit neste projeto

Estes arquivos adaptam os comandos gerados pelo Spec Kit 1.2.4 para português
do Brasil e para a constituição do projeto. O CLI, os scripts Bash e os
identificadores de integração permanecem os fornecidos pelo upstream.

A integração `generic` exige que o agente leia explicitamente o arquivo do
comando solicitado e este protocolo comum. Os nomes `/speckit.*` identificam
as etapas; não representam descoberta nativa ou execução automática pelo CLI.
Os campos `handoffs` descrevem próximos passos, sem autorização adicional.

## Contexto e limites comuns

- Considere `$ARGUMENTS` como a solicitação da conversa, mesmo quando o marcador
  aparecer literalmente. Não peça novamente informações já fornecidas.
- Leia a constituição, o contexto arquitetural e a especificação afetada.
- Preserve autorizações existentes e configurações locais. Solicite decisão
  somente quando uma escolha material permanecer sem resposta razoável.
- Markdown explicativo usa português do Brasil; caminhos, identificadores,
  código, comentários de código e interface usam inglês.
  A página institucional e `/login` têm a exceção de interface pt-BR autorizada
  em `specs/006-landing/`; preserve esse escopo ao evoluir a feature.
- Mantenha intenção, plano, contratos, tarefas e evidências coerentes. Uma
  análise estrutural não comprova comportamento nem aprovação humana.
- Selecione a funcionalidade com `SPECIFY_FEATURE_DIRECTORY` ou pelo campo
  `feature_directory` de `.specify/feature.json`. Não dependa de `SPECIFY_FEATURE`
  sozinho nem do nome da branch para resolver os caminhos nesta versão.
- Se faltar um pré-requisito obrigatório, informe seu caminho e a etapa
  necessária. Não fabrique resultados, arquivos existentes ou revisões.

## Protocolo de hooks

Antes e depois de cada comando, consulte `.specify/extensions.yml` somente
quando o arquivo existir. Para a etapa `name`, use `hooks.before_name` e
`hooks.after_name`. Ausência de arquivo ou registros dispensa essa ação.

1. Se o YAML for inválido, informe o erro do parser e que os hooks, inclusive
   obrigatórios, não puderam ser verificados; continue a etapa normalmente.
2. Ignore registros com `enabled: false`; ausência de `enabled` significa ativo.
3. Não interprete expressões `condition`. Se não forem vazias, deixe a execução
   para o HookExecutor; somente condição ausente, nula ou vazia permite seguir.
4. Para `optional: true`, apresente extensão, comando, descrição e prompt como
   opção; não execute automaticamente.
5. Para `optional: false`, apresente `EXECUTE_COMMAND: <command>`, invoque de
   fato o comando pelo mecanismo disponível e aguarde o resultado. Imprimir
   a linha não conta como execução. Se não houver mecanismo, registre o limite.
6. Hooks respeitam a autorização da conversa e os limites do comando. Não
   instale extensões nem envie issues ou mensagens externas sem solicitação.
7. Execute os hooks posteriores antes de declarar conclusão. Em `converge`,
   informe `converged` ou `tasks_appended` antes de apresentar os hooks finais.

Esta adoção não instala hooks de extensão. As instruções acima
preservam o protocolo oficial para configurações futuras.
