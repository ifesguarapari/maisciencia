# Artefatos da entrega

Esta feature não cria documentos MongoDB nem modifica coleções ou serviços.

| Artefato | Responsabilidade | Estado e limite |
| --- | --- | --- |
| Workflow web | Validar a mudança e coordenar a publicação permitida | Execução remota pertence ao GitHub Actions |
| `web/package-lock.json` | Resolver instalação npm reproduzível | Consumido por `npm ci`; não inclui segredos |
| `web/dist` | Conteúdo estático publicável | Gerado pelo Vite; não é o diretório inteiro do repositório |
| `web/src/pages.js` | Catálogo de seis páginas provisórias e lista derivada de sete entradas | Compartilhado pela interface, pelo plugin de rotas estáticas e pelo verificador de build |
| Entradas HTML | Início, aplicativo, feira, oficinas e três oficinas individuais | Permitem primeira visita e recarga sem fallback, incluindo caminhos aninhados |
| Manifesto e service worker | Identidade PWA, recursos e escopo | Base deve coincidir com a hospedagem |
| `WEB_BASE_PATH` | Base pública do build | Configuração pública de processo, sem alterar `.env` |

O deploy recebe somente o artefato de frontend gerado depois dos checks. Falha
de um check interrompe esse caminho. A API e seu futuro VPS não têm estado de
implantação criado nesta feature.

As entradas são `index.html`, `login/index.html`, `feira/index.html`,
`oficinas/index.html`, `oficinas/ler/index.html`, `oficinas/lancar/index.html`
e `oficinas/melhorar/index.html`. Cada página provisória associa título,
mensagem e cor no catálogo; nenhuma inclui dados de sessão ou exige backend.
Os caminhos públicos e recursos respeitam a mesma base do artefato.
