const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const { createAniListRouter, normalizeAnime } = require('./anilist');
const media = { id:195604, idMal:61967, title:{romaji:'Anime de teste',english:'Test Anime',native:'Original'},format:'TV',status:'NOT_YET_RELEASED',description:'Sinopse<br>Texto &amp; detalhe',coverImage:{extraLarge:'https://example.com/cover.jpg'},bannerImage:'https://example.com/banner.jpg',startDate:{year:2026,month:null,day:null},season:'FALL',seasonYear:2026,duration:24,genres:['Action'],studios:{nodes:[{name:'Studio'}]},staff:{edges:[{role:'Director',node:{name:{full:'Diretor'}}}]}};
async function lookup(post, path, check) {
 const app=express();app.use('/api/anilist',createAniListRouter(post));const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
 try{const response=await fetch('http://127.0.0.1:'+server.address().port+'/api/anilist/anime/'+path);await check(response,await response.json())}finally{await new Promise(r=>server.close(r))}
}
test('normaliza imagens, sinopse, gêneros e data incompleta sem inventar dia',()=>{
 const data=normalizeAnime(media);assert.equal(data.title,'Anime de teste');assert.equal(data.bannerImage,media.bannerImage);assert.equal(data.synopsis,'Sinopse\nTexto & detalhe');assert.equal(data.status,'Not yet aired');assert.equal(data.aired.from,null);assert.equal(data.year,2026);assert.equal(data.director,'Diretor');assert.deepEqual(data.genres,[{name:'Action'}]);
});
test('consulta por ID do AniList usa id e não assume que seja ID do MAL',async()=>{
 await lookup(async(url,body)=>{assert.equal(url,'https://graphql.anilist.co');assert.deepEqual(body.variables,{id:195604});return {data:{data:{Media:media}}}},'195604',async(response,body)=>{assert.equal(response.status,200);assert.equal(body.anilist_id,195604);assert.equal(body.mal_id,61967)});
});
test('alternativa com ID MAL consulta idMal e aceita ID AniList diferente',async()=>{
 await lookup(async(url,body)=>{assert.deepEqual(body.variables,{idMal:61967});return {data:{data:{Media:media}}}},'by-mal/61967',async(response,body)=>{assert.equal(response.status,200);assert.equal(body.anilist_id,195604)});
});
test('erros opcionais GraphQL não descartam dados principais válidos',async()=>{
 await lookup(async()=>({data:{data:{Media:{...media,staff:null}},errors:[{message:'Staff unavailable'}]}}),'195604',async(response,body)=>{assert.equal(response.status,200);assert.equal(body.title,'Anime de teste');assert.equal(body.director,'');assert.equal(body.warnings.length,1)});
});
test('ID inválido não faz chamada e resultado de outro ID é rejeitado',async()=>{
 await lookup(async()=>{throw Error('Must not call')},'abc',async response=>assert.equal(response.status,400));
 await lookup(async()=>({data:{data:{Media:{...media,id:1}}}}),'195604',async response=>assert.equal(response.status,502));
});
test('anime inexistente retorna 404 inclusive com HTTP 200 do GraphQL',async()=>{
 await lookup(async()=>({data:{data:{Media:null},errors:[{status:404}]}}),'195604',async response=>assert.equal(response.status,404));
});
for(const [status,code,expected] of [[429,null,429],[503,null,502],[null,'ECONNABORTED',504]])test(`trata falha ${status||code} sem perder a distinção do erro`,async()=>{
 await lookup(async()=>{throw Object.assign(Error('Failed'),{response:{status},code})},'195604',async(response,body)=>{assert.equal(response.status,expected);assert.ok(body.error);if(expected===429)assert.equal(response.headers.get('retry-after'),'60')});
});

test('falha interna GraphQL com Media nulo não é apresentada como anime inexistente',async()=>{
 await lookup(async()=>({data:{data:{Media:null},errors:[{status:500,message:'Internal error'}]}}),'195604',async response=>assert.equal(response.status,502));
});
