# Gon.TV

Projeto de estudo em React para organizar um catálogo demonstrativo de animes e URLs de episódios. Os dados podem ser gravados localmente ou sincronizados com um Bin privado do Jsonbin.

## Executar localmente

Instale as dependências com `npm install`. Em terminais separados, inicie a API e o React:

```text
npm run start-server
npm start
```

A API local atende em `http://127.0.0.1:3001`; o React usa esse endereço por padrão. Se necessário, configure `REACT_APP_API_URL` no `.env`. Abra `http://localhost:3000`.

## Dashboard administrativa

Acesse `http://localhost:3000/admin` para gerenciar o catálogo:

- `/admin/animes`: listar, buscar, editar, publicar/rascunhar e excluir animes;
- `/admin/animes/new`: cadastrar anime;
- cada anime tem uma tela de gerenciamento de episódios, com cadastro, edição e exclusão;
- episódios guardam URLs de demonstração por resolução. Não há upload nem hospedagem de vídeos.

O layout administrativo é separado do menu público. Esta versão é um protótipo de estudo e não implementa autenticação; não exponha o servidor da API à internet sem adicionar autenticação e autorização.

## Unificação inicial dos dados

`src/json/animes.json` contém o catálogo editorial usado pelo site. `data/animes.json` contém registros importados da Jikan. Gere o formato único executando:

```text
npm run merge-animes
```

O comando cria `data/catalog.json`. Ele combina os registros pelo slug e, quando necessário, por título normalizado. Os campos editoriais e episódios existentes têm precedência; dados Jikan completam os campos ausentes. Registros sem correspondência são criados como rascunhos sem episódios. Execute a migração novamente apenas se quiser reconstruir o catálogo a partir dos dois arquivos de origem.

## Jsonbin

1. Copie `.env.example` para `.env` e informe sua chave master em `JSONBIN_MASTER_KEY`.
2. Crie um Bin privado com o catálogo unificado:

   ```text
   npm run create-jsonbin-bin
   ```

3. Copie o `JSONBIN_BIN_ID` exibido para `.env`, sem compartilhar a chave master.
4. Reinicie `npm run start-server`.

O React não recebe a chave: as leituras e gravações passam pelo servidor Express. Sem as duas variáveis `JSONBIN_MASTER_KEY` e `JSONBIN_BIN_ID`, o servidor usa `data/catalog.json` como armazenamento local. Se apenas uma variável estiver definida, a API informa erro de configuração em vez de alternar silenciosamente de armazenamento.

## Outros comandos

```text
npm run build
npm test
```
