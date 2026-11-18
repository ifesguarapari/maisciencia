# Especificação: integração e publicação da web

**Feature**: `007-web-delivery` | **Data**: 2026-10-28
**Estado**: especificada antes da implementação; evidências em `verification.md`.
**Origem**: solicitação de GitHub Actions para a web com publicação no GitHub
Pages, adiando expressamente o workflow da API e o VPS Hostinger.

## Objetivo e escopo

Validar automaticamente mudanças da web e publicar somente o frontend estático
aprovado pelo pipeline na branch principal. Preservar a apresentação e as rotas
institucionais de `006-landing`, tanto na raiz quanto no prefixo de um site de
projeto do GitHub Pages. Esta feature é uma evolução nova de entrega; não muda
os serviços Flask, o Kong ou o MongoDB.

Criar somente o workflow da web. API, compra ou configuração de VPS, credenciais
SSH, implantação de containers e alterações de DNS ficam fora deste pedido.
A preparação original foi local. Em 2026-11-07, o usuário autorizou concluir
o Git Flow, versionar semanticamente e publicar a web, incluindo os commits,
merges, tag e pushes necessários. Essa evolução usa a configuração existente
do Pages, com domínio próprio, e substitui o limite remoto da execução original.

Em 2026-11-14, o usuário autorizou também a publicação das evoluções de 006
e 008 a partir de `feature/issue/2`, com Commitizen, referência `re #2`,
release SemVer e GitHub Actions. A finalização da branch e o estado da issue
no GitHub são operações distintas; não representam aceite dos requisitos
da página completa da FEMAIS-ES, que permaneceu fora da release 0.3.0. A
solicitação posterior de 2026-11-14 especifica essa página em
[009-fair](../009-fair/spec.md), sem autorizar seu fechamento automático.

O pedido posterior autoriza publicar a FEMAIS-ES de 009 e seu cartão social
por Git Flow, Commitizen com `re #2`, release SemVer e GitHub Actions. Após
confirmar o deploy, recriar `feature/issue/2` a partir de `develop` e deixá-la
ativa localmente. A issue #2 continua aberta; finalizar uma branch não
representa homologação humana nem autoriza fechar a issue.

## Histórias e aceitação

### US1 — Validar alterações antes da publicação (P1)

Como mantenedor, quero verificar mudanças da web em pull requests e na branch
principal para impedir que uma falha conhecida seja publicada.

- Dado um pull request para `main`, quando o workflow executa, então instala
  dependências pelo lockfile, executa ESLint, testes, validação SDD e build.
- Dada uma falha de verificação, quando o job termina, então a publicação não
  começa. Pull requests e execução manual fora de `main` não publicam.

### US2 — Publicar o frontend aprovado (P1)

Como mantenedor, quero publicar o artefato estático no GitHub Pages depois da
validação, sem enviar arquivos de backend ou depender de segredos de VPS.

- Dado um push para `main` ou uma execução manual dessa branch, quando as
  verificações passam, então o workflow envia somente `web/dist` ao Pages.
- Dado um repositório sem Pages habilitado, quando preparo a primeira execução,
  então a documentação explica a configuração necessária sem afirmar publicação.
- Dadas execuções simultâneas, quando uma implantação já está em andamento,
  então as publicações compartilham uma fila sem cancelar a implantação ativa.
- Dadas mudanças prontas para publicação, quando preparo a release, então
  aplico a política SemVer documentada, finalizo a branch de trabalho em
  `develop` e a release em `main` e `develop`, com tag imutável da versão.
- Dada a autorização de publicação, quando envio a release, então acompanho
  o workflow e verifico o site publicado, distinguindo esses resultados dos
  checks locais.

### US3 — Usar o site hospedado em um prefixo (P1)

Como visitante, quero abrir a página e suas rotas diretamente, com imagens,
ícones, fontes e navegação funcionando no endereço público do projeto.

- Dado o site em `/maisciencia/`, quando abro início, aplicativo, feira ou oficinas, então
  recursos, links e retorno permanecem dentro desse prefixo.
