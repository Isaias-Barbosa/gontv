# Deploy: Vercel + Render + Neon

O frontend fica no Vercel, a API Express no Render e o PostgreSQL no Neon.
O Vercel executa a build do React; isso não inicia `server/index.js`.

## 1. Banco no Neon

Copie a connection string do painel do Neon para `DATABASE_URL` na API do Render.
Mantenha os parâmetros de SSL fornecidos pelo Neon. Nunca use prefixo
`REACT_APP_` para credenciais do banco: essas variáveis ficam públicas no navegador.
O arquivo `.env` local não configura as variáveis do Render ou do Vercel.

Para importar o catálogo em um banco novo, configure a mesma `DATABASE_URL`
no `.env` local e execute:

```text
npm ci
npm run migrate-postgres
```

Esse comando atualiza animes existentes e substitui seus episódios pelos dados de
`data/catalog.json`. Não rode novamente em um banco já preenchido sem revisar os
 dados locais. A API cria as tabelas, mas não importa o catálogo automaticamente.

## 2. API no Render

Crie um **Web Service** conectado ao repositório e à branch `master`:

| Configuração | Valor |
| --- | --- |
| Runtime | Node |
| Build Command | `npm ci` |
| Start Command | `npm run start-server` |
| Health Check Path | `/api/animes` |
| `DATABASE_URL` | Connection string do Neon |
| `FRONTEND_URL` | `https://gontv.vercel.app` (sem barra final) |
| `NODE_ENV` | `production` |

O servidor usa `0.0.0.0` e a porta definida pelo Render em `PORT`.
Também é possível criar a API usando a entrada `gontv-api` de `render.yaml`;
a entrada `gontv-frontend` é opcional para quem hospedar o frontend no Render.

Depois do deploy, abra `https://SEU-SERVICO.onrender.com/api/animes`.
A resposta deve ser JSON com `storage: "postgres"` e o catálogo em `animes`.

## 3. Frontend no Vercel

Em **Project Settings → Environment Variables**, configure:

```text
REACT_APP_API_URL=https://SEU-SERVICO.onrender.com
```

Use a URL pública real da API, sem `/api/animes` e sem barra final.
Aplique em **Production**. Para previews, a origem também precisa ser autorizada
pela API; `FRONTEND_URL` acima autoriza o domínio de produção.

Faça um novo deploy depois de salvar a variável: o React incorpora esse valor
na build. Não basta reiniciar um deploy antigo sem reconstruir o frontend.

## Diagnóstico

- Requisição para `127.0.0.1:3001`: variável ausente ou incorreta na build do Vercel.
- `/api/animes` retorna HTML no domínio do Vercel: a requisição está no frontend,
  não no Web Service do Render.
- Erro de CORS: confira `FRONTEND_URL` no Render, incluindo `https://` e sem barra final.
- Erro de conexão PostgreSQL: confira `DATABASE_URL` e os logs da API.
- Catálogo vazio com `storage: "postgres"`: confira se a API usa o banco correto
  antes de executar qualquer importação.
