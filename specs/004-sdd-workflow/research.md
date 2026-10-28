# Pesquisa: adoção de SDD

**Data**: 2026-10-27.

O [artigo de Birgitta Böckeler](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
distingue especificar antes de implementar, manter a especificação na evolução
e tratar a especificação como única fonte editável. Adotamos a manutenção das
especificações, com código e testes revisáveis.

A [orientação oficial para projetos existentes](https://github.github.io/spec-kit/guides/existing-projects.html)
permite incorporar o processo sem recriar a aplicação. O inventário retrospectivo
é uma entrega explícita desta adoção; seus limites ficam registrados.

A [integração genérica](https://github.github.io/spec-kit/integrations/generic.html)
permite materializar comandos em `.specify/commands/`. Ela atende ao ambiente
atual sem escrever em diretórios protegidos. Os comandos precisam ser lidos pelo
agente; a ferramenta não oferece despacho de workflows para essa integração.

Os [overrides de modelos](https://github.github.io/spec-kit/guides/customization.html)
guardam as adaptações locais. O CLI e os scripts provêm do Spec Kit 1.2.4;
as instruções Markdown foram adaptadas para português e rastreabilidade.
