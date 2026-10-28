<!--
Relatório de sincronização: 1.0.0 → 1.1.0 em 2026-10-28. A solicitação
006-landing amplia o princípio IV com uma exceção específica de interface em
português do Brasil para a página institucional e /login provisório.
Arquitetura, código e demais convenções são preservados. A versão minor
registra essa ampliação autorizada; não representa homologação humana.
-->
# Constituição do Mais Ciência na Escola

## I. Intenção especificada e mantida

O projeto adota Spec-Driven Development (SDD) com Spec Kit e especificações
vivas. `spec.md` expressa o que deve acontecer e por quê, com histórias
priorizadas, requisitos identificados e cenários verificáveis. `plan.md`
registra como implementar; `tasks.md` liga as tarefas aos requisitos e aos
arquivos envolvidos. Contratos e testes acompanham a evolução da intenção.

Antes de uma mudança de comportamento, atualize ou crie a especificação
pertinente. Investigações e descobertas podem exigir a reconciliação dos
artefatos. A implementação não deve alterar silenciosamente a intenção.

## II. Arquitetura e fronteiras explícitas

Preserve a arquitetura acordada: frontend Vite vanilla, HTML, Tailwind CSS,
Alpine.js e PWA; serviços Flask independentes; Kong DB-less; um banco MongoDB
da aplicação, com responsabilidade por coleção e credenciais por domínio.

Existem sete serviços com banco e um BFF em `api/services/web`. Identidade e
estado das sessões pertencem a `authentication`. O BFF não acessa o MongoDB
diretamente. A biblioteca `api/common` compartilha inicialização técnica.
Mudanças dessas fronteiras precisam ser justificadas no plano da alteração.

Use os nomes simples solicitados e mantenha a identidade consistente entre
camadas. `administrations` identifica pasta, serviço, prefixo público e usuário
de dados. A alteração autorizada de nomes está em `specs/005-domain-names/`.
Alterações de contratos, dados ou credenciais precisam explicitar compatibilidade,
migração e recuperação adequadas ao impacto real.

## III. Segurança como comportamento verificável

Preserve os controles existentes de sessão: cookie HttpOnly, política Secure
configurável para HTTPS, SameSite, validação de origem e CSRF, expiração por
inatividade e absoluta, revogação e rotação do identificador. Tokens de sessão
e segredos internos não pertencem ao JSON público, a logs ou ao armazenamento
JavaScript. O serviço de autenticação persiste o verificador do identificador.

Falhas de dependência devem produzir os erros sanitizados especificados.
Dados e credenciais são acessados segundo a responsabilidade de cada serviço.
Novos endpoints de negócio precisam especificar e testar autenticação e
autorização; as atuais rotas de saúde não demonstram essa autorização futura.

## IV. Idioma e configuração

As explicações em Markdown são escritas em português do Brasil. Nomes de
pastas e arquivos, identificadores, código, comentários e contratos em formatos
de máquina usam inglês. Identificadores técnicos dos exemplos em Markdown
também usam inglês.

A interface usa inglês por padrão. A página institucional e sua rota `/login`
provisória usam português do Brasil, conforme o pedido específico registrado
em `specs/006-landing/`. Essa exceção abrange textos públicos, metadados e
conteúdo institucional; não altera nomes técnicos nem a linguagem do código.

Use arquivos `.env` locais e ignorados pelo Git e pelo build Docker. Preserve
as configurações existentes e mantenha os segredos fora das especificações.
As variáveis necessárias são documentadas, sem publicar seus valores reais.

## V. Qualidade proporcional e evidência honesta

Mantenha Black e Pylint para Python, ESLint e build Vite para o frontend e
Conventional Commits com Commitizen. Testes novos devem comprovar comportamento
ou um risco relevante, em vez de reproduzir a implementação. Execute as
verificações pertinentes à mudança e registre comando, resultado e limite.

Uma tarefa concluída exige evidência do seu próprio resultado. Inspeção,
teste com mocks, HTTP com persistência em memória, teste com MongoDB real e
validação em navegador são evidências diferentes. Não atribua aprovação
humana ou validação de produção a resultados locais ou simulados.

## Fluxo de trabalho

Use `constitution → specify → clarify → plan → tasks → analyze → implement →
converge`, com esclarecimento e revisão conforme a incerteza e o impacto.
`analyze` é somente leitura. `converge` registra lacunas acrescentando tarefas;
não modifica a implementação nem reescreve a especificação para aprová-la.

A solicitação atual autoriza a adoção desse fluxo e o registro das baselines.
Autorizações existentes continuam válidas. Não crie confirmações repetidas
para decisões rotineiras. Revisões humanas, quando necessárias ou solicitadas,
devem permanecer identificadas como tais e não podem ser fabricadas.

## Governança e atualização

Esta constituição consolida decisões já solicitadas para o projeto. Uma
alteração deve registrar motivação, impacto e versão, sincronizando modelos
e instruções afetados. Use versionamento semântico para distinguir mudanças
incompatíveis de princípios, novas regras e correções de redação.

O contexto permanente fica em `docs/architecture.md`; o comportamento e suas
evidências ficam em `specs/`. As três primeiras especificações são baselines
retrospectivas. Seus limites de verificação não impedem registrar a arquitetura
existente, mas devem orientar os testes das mudanças seguintes.

**Versão**: 1.1.0 | **Adoção**: 2026-10-27 | **Última alteração**: 2026-10-28
