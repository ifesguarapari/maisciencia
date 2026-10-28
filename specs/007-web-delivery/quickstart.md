# Executar a integração e publicar a web

## Preparação no GitHub

1. Envie os arquivos por seu fluxo normal de commits e pull requests. O workflow
   está em `.github/workflows/web.yml` e usa a branch `main` deste repositório.
2. Em **Settings → Pages**, selecione **GitHub Actions** em **Source**.
3. Confira se o ambiente **github-pages** permite implantar a partir de `main`.
   Eventuais regras de aprovação continuam sob responsabilidade dos mantenedores.
4. Ao incorporar uma mudança em `main`, acompanhe **Actions → Web**. Depois de
   uma publicação bem-sucedida, o job de deploy informa o endereço resultante.
   A execução manual também publica somente quando seleciona `main`.

Sem domínio próprio, o endereço esperado é
`https://ifesguarapari.github.io/maisciencia/`. Nenhuma publicação foi realizada
pela criação dos arquivos locais. Não são necessários segredos de VPS ou tokens
pessoais; a integração usa o token de execução do GitHub.

## Verificações locais

Com Node.js 24+, na pasta `web`:

```bash
npm ci
npm run lint
npm test
npm run build
npm run check:build
WEB_BASE_PATH=/maisciencia/ npm run build
WEB_BASE_PATH=/maisciencia/ npm run check:build
```

Use a mesma base no build e na conferência do artefato. Na raiz:

```bash
python3 scripts/validate-specs.py
```

O workflow executa esses tipos de check e envia somente `web/dist` depois do
sucesso. Pull requests e execução manual de outras branches validam o código e
não publicam. A base da publicação é obtida da configuração do Pages; a base de
PR usa o nome do repositório.

## Servidor estático sem fallback

Depois do build com base `/maisciencia/`, crie um diretório temporário contendo
uma pasta `maisciencia` e copie para ela somente o conteúdo de `web/dist`.
Sirva o diretório temporário por um servidor estático comum, por exemplo
`python3 -m http.server 4173 --bind 127.0.0.1 --directory <temporary-directory>`.
Esse servidor não deve reescrever rotas ausentes para `index.html`.

Confira início, `login/` e `feira/`, inclusive recarga direta. Fontes, imagens,
SVGs e retorno devem permanecer no prefixo. O build contém entradas físicas para
essas rotas. Confira também uma compilação com a base `/` para desenvolvimento
local e domínio próprio. Encerre o servidor após a conferência.

O build PWA não comprova instalação, atualização ou offline em um navegador.
Registre somente os exercícios realmente executados em [verification.md](verification.md).

## API adiada

Não existe workflow de API nesta entrega. O futuro deploy no VPS Hostinger
será especificado quando houver servidor e funcionalidade a implantar.
