# Deploy: Vercel + Render + Neon

> Para a migração atual, siga [Vercel + Neon + R2](./DEPLOY_VERCEL_R2.md).
> Este documento descreve a hospedagem anterior; o proxy citado foi desativado.

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
| Health Check Path | `/api/health` |
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

## Painel administrativo

O painel fica em `/admin` e o login em `/admin/login`.
O primeiro acesso é criado pelas variáveis **do serviço da API no Render**:

```text
ADMIN_NAME=Seu nome
ADMIN_EMAIL=seu@email.com
ADMIN_PASSWORD=uma senha exclusiva com pelo menos 12 caracteres
```

Defina os valores no Render e faça o deploy. Na primeira inicialização, a API cria
as tabelas de usuários e sessões e o primeiro administrador. Se já existir um
administrador ativo, essas variáveis não alteram a conta existente. Não use
prefixo `REACT_APP_` nessas variáveis e não envie a senha para o Git.
Depois de conseguir entrar, remova `ADMIN_PASSWORD` do Render e salve novamente.

Alternativa local: com `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` e
opcionalmente `ADMIN_NAME` definidos no `.env`, execute `npm run create-admin`.
Nenhum administrador ou senha padrão é distribuído com o código.

Em **Usuários**, administradores podem criar contas, trocar o perfil,
desativar acessos e redefinir senhas. Editores podem gerenciar o catálogo.
Não existe cadastro público para a equipe. As rotas antigas `/login` e
`/register` encaminham para o login administrativo.

Senhas são armazenadas como hash bcrypt. As sessões duram 12 horas, são
revogadas no logout ou na desativação/redefinição de senha e ficam no PostgreSQL
apenas como hash. No navegador, o identificador de sessão fica no sessionStorage
da aba. A API exige autenticação para salvar animes e oculta rascunhos de visitantes.

Novos animes recebem data de cadastro no servidor. Os registros importados
antes dessa atualização não têm data original conhecida e aparecem como
"Cadastro anterior"; entre eles, a tabela usa o ID decrescente.

### Testes

- `npm run test:server`: validações locais; testes de integração são pulados sem
  `TEST_DATABASE_URL`.
- Com `TEST_DATABASE_URL` configurada, os testes criam um schema temporário
  aleatório no PostgreSQL e o removem ao finalizar, sem usar as tabelas públicas.
  No Neon, a conexão direta é usada nos testes porque o pooler não permite
  `search_path` nos parâmetros de inicialização.
- `CI=true npm run build`: build com avisos tratados como erros.

### Carregamento do catálogo público

A home e as páginas públicas usam `/api/animes/public`, sem esperar pela sessão
administrativa. O endpoint contém somente animes publicados e mantém um cache
em memória por 30 segundos. Gravações e exclusões na API invalidam esse cache.
A resposta tem ETag e permite revalidação HTTP sem transferir novamente os dados
quando o conteúdo não mudou. O painel continua usando a consulta autenticada,
sem cache público, para carregar rascunhos e editar a versão atual dos dados.

O navegador guarda somente o catálogo público por até cinco minutos. Ao retornar
ao site, ele exibe essa cópia imediatamente e consulta a API em segundo plano.
Se a atualização falhar, a página mantém os dados salvos e oferece nova tentativa.
As esperas simuladas de dois segundos da home e dos carrosséis foram removidas.

Faça o deploy da API no Render antes do frontend na Vercel, pois o frontend usa
o novo endpoint público. Nenhuma variável de ambiente adicional é necessária.

Se o serviço estiver no plano Free, o Render pode suspender a API após 15 minutos
sem tráfego e levar cerca de um minuto para reativá-la. O cache ajuda nas visitas
seguintes, mas não elimina essa espera no primeiro acesso sem uma cópia salva.
Referência: https://render.com/docs/free#spinning-down-on-idle

### Ping externo para reduzir partidas a frio

