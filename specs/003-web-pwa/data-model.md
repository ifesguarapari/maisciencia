# Modelo do estado da página

O frontend não mantém banco de dados local. O estado do componente Alpine é
transitório; recarregar a página consulta novamente o BFF.

| Estado | Representação | Ciclo de vida |
| --- | --- | --- |
| `user` | Identidade pública ou `null` | Restaurada na inicialização e removida após saída confirmada ou rejeição da sessão. |
| `csrfToken` | Texto opaco | Recebido do BFF, usado nos cabeçalhos e limpo com a identidade. |
| `sessionExpiresAt` | Data textual | Prazo absoluto apresentado pela interface. |
| `email`, `password` | Entradas de formulário | A senha é limpa ao fim da tentativa. |
| `authBusy`, `restoringSession` | Booleanos | Controlam disponibilidade de controles e carregamento. |
| `services` | Lista de `slug`, `name`, `available`, `status` | Oito identidades fixas, atualizadas por consulta agregada. |
| `checking`, `apiStatus` | Booleano e texto | Proteção contra consulta concorrente e mensagem da contagem. |
| `updateAvailable` | Booleano | Ativado quando o worker detecta nova versão. |

O identificador privado da sessão pertence ao cookie HttpOnly e não é um
campo desse modelo. O cache PWA contém arquivos estáticos, sem registro de
sessões nem fila de operações de negócio.
