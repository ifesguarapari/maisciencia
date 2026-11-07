# Executar e conferir a página institucional

Na pasta `web`, com Node.js 24+ e dependências instaladas:

```bash
npm ci
npm run dev
```

Abra `http://localhost:5173/`. A apresentação institucional e as seis páginas
provisórias não exigem que o backend esteja disponível. O acesso direto a `/login` deve
exibir a mensagem de futuro aplicativo; `/feira` deve apresentar o título
“Feira” e a mensagem de página em construção. Ambas permitem retornar ao site.
`/oficinas` deve informar a futura apresentação do planejamento e da execução
das oficinas. As três páginas individuais devem apresentar estes títulos:

| Caminho | Título |
| --- | --- |
| `/oficinas/ler` | Ler um Livro com Jogos |
| `/oficinas/lancar` | Lançar Foguetes com Precisão |
| `/oficinas/melhorar` | Melhorar a Cidade com Eletrônica |

As quatro páginas de oficinas devem exibir aviso de construção e retorno ao
site, em português do Brasil, como as demais páginas institucionais.

## Verificações locais

```bash
npm run lint
npm test
npm run build
npm run preview
```

`npm test` executa os testes isolados de dados, filtros e rotas com o runner
nativo do Node.js, sem exigir o backend.

Na raiz, execute `python3 scripts/validate-specs.py`. Registre resultados em
[verification.md](verification.md), distinguindo build e uso em navegador.

## Roteiro de comportamento

1. Confira hero, marcas, nove seções, três oficinas, equipe e rodapé.
2. Navegue por links internos e confira o menu em celular e desktop.
3. Abra a rede: alterne as abas e confira 21 escolas e nove campi.
4. Combine nome e município, confira o estado sem resultados e abra detalhes.
5. Confira que o hero apresenta somente Feira em rosa e Aplicativo em verde,
   sem Conheça Mais, e que ambos seguem o estilo dos equivalentes do cabeçalho:
   cantos de 6 px, borda e texto coloridos e fundo na mesma cor com 10% de
   opacidade para Feira e 7% para Aplicativo. Confira foco visível,
   reorganização em celular e ausência de rolagem horizontal.
   Ative Aplicativo no cabeçalho, no menu móvel e no hero;
   confira `/login`, recarregue `/login` e `/login/` diretamente e retorne ao site.
6. Confira os botões rosa Feira no cabeçalho desktop, no menu móvel e no hero.
   Ative cada um e confira `/feira`, o título “Feira”, a mensagem
   “A página da feira está em construção. Em breve, você encontrará aqui mais
   informações.” e o retorno ao site. Repita o acesso direto a `/feira` e `/feira/`.
7. Confira nos três cards o selo “OFICINA”, sem número, e a ausência da legenda
   Ambiente virtual e dos antigos links de marca. Cada botão “Saiba mais” deve
   seguir o estilo de Feira e Aplicativo: cantos de 6 px, borda e texto na cor
   da oficina e fundo na mesma cor com 10% de opacidade. Confira contraste e
   foco visível. Ative cada botão e confira a página correspondente da tabela
   acima e o retorno ao site.
8. Ative Oficinas no cabeçalho desktop, no menu móvel e no rodapé. Os três
   links devem abrir `/oficinas`, com título “Oficinas” e a mensagem “Esta página
   está em construção. Em breve, você poderá conhecer como as oficinas são
   planejadas e executadas.”. Confira o retorno ao site.
9. Recarregue diretamente as quatro rotas de oficinas, com e sem barra final.
   Confira os títulos e avisos de construção; nas páginas individuais, a mensagem
   deve ser “Esta página está em construção. Em breve, você encontrará aqui mais
   informações sobre esta oficina.”.
10. Confira no rodapé as três linhas exatas “Desenvolvido em parceria com:”,
    “Profe - Soluções Em Tecnologia Educacional Ltda” e “CNPJ: 66.907.525/0001-13”.
    Elas devem ficar no quadrante `.footer-identity`, dentro do mesmo parágrafo
    da missão, após “Ciência, tecnologia e inovação aproximando escolas e
    comunidades.”, sem faixa ou parágrafo separado. Confira a leitura em
    celular e desktop.
11. Confira “Voltar ao Início” no encerramento: cantos de 6 px, borda e texto
    na cor menta e fundo menta com 10% de opacidade, seguindo o estilo de Feira
    e Aplicativo. Ative o botão e confira o retorno ao início. Use somente
    teclado e confira foco visível nos botões e nos controles expansíveis.
12. Repita com movimento reduzido; o conteúdo deve permanecer disponível.
13. Inspecione a rede na página inicial e nas seis páginas provisórias: nenhuma
    deve enviar chamadas `/api/*`.
14. Em um primeiro acesso sem cache, atrase CSS ou módulo principal e confira
   fundo escuro, indicador de carregamento e ausência de conteúdo desformatado.
15. Libere os recursos e confira a apresentação pronta; simule falhas e confirme
    recuperação legível sem espera infinita. Repita sem JavaScript e com
    movimento reduzido, verificando também foco e acesso ao conteúdo.

Para produção, o build de [007-web-delivery](../007-web-delivery/spec.md)
fornece sete entradas HTML: a inicial e `index.html` em `login/`, `feira/`,
`oficinas/`, `oficinas/ler/`, `oficinas/lancar/` e `oficinas/melhorar/`, sem
depender de fallback SPA. Repita o roteiro em um servidor estático comum e na
base `/maisciencia/`, incluindo as rotas aninhadas, os recursos e o retorno
dentro do prefixo. O roteiro de [007](../007-web-delivery/quickstart.md)
explica como preparar essa conferência.
Instalação, atualização e offline PWA exigem origem adequada e navegador
compatível; a geração de `sw.js` não comprova esses comportamentos sozinha.