O workflow [Keep API awake](.github/workflows/keep-alive.yml) faz um GET a cada
10 minutos em `/api/health`. Essa rota retorna `{"status":"ok"}`, sem login,
consulta ao banco ou transferência do catálogo. Ela verifica apenas se a API
está respondendo; não comprova que o banco ou o catálogo estão disponíveis.

Para ativar:

1. Publique as alterações na branch padrão do GitHub e faça o deploy da API no Render.
2. No Render, configure **Health Check Path** como `/api/health` se o serviço
   existente não for atualizado pelo Blueprint.
3. No GitHub, abra **Settings → Secrets and variables → Actions → Variables**
   e crie `API_BASE_URL` com a origem HTTPS real da API (sem caminho), por exemplo
   `https://SEU-SERVICO.onrender.com`. Não coloque a URL do frontend nem credenciais.
4. Em **Actions → Keep API awake → Run workflow**, execute uma vez e confira o
   código HTTP e o tempo de resposta. Sem `API_BASE_URL`, o job é ignorado.
   Não é necessário configurar `KEEP_ALIVE_ENABLED`.

O agendamento funciona na branch padrão, mesmo com o navegador fechado. Um timer
no próprio servidor não conseguiria acordá-lo quando estivesse suspenso.
GitHub Actions pode atrasar ou omitir execuções e desativar agendamentos de
repositórios públicos após 60 dias sem atividade. Portanto, esse ping é uma
mitigação, não uma garantia de disponibilidade. Considere os minutos do Actions
e a franquia de horas do Render: manter o serviço ativo consome essas cotas.

O Neon ainda pode suspender o banco independentemente do Render, pois esse ping
não consulta o PostgreSQL. Se o atraso persistir com `/api/health` rápido,
compare os tempos de `/api/auth/login` e `/api/animes/public` na aba Network do
navegador e os logs do banco. Para disponibilidade contínua, use um plano da API
sem suspensão e avalie separadamente a configuração de suspensão do banco.

### Suspensão por franquia de tráfego

O ping não reativa serviços suspensos por esgotamento de banda. Segundo o aviso
do Render, a recuperação exige adicionar pagamento, mudar de plano ou aguardar
a renovação mensal. Para voltar antes disso sem pagar ao Render, é necessário
implantar a API em outro provedor com franquia suficiente.

O proxy em `server/media.js`, na rota `/api/media/discord`, retransmite vídeos
do Discord para o navegador. Todo esse conteúdo passa pela saída da API;
dez transferências de 500 MB representam aproximadamente 5 GB, sem contar
repetições e outros acessos. Esse é um candidato a consumo alto, mas confirme
no painel de uso do workspace quais serviços consumiram a franquia. O pequeno
JSON de `/api/health` não permite atribuir os 5 GB ao workflow.

Durante a suspensão:

1. O workflow permanece habilitado, mas os pings não removem a suspensão.
   A alteração do workflow precisa estar publicada na branch padrão para valer
   no GitHub.
2. Escolha entre regularizar a franquia, aguardar a renovação ou migrar a API.
3. Em uma migração, configure no novo serviço as variáveis necessárias da API,
   incluindo `DATABASE_URL` do banco atual, `FRONTEND_URL` e `NODE_ENV`.
   Use `npm ci`, `npm run start-server` e verifique `/api/health` e o catálogo.
   Não reimporte o catálogo nem recrie o banco para trocar apenas a hospedagem.
4. Atualize `REACT_APP_API_URL` no Vercel e reconstrua o frontend. Atualize também
   `API_BASE_URL` no GitHub para os pings usarem o novo serviço.

Para reduzir o consumo de forma duradoura, sirva os vídeos por uma hospedagem
de mídia que permita acesso direto do player, incluindo CORS e requisições Range.
Trocar o proxy por uma URL direta sem verificar esses requisitos pode quebrar
a reprodução MKV. Mover o mesmo proxy para outra franquia pequena apenas muda
onde o tráfego será contabilizado.
