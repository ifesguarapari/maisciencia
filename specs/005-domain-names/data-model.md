# Modelo de dados: renomeação

Os documentos e seus campos mantêm o formato atual. A mudança afeta os nomes
das coleções e a identidade de acesso do domínio de administração, conforme
o mapeamento em [spec.md](spec.md).

O MongoDB continua centralizado. `authentication` permanece responsável por
`users`, `sessions` e `recoveries`; o BFF continua sem acesso direto ao banco.
Os índices existentes devem acompanhar a renomeação das coleções. Não há
transformação de documentos nem mesclagem automática de destinos existentes.
