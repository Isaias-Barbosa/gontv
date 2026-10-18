# Player de episódios e legendas MKV

Links diretos MP4, WebM, M4V, MOV, OGV e MKV cadastrados nas URLs de vídeo do
episódio são abertos no DPlayer. Links de páginas de embed continuam em iframe.
Fontes `.torrent` encaminham para o Player Torrent.

## Uso

1. No painel, edite o episódio e cole o link direto em uma das fontes/qualidades.
2. Abra o episódio no site. Para um MKV, a busca de legendas começa na primeira
   reprodução; também é possível iniciá-la em **Buscar legendas**, sem dar play.
3. As faixas aparecem durante a leitura. Português é selecionado automaticamente
   quando disponível; uma escolha manual de idioma ou **Desativadas** é respeitada.
4. **Interromper busca** cancela a transferência e mantém as falas já carregadas.
   Para ler o restante, **Buscar novamente** reinicia a busca desde o começo.
5. **Alternar CDN / Media** troca entre os dois hosts de anexos do Discord,
   preservando os parâmetros assinados do link. Use um link atualizado se expirou.

A busca pode transferir o arquivo MKV inteiro, além do tráfego do vídeo. O worker
descarta áudio e vídeo e guarda somente as falas. As legendas são temporárias na
aba: não são salvas no Neon nem em arquivos no servidor. Ao avançar para uma parte
que ainda não foi lida, as legendas correspondentes podem ainda não estar disponíveis.

## Formatos

- SRT (`S_TEXT/UTF8`), ASS/SSA e WebVTT de Matroska/WebM: extração de texto,
  idioma, início e duração. ASS/SSA são simplificadas; fontes, posições, desenhos
  e efeitos de karaokê não são reproduzidos.
- Legendas em imagem (PGS/VobSub), faixas comprimidas/encriptadas e blocos com
  lacing de legendas não são decodificados.
- O vídeo depende do suporte do navegador ao contêiner e aos codecs internos.
  Esta atualização não faz transcodificação. H.264/AAC costuma oferecer melhor
  compatibilidade; HEVC, DTS e outros codecs podem exigir outra fonte/navegador.
- Links de outros hosts precisam permitir CORS para a extração das legendas.

## API e deploy

`GET /api/media/discord?url=...` permite leitura progressiva de anexos MKV/WebM
somente em `cdn.discordapp.com` e `media.discordapp.net`, em HTTPS e no caminho
`/attachments/`. Encaminha Range e interrompe a leitura quando o cliente desconecta.
Não segue redirecionamentos nem aceita hosts arbitrários. O CORS existente da API
continua usando `FRONTEND_URL`. O tráfego das legendas do Discord passa pela API.

Faça deploy da API no Render e do frontend no Vercel. Não há novas variáveis de
ambiente, dependências ou migrações de banco para esta atualização. O worker é
empacotado na build do frontend.

## Verificações

- `npm test -- --watchAll=false --runInBand`: parser incremental e integração do
  player, além das demais telas.
- `node --test server/media.test.js`: allowlist de URL, Range e recusa de redirects.
- `CI=true npm run build`: build de produção.

Referências: [DPlayer](https://dplayer.diygod.dev/guide.html) e
[Matroska: Subtitle Codecs](https://www.matroska.org/technical/subtitles.html).
