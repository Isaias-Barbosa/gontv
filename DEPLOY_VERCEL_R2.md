# Vercel + Neon + Cloudflare R2

Frontend e API usam o mesmo projeto Vercel. O Neon mantém catálogo, usuários e
sessões existentes. Vídeos e leitura de legendas internas vão diretamente
da hospedagem de mídia para o navegador, sem retransmissão pela API.

## Publicar no Vercel

1. Publique as alterações na branch conectada ao projeto existente do frontend.
2. Use a raiz do repositório como Root Directory e o preset Create React App.
   [vercel.json](./vercel.json) define build `npm run build`, saída `build`,
   a função [api/index.js](./api/index.js) e o fallback das páginas React.
3. Nas variáveis **Production** do projeto Vercel, configure:

   | Variável | Valor |
   | --- | --- |
   | `DATABASE_URL` | Conexão com pooler do banco Neon atual, mantendo SSL |
   | `FRONTEND_URL` | Origem pública real, como `https://gontv.vercel.app`, sem barra final |
   | `NODE_ENV` | `production` |

4. **Remova `REACT_APP_API_URL` do Vercel**, inclusive a URL antiga do Render.
   Sem essa variável, a build de produção usa `/api` no domínio do site.
   Localmente, a API continua em `http://127.0.0.1:3001`.
5. Faça uma nova build/deploy. Alterar variáveis sem reconstruir não basta.
6. Confira `/api/health`, `/api/animes/public`, login e edição no painel.
   Saúde retorna 200 mesmo sem banco: nesse caso o catálogo retorna 503.
7. No GitHub, ajuste `API_BASE_URL` para a origem do site Vercel. O workflow
   continua habilitado a cada 10 minutos. Em serverless, pings não garantem
   uma instância permanente e contam como invocações.

Não execute a importação do catálogo para trocar de hospedagem. Usuários e
sessões permanecem no mesmo Neon. O bootstrap `ADMIN_PASSWORD` do processo
local não é executado pela função Vercel; use os administradores existentes.
Para um banco novo, execute `npm run create-admin` localmente com as variáveis
adequadas, sem colocar credenciais no frontend.

O pool é reutilizado por instância e limitado a três conexões. Use o endereço
com pooler do Neon; várias instâncias serverless ainda podem abrir conexões.
No Vercel, banco ausente retorna erro em vez de usar armazenamento local efêmero.
Previews exigem banco de teste e uma origem autorizada própria para testar login.

## Preparar vídeos no R2

**R2 armazena arquivos, não apenas links externos.** Um vídeo de 500 MB ocupa
500 MB mesmo se for importado de um link. Cerca de 20 arquivos desse tamanho
ocupam 10 GB. O painel GonTV continua cadastrando URLs; ele não copia arquivos.

1. Ative o R2 na conta Cloudflare e crie um bucket Standard para os vídeos.
2. Envie um arquivo de teste pelo painel Cloudflare. Para importar de outra URL,
   baixe/envie por uma ferramenta local, sem passar os bytes pela API Vercel.
3. Conecte um domínio próprio ao bucket para produção. A URL `r2.dev` serve para
   testes e tem limitação de requisições; não é a opção de produção.
4. Em **Settings → CORS Policy**, cole [r2-cors.json](./r2-cors.json).
   Ajuste `AllowedOrigins` se o domínio do frontend for diferente.
   Esse JSON é para o painel, não o formato de configuração do Wrangler.
5. Cadastre no episódio a URL pública completa do objeto, preservando a extensão,
   por exemplo `https://videos.seudominio.com/anime/episodio-01.mp4`.
   Use `video/mp4`, `video/webm` ou `video/x-matroska` como Content-Type apropriado.
6. Teste reprodução, avanço para outro ponto e extração de legendas em um MKV.
   No Network do navegador, os bytes devem vir do domínio de mídia; requisições
   Range devem retornar 206 e Content-Range. Nenhum vídeo deve ir a `/api/media`.

R2 não converte codecs. MKV depende dos codecs e do navegador. A extração de
legendas internas pode ler bastante do arquivo, mas agora essa leitura vai direto
à hospedagem de mídia.

O extrator seleciona apenas faixas identificadas como português brasileiro pelo
idioma ou nome: `pt-BR`, `por-BR`, `Brazilian`, `Portuguese Brazil`,
`Português Brasil` e variações de acentos/separadores. `por`, `pt` ou
`Portuguese` sem indicação de Brasil são ambíguos e ficam de fora, assim como
faixas identificadas como Portugal. Todas as faixas brasileiras correspondentes
são preservadas (por exemplo, completa e forçada). Blocos de outros idiomas são
descartados antes de decodificar as falas. Isso reduz processamento e texto
extraído, mas a leitura sequencial ainda pode transferir o MKV inteiro.
Esse filtro não implementa upload ou armazenamento de legendas no R2.

O endpoint antigo `/api/media/*` retorna 410, inclusive para clientes antigos,
para impedir novo consumo de vídeo na API. Links externos sem CORS podem tocar
no player, mas falhar na leitura de legendas; substitua-os por URLs R2 configuradas.
Nenhum link existente foi alterado automaticamente e nenhum arquivo foi enviado.

Não é necessário fornecer chaves R2 ao GonTV para reproduzir objetos públicos.
Nunca cadastre credenciais S3 como URL de episódio. CORS não torna arquivos
privados nem impede downloads fora do navegador.

## Referências

- [Vercel Functions Node.js](https://vercel.com/docs/functions/runtimes/node-js)
- [R2 CORS](https://developers.cloudflare.com/r2/buckets/cors/)
- [R2 domínio público](https://developers.cloudflare.com/r2/buckets/public-buckets/)
- [R2 preços](https://developers.cloudflare.com/r2/pricing/)

R2 Standard inclui 10 GB-mês de armazenamento, com cobrança acima da franquia,
e não cobra saída de dados. Requisições também têm franquias e podem ser cobradas.
