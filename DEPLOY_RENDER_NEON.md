# Deploy no Render com Neon

1. Crie um projeto PostgreSQL no Neon e copie a connection string (`DATABASE_URL`).
2. No Render, crie os dois serviços usando [`render.yaml`](./render.yaml): `gontv-api` e `gontv-frontend`.
3. No serviço `gontv-api`, configure `DATABASE_URL` com a string do Neon e `FRONTEND_URL` com a URL pública do frontend.
4. No serviço `gontv-frontend`, configure `REACT_APP_API_URL` com a URL pública da API e faça um novo deploy.
5. Depois que a API estiver com `DATABASE_URL` configurada, execute localmente, usando a mesma variável:

```text
npm install
npm run migrate-postgres
```

O comando importa [`data/catalog.json`](./data/catalog.json) para as tabelas `animes` e `episodes`. Depois disso, a API mantém o mesmo contrato `/api/animes`, então o React continua usando `usePublicAnimes()` normalmente.
