# Plano técnico: interface web e PWA

**Feature**: `003-web-pwa` | **Data**: 2026-10-27  
**Natureza**: reconstrução retrospectiva da implementação observada.

## Contexto e solução

O projeto `web` usa Vite vanilla, HTML nativo, Tailwind CSS por plugin Vite,
Alpine.js e `vite-plugin-pwa`. O estado reside no componente `app` e as
chamadas usam Fetch API para `${VITE_API_URL}/web`, com base padrão `/api`.
O servidor Vite local encaminha `/api` ao Kong em `127.0.0.1:8000`.

| Responsabilidade | Fonte | Requisitos |
| --- | --- | --- |
| Formulários, identidade e estado Alpine | `web/index.html`, `web/src/main.js` | FR-001, FR-002, FR-003 |
| Lista de serviços e contagem | `web/src/main.js`; backend `web/status.py` | FR-004 |
| Credenciais, CSRF, no-store e espera de 7 segundos | `requestBackend` em `web/src/main.js` | FR-002, FR-005 |
| Manifesto standalone, ícones e precache estático | `web/vite.config.js`, `web/public/icons` | FR-006 |
| Registro do worker em modo prompt e aviso Alpine | `web/src/main.js`, `web/index.html` | FR-007 |
| HTML semântico, mensagens e idioma | `web/index.html` | FR-008 |

## Verificação da constituição

A interface continua usando somente o BFF para identidade, sem MongoDB ou
segredo interno. O cookie HttpOnly é emitido pelo backend. `csrfToken` existe
na memória do componente; não há persistência em `localStorage`. Os documentos
usam PT-BR; nomes e interface usam inglês. `.env` é local e ignorado.

## Cache e ciclo de vida

`registerType: prompt` e `onNeedRefresh` apresentam uma ação que chama
`updateApp(true)`. O Workbox faz precache de arquivos estáticos por extensões.
O `navigateFallbackDenylist` exclui `/api` e subcaminhos. Não há regra de
runtime cache para a API. O manifesto usa caminho e escopo `/`, display
standalone e ícones normais e maskable.

## Verificação e evolução

ESLint e build verificam sintaxe, integração de dependências e geração de
artefatos; não comprovam interação, acessibilidade, instalação ou experiência
offline. [verification.md](verification.md) separa essas evidências. Novas
operações offline exigirão requisitos de sincronização e segurança próprios.

## Evolução posterior

O plano [006-landing](../006-landing/plan.md), de 2026-10-28, registra a nova
composição pública, o idioma português e a remoção de chamadas de sessão e
saúde da inicialização. Este documento preserva a reconstrução retrospectiva;
as decisões da nova feature governam a landing e o placeholder `/login`.
