# Executar a integração e publicar a web

## Preparação no GitHub

Na consulta de 2026-11-07, Pages está configurado com domínio
`https://maisciencia.ifes.app.br/`, HTTPS, base `/` e `build_type: workflow`.
Essa consulta confirma a configuração; a implantação de uma nova release
precisa ser acompanhada no run correspondente e conferida no endereço público.

1. Envie os arquivos por seu fluxo normal de commits e pull requests. O workflow
   está em `.github/workflows/web.yml` e usa a branch `main` deste repositório.
2. Em **Settings → Pages**, selecione **GitHub Actions** em **Source**.
3. Confira se o ambiente **github-pages** permite implantar a partir de `main`.
   Eventuais regras de aprovação continuam sob responsabilidade dos mantenedores.
4. Ao incorporar uma mudança em `main`, acompanhe **Actions → Web**. Depois de
   uma publicação bem-sucedida, o job de deploy informa o endereço resultante.
   A execução manual também publica somente quando seleciona `main`.

Sem domínio próprio, o endereço alternativo de projeto é
`https://ifesguarapari.github.io/maisciencia/`, com base `/maisciencia/`.
A criação original dos arquivos locais não publicou o site; a autorização de
2026-11-07 permite executar a sequência de Git Flow e publicação descrita abaixo.
Não são necessários segredos de VPS ou tokens pessoais para o workflow;
a integração usa o token de execução do GitHub.

## Preparar a release 0.2.0

Consulte a [política SemVer e Git Flow](../../CONTRIBUTING.md#versões-e-releases-da-web)
e o [changelog](../../CHANGELOG.md). A release `0.2.0` é minor pelas novas rotas
de oficinas e inclui as correções visuais. A API mantém sua versão independente.

Depois de revisar e commitar as alterações da branch de trabalho, finalize
`bugfix/landing-details` em `develop`, inicie `release/0.2.0` e atualize a versão
da web com `npm version minor --no-git-tag-version`, executado uma única vez na
pasta `web`. Sincronize `package.json`, `package-lock.json`, changelog e evidências,
execute os checks abaixo e crie o commit de preparação da release.

Finalize a release pelo Git Flow, que incorpora em `main`, cria a tag `0.2.0`
e sincroniza `develop`. Envie essas três referências sem reescrever o histórico.
O push de `main` inicia o workflow Web; acompanhe o run do commit enviado até
build e deploy terminarem e confira início, rotas e recursos no domínio atual.
Publique as notas da versão vinculadas à tag existente. Registre os resultados
reais em [verification.md](verification.md), sem confundir preparação local
com implantação concluída.

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

Confira as sete entradas físicas, inclusive com acesso direto e recarga:

| Caminho no artefato | Página |
| --- | --- |
| `index.html` | Início |
| `login/index.html` | Acesso ao Aplicativo |
| `feira/index.html` | Feira |
| `oficinas/index.html` | Oficinas |
| `oficinas/ler/index.html` | Ler um Livro com Jogos |
| `oficinas/lancar/index.html` | Lançar Foguetes com Precisão |
| `oficinas/melhorar/index.html` | Melhorar a Cidade com Eletrônica |

As seis páginas provisórias devem abrir com e sem barra final; o servidor pode
normalizar o endereço para barra final. Confira as mensagens de construção das
oficinas e a indicação de planejamento e execução em `/maisciencia/oficinas/`.
Fontes, imagens, SVGs e retorno devem permanecer no prefixo, inclusive nas
três páginas aninhadas. As entradas são derivadas do catálogo compartilhado em
`web/src/pages.js`, também usado pela interface e por `npm run check:build`.

Na página inicial, acione os três botões “Saiba mais” e o item Oficinas no
cabeçalho desktop, no menu móvel e no rodapé. Confira a correspondência entre
os destinos e a tabela acima. Confira também as três linhas da parceria no
rodapé, conforme o [roteiro institucional](../006-landing/quickstart.md).
Repita com uma compilação na base `/` para desenvolvimento local e domínio
próprio. Encerre o servidor após a conferência.

O build PWA não comprova instalação, atualização ou offline em um navegador.
Registre somente os exercícios realmente executados em [verification.md](verification.md).

## API adiada

Não existe workflow de API nesta entrega. O futuro deploy no VPS Hostinger
será especificado quando houver servidor e funcionalidade a implantar.
