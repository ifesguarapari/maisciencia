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
SSH, implantação de containers, DNS e domínio próprio ficam fora deste pedido.
Não fazer push, habilitar Pages nem disparar publicação remota nesta execução.

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

### US3 — Usar o site hospedado em um prefixo (P1)

Como visitante, quero abrir a página e suas rotas diretamente, com imagens,
ícones, fontes e navegação funcionando no endereço público do projeto.

- Dado o site em `/maisciencia/`, quando abro início, aplicativo ou feira, então
  recursos, links e retorno permanecem dentro desse prefixo.
- Dada uma primeira visita a `login/` ou `feira/`, quando o servidor só oferece
  arquivos estáticos, então recebo HTML existente sem depender de fallback SPA.
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
- **FR-006**: O build DEVE produzir entradas HTML físicas para `login/` e
  `feira/`, com seus textos provisórios e retorno, preservando acesso direto,
  atualização e variantes com barra final em hospedagem estática.
- **FR-007**: Manifesto, ícones, registro e escopo do service worker DEVEM
  respeitar a base. Navegação e recursos estáticos podem funcionar offline após
  cache; respostas de API DEVEM continuar excluídas e atualização continua
  dependendo de ação explícita do visitante.
- **FR-008**: A configuração DEVE preservar `.env` locais e manter API e VPS
  fora dos workflows desta entrega. Nenhum segredo SSH, workflow da API ou
  alteração remota de hospedagem DEVE ser criado.
- **FR-009**: A documentação DEVE explicar triggers, verificações, branch,
  ativação inicial de Pages, endereço esperado, base, reprodução local e limites
  reais de validação, distinguindo artefato local de execução remota.

## Critérios de sucesso

- **SC-001**: Os checks locais equivalentes ao workflow passam; a estrutura
  impede publicação após falha e em pull requests ou outras branches.
- **SC-002**: O artefato contém somente frontend e entradas das três rotas,
  com recursos resolvidos corretamente em `/` e `/maisciencia/`.
- **SC-003**: Um servidor estático sem fallback serve as rotas provisórias;
  navegador confirma navegação e recursos na base de projeto sem falhas.
- **SC-004**: Há somente um workflow novo, para a web; instruções de ativação
  e evidências não declaram execução ou publicação remota não realizada.

## Premissas e limites

O remote observado é `ifesguarapari/maisciencia` e a branch padrão remota local
aponta para `main`. Sem domínio próprio, o endereço esperado é
`https://ifesguarapari.github.io/maisciencia/`; a configuração do Pages poderá
fornecer uma base diferente. Não se presume que Pages já esteja habilitado.
O caminho público `/feira` foi solicitado em português e permanece preservado;
os demais novos nomes técnicos usam inglês.
