# Executar e conferir a página institucional

Na pasta `web`, com Node.js 24+ e dependências instaladas:

```bash
npm ci
npm run dev
```

Abra `http://localhost:5173/`. A apresentação institucional, `/login` e `/feira`
não exigem que o backend esteja disponível. O acesso direto a `/login` deve
exibir a mensagem de futuro aplicativo; `/feira` deve apresentar o título
“Feira” e a mensagem de página em construção. Ambas permitem retornar ao site.
O conteúdo da feira segue o português do Brasil autorizado para a apresentação
institucional em `006-landing`.

## Verificações locais

```bash
npm run lint
npm test
npm run build
npm run preview
```

`npm test` executa os sete testes isolados de dados e composição dos filtros
com o runner nativo do Node.js, sem exigir o backend.

Na raiz, execute `python3 scripts/validate-specs.py`. Registre resultados em
[verification.md](verification.md), distinguindo build e uso em navegador.

## Roteiro de comportamento

1. Confira hero, marcas, nove seções, três oficinas, equipe e rodapé.
2. Navegue por links internos e confira o menu em celular e desktop.
3. Abra a rede: alterne as abas e confira 21 escolas e nove campi.
4. Combine nome e município, confira o estado sem resultados e abra detalhes.
5. Ative Aplicativo, recarregue `/login` e `/login/` diretamente e retorne ao site.
6. Confira os botões rosa Feira no cabeçalho desktop, no menu móvel e ao lado
   de Conheça Mais. Ative cada um e confira `/feira`, o título “Feira”, a mensagem
   “A página da feira está em construção. Em breve, você encontrará aqui mais
   informações.” e o retorno ao site. Repita o acesso direto a `/feira` e `/feira/`.
7. Use somente teclado e confira foco e controles expansíveis.
8. Repita com movimento reduzido; o conteúdo deve permanecer disponível.
9. Inspecione a rede na página inicial, em `/login` e em `/feira`: nenhuma deve
   enviar chamadas `/api/*`.
10. Em um primeiro acesso sem cache, atrase CSS ou módulo principal e confira
   fundo escuro, indicador de carregamento e ausência de conteúdo desformatado.
11. Libere os recursos e confira a apresentação pronta; simule falhas e confirme
    recuperação legível sem espera infinita. Repita sem JavaScript e com
    movimento reduzido, verificando também foco e acesso ao conteúdo.

Para produção, o build de [007-web-delivery](../007-web-delivery/spec.md)
fornece entradas HTML físicas para `login/` e `feira/`, sem depender de fallback
SPA. Em um site de projeto do Pages, os caminhos incluem o prefixo de publicação.
Instalação, atualização e offline PWA exigem origem adequada e navegador
compatível; a geração de `sw.js` não comprova esses comportamentos sozinha.
