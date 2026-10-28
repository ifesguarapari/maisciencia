# Verificação da interface

Na pasta `web`, com Node.js compatível e dependências instaladas:

```bash
npm ci
npm run lint
npm run build
```

Inspecione a geração de manifesto e service worker em `dist`. Isso comprova a
geração dos artefatos, sem demonstrar instalação ou funcionamento offline.
O diretório `dist` é gerado e não deve ser versionado como fonte.

Para desenvolvimento com backend configurado e Kong em `8000`:

```bash
npm run dev
```

Confira no navegador login, recarga, renovação e saída, além do estado dos oito
serviços. Use as origens explicitamente permitidas pelo backend. A política
Secure do cookie deve corresponder ao HTTPS do ambiente.

Para a validação PWA, sirva o build de produção em origem adequada; execute
instalação, recarga após cache, falha de rede e publicação de nova versão.
Confirme que respostas de `/api` não são atendidas pelo precache ou pela
navegação substituta. Registre navegador, versão, origem, resultado e limite
em [verification.md](verification.md), sem tokens ou senhas.
