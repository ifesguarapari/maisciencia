# Conferir os novos nomes

Em um ambiente novo configurado, na pasta `api`:

```bash
docker compose config --quiet
docker compose up -d --build
curl http://localhost:8000/api/administrations/health
```

Para um volume existente, consulte antes a seção de migração em
[api/README.md](../../api/README.md). Não recrie o volume para aplicar nomes.
A preparação e a inspeção administrativa precedem a troca dos consumidores.
