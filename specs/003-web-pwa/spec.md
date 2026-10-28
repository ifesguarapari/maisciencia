# Especificação: interface web e PWA

**Feature**: `003-web-pwa` | **Captura**: 2026-10-27  
**Estado**: baseline retrospectiva; validação em navegador não registrada.

Este inventário registra a interface existente na adoção de SDD. Não afirma
que o código original foi desenvolvido a partir destes artefatos. Os nomes
atuais incorporam a evolução posterior registrada em `005-domain-names`.

## Histórias e aceitação

### US1 — Usar a identidade no navegador (prioridade P1)

Como pessoa com conta, quero entrar, recuperar minha identidade, renovar o
acesso e sair pela interface para controlar minha sessão.

- Dada uma sessão válida, quando a página inicia, então recupera a identidade.
- Dadas credenciais válidas, quando envio o formulário, então vejo a identidade
  e a expiração; a senha digitada é limpa após a tentativa.
- Dada uma sessão, quando solicito renovação ou saída, então a interface envia
  a prova CSRF e apresenta a resposta recebida sem expor o identificador privado.
- Dada falha de dependência ao sair, quando a operação falha, então a interface
  não apresenta uma saída confirmada nem apaga uma identidade ainda não rejeitada.

### US2 — Consultar disponibilidade (prioridade P2)

Como pessoa usuária, quero consultar a disponibilidade das capacidades para
entender quais processos estão respondendo.

- Dada uma consulta, quando há resposta agregada, então vejo os oito serviços
  e a contagem dos disponíveis.
- Dada falha da consulta, quando ela termina, então os serviços são apresentados
  como indisponíveis e o controle de consulta volta a ser utilizável.

### US3 — Instalar e atualizar a interface (prioridade P2)

Como pessoa usuária, quero instalar a aplicação e receber aviso de atualização
para usar a interface estática sob o ciclo de vida da PWA.

- Dado um navegador compatível e uma origem adequada, quando os requisitos de
  instalação são satisfeitos, então o manifesto permite uma instalação standalone.
- Dada uma versão nova detectada, quando o aviso aparece, então posso solicitar
  a atualização explicitamente.
- Dados os recursos estáticos previamente carregados, quando a rede falha,
  então o cache pode atender esses recursos sem simular uma sessão autenticada
  ou armazenar respostas da API.

## Requisitos

- **FR-001**: A interface DEVE recuperar a sessão ao iniciar e disponibilizar
  entrada, renovação e saída conforme o contrato do backend web.
- **FR-002**: A interface DEVE manter a prova CSRF somente no estado da página,
  enviar cookies nas chamadas e não persistir o identificador privado em JavaScript.
- **FR-003**: A interface DEVE limpar a senha após cada tentativa, impedir
  submissões concorrentes e apresentar falhas de sessão compreensíveis.
- **FR-004**: A consulta de disponibilidade DEVE apresentar os oito serviços e
  uma contagem, conservando a identidade de cada capacidade.
- **FR-005**: Chamadas ao backend DEVEM evitar cache e ter um prazo finito de espera.
- **FR-006**: A PWA DEVE disponibilizar manifesto e ícones para instalação e
  cache estático, excluindo rotas da API da navegação substituta.
- **FR-007**: Uma atualização detectada DEVE ser apresentada com ação explícita da pessoa.
- **FR-008**: A interface e seus identificadores DEVEM usar inglês e oferecer
  rótulos para formulários, mensagens de estado e operação por controles HTML.

## Critérios de sucesso

- **SC-001**: Entrada, recarga, renovação e saída operam pelo BFF sem token
  privado no estado ou armazenamento do frontend.
- **SC-002**: A consulta diferencia as oito identidades e apresenta a contagem correta.
- **SC-003**: O build gera manifesto, service worker e recursos de instalação.
- **SC-004**: Navegador compatível confirma instalação, aviso de atualização,
  cache estático e ausência de cache das respostas de sessão.

## Limites

Não há implementação de trabalho de negócio offline, fila de mutações,
sincronização de dados, cadastro público ou promessa de login sem rede.
Saúde de processo não comprova disponibilidade do banco nem autorização.
Comportamento de sessão é detalhado em [002-web-sessions](../002-web-sessions/spec.md).

## Evolução posterior da entrada pública

Em 2026-10-28, [006-landing](../006-landing/spec.md) substitui a demonstração
de sessão e saúde da página inicial por uma apresentação institucional em
português e `/login` provisório, sem requisições de API. Os requisitos desta
baseline descrevem a interface capturada em 2026-10-27; não impõem o formulário
antigo à nova página. O backend de sessões e seus controles continuam existentes.
