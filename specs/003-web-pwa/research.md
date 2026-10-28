# Decisões observadas da interface

**Captura**: 2026-10-27. O registro é retrospectivo e baseado em arquivos.

| Decisão | Fonte e efeito observado |
| --- | --- |
| HTML com Alpine | `index.html` vincula formulário e controles ao estado `app`. |
| Sessão delegada ao BFF | `requestBackend` chama `/api/web` e inclui cookies. |
| CSRF em memória | O componente conserva `csrfToken`; não usa armazenamento persistente. |
| Atualização solicitada pela pessoa | Worker registrado em modo prompt e ação `updateApp(true)`. |
| Cache limitado a arquivos estáticos | Configuração Workbox não declara runtime cache para API. |
| Estado por serviço | Frontend cruza slugs com a resposta agregada do backend. |

A mudança de nomenclatura `005-domain-names` atualiza a capacidade
`administrations` em todos os contratos envolvidos. A alteração não constitui
implementação de novas funções administrativas ou de IA.

Não foram observados testes automatizados de navegador ou evidência de PWA
instalada. A geração do worker será verificada separadamente da experiência real.
