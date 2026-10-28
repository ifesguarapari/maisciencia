# Verificação e rastreabilidade da interface

**Captura**: 2026-10-27. Evidência documental resulta de inspeção; testes e
validações de navegador são registrados separadamente. Não há homologação humana.

| Requisito | Fonte | Evidência e estado |
| --- | --- | --- |
| FR-001 | `web/src/main.js`, `web/index.html`; contrato de sessões `002` | Fluxos inspecionados; execução no navegador pendente. |
| FR-002 | `requestBackend`, `setSession`, `clearSession` | Cookies incluídos e CSRF em memória por inspeção; armazenamento real pendente. |
| FR-003 | `login`, `logout`, `renewSession` e controles HTML | Limpeza e bloqueio inspecionados; interação pendente. |
| FR-004 | `services`, `checkApi`; backend `status.py` | Oito identidades e contagem inspecionadas; estados parciais no navegador pendentes. |
| FR-005 | Fetch com `cache: no-store` e `AbortSignal.timeout(7000)` | Configuração inspecionada; falha de rede no navegador pendente. |
| FR-006 | `web/vite.config.js`, `web/public/icons` | Manifesto e precache inspecionados; build passou; instalação pendente. |
| FR-007 | `registerSW`, `onNeedRefresh`, `updateApp(true)` | Fluxo inspecionado; atualização em navegador pendente. |
| FR-008 | `web/index.html`, mensagens em `web/src/main.js` | Idioma e controles inspecionados; revisão de acessibilidade e interação pendente. |

## Critérios e execução

| Critério ou check | Resultado registrado | Limite |
| --- | --- | --- |
| SC-001 — ciclo de sessão na interface | Pendente | Testes backend não substituem navegador. |
| SC-002 — disponibilidade e contagem | Pendente no navegador | Inspeção das listas não comprova integração. |
| SC-003 — geração do build | Passou em 2026-10-27 | Não comprova instalação nem cache em uso. |
| SC-004 — instalação, atualização e offline | Não verificado | Exige navegador e build de produção. |
| `npm run lint` | Passou em 2026-10-27 | Análise estática. |
| `npm run build` | Passou em 2026-10-27 | Build e geração do worker/manifesto. |

Atualizações devem indicar data, comando e resultado efetivamente observados.
Falhas de autenticação sem rede são esperadas; a baseline não promete login offline.

## Verificação documental executada em 2026-10-27

Foi executado um script local de inspeção para conferir: referências FR dos
requisitos em `tasks.md` e `verification.md`, existência dos destinos de links
Markdown locais e leitura dos contratos com PyYAML/JSON. Resultado: sem erros
nesses checks. Nas interfaces de sessão, todos os `$ref` locais e entre os
dois arquivos OpenAPI foram resolvidos. Isso não é validação completa pelo
schema oficial OpenAPI, teste de contrato HTTP nem execução de infraestrutura.

## Execução local consolidada em 2026-10-27

`npm run lint` e `npm run build`, na pasta `web`, passaram. O build gerou
a PWA com 17 entradas de precache, manifesto e service worker. SC-003 tem
evidência de build; SC-001, SC-002 e SC-004 continuam dependentes de validação
em navegador. O resultado não comprova instalação, atualização ou cache offline
em uso real.
