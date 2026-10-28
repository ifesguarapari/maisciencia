# Plano: nomes dos domínios

## Solução técnica

Mover `api/services/management` para `api/services/administrations`; atualizar
factory, Compose, Kong, BFF, frontend, configuração Poetry e testes. A rota
pública passa a `/api/administrations`. O usuário Mongo passa a `administrations`
e sua senha usa `ADMINISTRATIONS_DB_PASSWORD`, preservando o valor atual.

Substituir as seis coleções compostas pelo mapeamento de [spec.md](spec.md).
Manter responsabilidades, autenticação e regras existentes. Atualizar a
constituição e os documentos que antes preservavam a identidade antiga.

## Dados existentes

O script de inicialização só atende volumes vazios. Uma ferramenta administrativa
separada deverá inspecionar nomes e conflitos, operar em modo sem mutações por
padrão e exigir opção explícita para aplicar. Não deve mesclar nem sobrescrever
coleções de destino. A documentação descreverá a parada dos serviços durante a
migração, cópia de segurança, credenciais administrativas e recuperação.

## Rastreabilidade

| Requisito | Arquivos e verificação |
| --- | --- |
| FR-001 | `api/services/administrations/`, Compose, Kong, BFF, frontend e testes de runtime |
| FR-002 | `api/mongo/init-services.js`, factories e contratos da baseline 001 |
| FR-003 | `.env` ignorados; inspeção sem divulgar valores |
| FR-004 | ferramenta administrativa em `api/mongo/`, cenários de conflito e documentação |
| FR-005 | baselines 001–003, docs e `verification.md` |

## Verificação planejada

Executar testes API, Black/Pylint, ESLint/build e validação estrutural SDD.
Verificar sintaxe e comportamento da ferramenta com simulação, distinguindo
essa evidência de uma migração com MongoDB real. Não iniciar nem alterar volumes.
