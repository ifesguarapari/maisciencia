# Pesquisa e decisões: página institucional

**Data**: 2026-10-28.

## Arquitetura existente

O documento sugere React, mas também requer HTML semântico, conteúdo
institucional e interações locais. Vite, Tailwind CSS e Alpine.js já atendem
essas responsabilidades. Manter essa base evita uma migração de framework
sem necessidade funcional. Reutilização ocorre em estilos, dados e estado,
sem criar uma camada React paralela.

## Idioma público

A solicitação específica determina português brasileiro em toda a interface.
A convenção anterior de interface em inglês recebe uma exceção para esta
página institucional e sua rota provisória. Código, identificadores, caminhos
e comentários continuam em inglês. A constituição registra a ampliação de
escopo na versão 1.1.0, preservando a data de adoção original.

## Integridade das informações

As fontes desta feature são o texto anexado e as imagens já presentes em
`web/public/images/`. Em resposta ao esclarecimento, o usuário autorizou
continuar com as instituições e a equipe já informadas. `site.docx` não foi
fornecido; os dados adicionais não serão deduzidos nem obtidos de homônimos.

Nomes de município dos campi seguem os próprios nomes fornecidos. A lista
identifica 21 escolas e nove campi; os cinco indicadores reproduzem os números
da proposta. Na apresentação inicial, as datas das oficinas eram períodos
previstos de 2026. Em revisão posterior, o usuário solicitou retirar esses
períodos e manter a apresentação reutilizável em outros anos.

## Recursos visuais

Preservar `ifes.svg`, `maisciencia.svg` e `background.webp`. Ilustrações
decorativas temáticas podem ser SVGs originais; não substituem marcas oficiais
nem fotografias de pessoas reais. As instituições de apoio sem marca fornecida
recebem identificação textual. Fontes locais evitam depender de requisições a
serviços de tipografia na visita pública.

## Acesso ao aplicativo

O pedido atual define uma rota `/login` provisória sem autenticação real.
Portanto, a antiga demonstração de sessão da página inicial não integra a
nova apresentação. O backend e seus controles continuam existentes; a landing
não tenta restaurar sessões ou medir saúde dos serviços.

## Ambientes virtuais das oficinas

Os três destinos HTTPS foram fornecidos pelo usuário e ficam associados às
oficinas conforme `contracts/ui.json`. A grafia “Foguetrõnica” foi mantida
conforme a solicitação. “Tecidade” é o rótulo inferido do domínio informado,
pois não foi fornecido um nome alternativo. Os links podem apontar a ambientes
ainda em desenvolvimento; não houve consulta ou validação de disponibilidade
desses sites. A mudança não cria funcionalidades neles.

## Projetos aprovados

Em 2026-10-28, o usuário forneceu os dois projetos que devem aparecer na área
“PROJETOS APROVADOS”, com seus processos CNPq e valores. A associação exata fica
em `contracts/ui.json`: o projeto de leitura e jogos tem valor de R$ 3 milhões;
o FEMAIS-ES tem valor de R$ 210 mil. Os dados vêm da solicitação, sem consulta
ou auditoria de fontes externas. Não se deduz um novo total para os indicadores
globais a partir desses valores individuais.