- Dada uma primeira visita à Feira, ao regulamento, ao encontro de dezembro ou a uma das sete páginas
  provisórias, quando o servidor só oferece arquivos estáticos, então recebo
  HTML existente, com conteúdo próprio, sem depender de fallback SPA.
- Dado o build na raiz, quando abro as mesmas rotas, então os fluxos anteriores
  continuam disponíveis. Manifesto e service worker usam a base correspondente.

## Requisitos

- **FR-001**: O workflow da web DEVE executar em pull requests para `main`, pushes
  para `main` e por execução manual, instalando dependências com `npm ci`, usando
  Node.js 24 e o lockfile de `web`.
- **FR-002**: A integração DEVE executar ESLint, testes da web, build e validação
  estrutural SDD; qualquer falha DEVE impedir a implantação.
- **FR-003**: Somente pushes ou execuções manuais em `main` DEVEM poder publicar.
  Pull requests, inclusive de forks, NÃO DEVEM enviar artefatos de publicação,
  acessar segredos de implantação ou receber permissões de escrita no Pages.
- **FR-004**: A publicação DEVE enviar somente o conteúdo de `web/dist`, usar o
  ambiente `github-pages`, informar a URL resultante e serializar implantações
  sem interromper uma que já esteja em andamento.
- **FR-005**: O código DEVE permitir builds na raiz e no prefixo do Pages. Links,
  imagens, SVGs com fragmentos, fontes e seleção de rota DEVEM respeitar a base
  configurada, sem modificar conteúdo, cores ou interações institucionais.
- **FR-006**: O build DEVE produzir onze entradas HTML físicas: a inicial,
  `login/`, `feira/`, `feira/regulamento/`, `feira/202612/`, `feira/202703/`,
  `feira/202706/`, `oficinas/`, `oficinas/ler/`, `oficinas/lancar/` e
  `oficinas/melhorar/`. Feira, regulamento e dezembro DEVEM conter o conteúdo
  de 009; as sete provisórias DEVEM ter aviso e retorno. Acesso direto,
  atualização e variantes com barra final DEVEM funcionar em hospedagem estática.
- **FR-007**: Manifesto, ícones, registro e escopo do service worker DEVEM
  respeitar a base. Navegação e recursos estáticos podem funcionar offline após
  cache; respostas de API DEVEM continuar excluídas e atualização continua
  dependendo de ação explícita do visitante.
- **FR-008**: A configuração DEVE preservar `.env` locais e manter API e VPS
  fora dos workflows desta entrega. Nenhum segredo SSH, workflow da API ou
  infraestrutura de VPS DEVE ser criado. A publicação autorizada da web DEVE
  utilizar a configuração existente do Pages, preservando domínio e HTTPS.
- **FR-009**: A documentação DEVE explicar triggers, verificações, branch,
  ativação inicial de Pages, endereço esperado, base, reprodução local e limites
  reais de validação, distinguindo artefato local de execução remota.
- **FR-010**: Releases da web DEVEM seguir a política SemVer documentada em
  `CONTRIBUTING.md`, com versão sincronizada em `web/package.json` e
  `web/package-lock.json`, histórico em `CHANGELOG.md` e tag Git da mesma
  versão, sem prefixo. O Git Flow DEVE finalizar o trabalho em `develop`,
  preparar `release/<version>` e incorporar a release em `main` e `develop`.
  A publicação DEVE ocorrer somente após os checks; a versão da API não muda
  por uma release exclusiva da web. Tags publicadas não DEVEM ser substituídas.

## Critérios de sucesso

- **SC-001**: Os checks locais equivalentes ao workflow passam; a estrutura
  impede publicação após falha e em pull requests ou outras branches.
- **SC-002**: O artefato contém somente frontend e entradas das onze rotas,
  com recursos resolvidos corretamente em `/` e `/maisciencia/`.
- **SC-003**: Um servidor estático sem fallback serve todas as rotas;
  navegador confirma navegação e recursos na base de projeto sem falhas.
