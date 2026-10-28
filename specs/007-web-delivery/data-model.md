# Artefatos da entrega

Esta feature não cria documentos MongoDB nem modifica coleções ou serviços.

| Artefato | Responsabilidade | Estado e limite |
| --- | --- | --- |
| Workflow web | Validar a mudança e coordenar a publicação permitida | Execução remota pertence ao GitHub Actions |
| `web/package-lock.json` | Resolver instalação npm reproduzível | Consumido por `npm ci`; não inclui segredos |
| `web/dist` | Conteúdo estático publicável | Gerado pelo Vite; não é o diretório inteiro do repositório |
| Entradas HTML | Início, aplicativo e feira | Permitem primeira visita sem fallback |
| Manifesto e service worker | Identidade PWA, recursos e escopo | Base deve coincidir com a hospedagem |
| `WEB_BASE_PATH` | Base pública do build | Configuração pública de processo, sem alterar `.env` |

O deploy recebe somente o artefato de frontend gerado depois dos checks. Falha
de um check interrompe esse caminho. A API e seu futuro VPS não têm estado de
implantação criado nesta feature.