- **SC-004**: Há somente um workflow novo, para a web; instruções de ativação
  e evidências não declaram execução ou publicação remota não realizada.
- **SC-005**: Versão dos manifestos, tag e changelog correspondem; `main` e
  `develop` contêm a release e o workflow associado termina com sucesso.
  A página inicial, a Feira, o regulamento, dezembro, as sete rotas provisórias e os recursos publicados
  respondem no domínio configurado.

## Premissas e limites

O remote observado é `ifesguarapari/maisciencia` e a branch padrão remota local
aponta para `main`. Sem domínio próprio, o endereço esperado é
`https://ifesguarapari.github.io/maisciencia/`; a configuração do Pages poderá
fornecer uma base diferente. Não se presume que Pages já esteja habilitado.
Os caminhos públicos `/feira`, `/oficinas`, `/oficinas/ler`, `/oficinas/lancar`
e `/oficinas/melhorar` foram solicitados em português e permanecem preservados;
os demais novos nomes técnicos usam inglês.

## Evolução: rotas FEMAIS-ES

[009-fair](../009-fair/spec.md) amplia o artefato para onze HTMLs, incluindo
regulamento e três etapas em construção. Feira e regulamento passam a ter
conteúdo estático próprio. Esta ampliação local não executa uma nova release
nem implica publicação ou encerramento da issue #2; isso exige uma execução
de entrega registrada separadamente. Os resultados remotos de 0.3.0 ficam
preservados como histórico.

## Evolução: conteúdo de dezembro em 2026-11-18

O primeiro encontro passa a oferecer conteúdo de 009. O inventário de onze
entradas não muda: três páginas de conteúdo, sete provisórias e a inicial.
Essa preparação local não executa release nem altera o workflow. A publicação
0.4.0 descrita nas evidências continua sendo a versão anterior deste conteúdo.

## Autorização da release 0.5.0 em 2026-11-18

O pedido posterior autoriza concluir `feature/issue/2` pelo Git Flow,
registrar os commits pelo Commitizen com rodapé `fix #2`, preparar a release
SemVer, publicar pelo GitHub Actions e recriar `feature/issue/2` após a
implantação. A versão planejada é 0.5.0, uma evolução minor por acrescentar
a página completa do encontro de dezembro sem incompatibilidade das rotas.

A entrega inclui `/feira/202612`, suas 20 atividades ilustradas e a data
confirmada de 04/12/2026 no Ifes Vila Velha, além dos ajustes de rótulos e
dos avisos “(A confirmar)” de Piúma e Linhares. O inventário permanece com
onze HTMLs, quatro páginas indexáveis e sete provisórias. A API, seu
versionamento e a configuração de domínio continuam fora desta release.

Finalizar a feature significa encerrar a branch de trabalho, não concluir
automaticamente a issue GitHub #2. A orientação anterior de mantê-la aberta
para as funcionalidades restantes continua válida. O rodapé solicitado
`fix #2` deve ser preservado; se o GitHub encerrar a issue automaticamente
durante a integração, seu estado deve ser restaurado para aberto, sem
atribuir homologação ou conclusão aos critérios pendentes.

Checks locais, integração, publicação, conferência externa e recriação da
feature precisam de evidências próprias. Esta autorização substitui o
limite de preparação local do trecho anterior, mas ainda não comprova
execução do Actions nem disponibilidade da versão 0.5.0 em produção.

## Correção de imagem: release 0.5.1

Em 2026-11-18, o usuário autorizou publicar a substituição de `jic2026.png`
pelo SVG fornecido. A alteração é compatível e usa patch 0.5.1, commit
`fix(web)` e referência não conclusiva `re #2`, preservando a issue aberta.
Finalizar a branch atual pelo Git Flow e preparar a release regular a partir
de `develop`; manter tag imutável, checks e implantação pela main no Actions.
Após sucesso, conferir SVG, remoção do PNG e apresentação por HTTPS, registrar
as evidências e devolver `feature/issue/2` ativa, limpa e alinhada a develop.
