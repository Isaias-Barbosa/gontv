const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { Pool } = require('pg');
const { createAuth, bootstrapAdmin, validEmail, validPassword } = require('./auth');

test('validação de credenciais', () => {
  assert.equal(validEmail('equipe@example.com'), true);
  assert.equal(validEmail('invalido'), false);
  assert.equal(validPassword('curta'), false);
  assert.equal(validPassword('uma-senha-bem-segura'), true);
  assert.equal(validPassword('a'.repeat(73)), false);
});

test('autenticação e dashboard em schema PostgreSQL isolado', {skip:!process.env.TEST_DATABASE_URL}, async t => {
  const schema = 'gontv_test_' + crypto.randomBytes(8).toString('hex');
  const url = new URL(process.env.TEST_DATABASE_URL);
  // Neon pooled connections reject startup search_path; isolate tests on a direct connection.
  if (url.hostname.endsWith('.neon.tech')) url.hostname = url.hostname.replace('-pooler.', '.');
  const control = new Pool({connectionString:url.href,ssl:{rejectUnauthorized:true},connectionTimeoutMillis:15000});
  let server, pool;
  await control.query(`CREATE SCHEMA ${schema}`);
  try {
    url.searchParams.set('options', '-c search_path=' + schema);
    process.env.DATABASE_URL = url.href;
    process.env.FRONTEND_URL = 'https://gontv.vercel.app';
    const instance = require('./index');
    pool = instance.postgresPool;
    const auth = createAuth(pool);
    assert.equal(await bootstrapAdmin(pool,auth,{name:'Admin Teste',email:'admin@example.com',password:'admin-password-123'}),true);
    assert.equal(await bootstrapAdmin(pool,auth,{name:'Outro',email:'outro@example.com',password:'admin-password-456'}),false);
    server = instance.app.listen(0,'127.0.0.1');
    await new Promise(resolve => server.once('listening',resolve));
    const base = 'http://127.0.0.1:' + server.address().port;
    const request = async (path,{method='GET',token,body}={}) => {
      const response = await fetch(base+path,{method,headers:{'Content-Type':'application/json',Origin:'https://gontv.vercel.app',...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{})});
      return {status:response.status,headers:response.headers,data:response.status===204?null:await response.json()};
    };
    let admin, editor, editorId;
    await t.test('visitantes não podem escrever nem acessar usuários',async()=>{
      assert.equal((await request('/api/animes',{method:'PUT',body:{animes:[]}})).status,401);
      assert.equal((await request('/api/admin/users')).status,401);
      assert.equal((await request('/api/auth/login',{method:'POST',body:{email:'admin@example.com',password:'wrong-password-123'}})).status,401);
    });
    await t.test('login retorna usuário sem hash e sessão armazenada apenas como hash',async()=>{
      const result=await request('/api/auth/login',{method:'POST',body:{email:'ADMIN@example.com',password:'admin-password-123'}});
      assert.equal(result.status,200);assert.equal(result.data.user.password_hash,undefined);
      assert.equal(result.headers.get('access-control-allow-origin'),'https://gontv.vercel.app');
      admin=result.data.token;
      const stored=await pool.query('SELECT token_hash FROM admin_sessions');
      assert.notEqual(stored.rows[0].token_hash,admin);
      assert.equal((await request('/api/auth/me',{token:admin})).data.user.role,'admin');
    });
    await t.test('criação de editor, e-mail duplicado e validação',async()=>{
      const body={name:'Editor Teste',email:'editor@example.com',password:'editor-password-123',role:'editor'};
      const created=await request('/api/admin/users',{method:'POST',token:admin,body});
      assert.equal(created.status,201);editorId=created.data.user.id;
      assert.equal(created.data.user.password_hash,undefined);
      assert.equal((await request('/api/admin/users',{method:'POST',token:admin,body})).status,409);
      assert.equal((await request('/api/admin/users',{method:'POST',token:admin,body:{...body,email:'new@example.com',password:'curta'}})).status,400);
      editor=(await request('/api/auth/login',{method:'POST',body:{email:body.email,password:body.password}})).data.token;
      assert.equal((await request('/api/admin/users',{token:editor})).status,403);
      assert.equal((await request('/api/admin/users',{method:'POST',token:editor,body:{...body,email:'other@example.com'}})).status,403);
    });
    await t.test('catálogo público oculta rascunhos e registra a data real de novos animes',async()=>{
      const animes=[{id:1,title:'Publicado',slug:'publicado',visibility:'published',episodes:[]},{id:2,title:'Rascunho',slug:'rascunho',visibility:'draft',episodes:[]}];
      assert.equal((await request('/api/animes')).status,200);
      const saved=await request('/api/animes',{method:'PUT',token:editor,body:{animes}});
      assert.equal(saved.status,200);assert.ok(saved.data.animes[0].createdAt);
      const firstDate=saved.data.animes[0].createdAt;
      const again=await request('/api/animes',{method:'PUT',token:editor,body:{animes}});
      assert.equal(again.data.animes[0].createdAt,firstDate);
      assert.equal((await request('/api/animes')).data.animes.length,1);
      assert.equal((await request('/api/animes',{token:admin})).data.animes.length,2);
      const dashboard=await request('/api/admin/dashboard',{token:admin});
      assert.equal(dashboard.status,200);assert.equal(dashboard.data.users,2);assert.equal(dashboard.data.drafts,1);assert.equal(dashboard.data.totalAnimes,2);
    });
    await t.test('gravações parciais preservam outros animes e episódios, recusam conflitos e excluem somente o alvo', async () => {
      const endpoint = '/api/animes/changes';
      const change = (before, after, token = editor) => request(endpoint, { method: 'POST', token, body: { changes: [{ before, after }] } });
      assert.equal((await change(null, { id: 3 })).status, 400);
      assert.equal((await change(null, { id: 3 }, null)).status, 401);
      const original = (await request('/api/animes', { token: editor })).data.animes;
      const untouched = original.find(a => a.id === 2);
      const episodes = Array.from({ length: 300 }, (_, i) => ({ id: i + 1, titleSlug: 'ep-' + (i + 1), titleEpisodio: 'Ep ' + (i + 1), videoUrl: [] }));
      const created = await change(null, { id: 3, slug: 'terceiro', title: 'Terceiro', visibility: 'published', episodes });
      assert.equal(created.status, 200);
      let before = created.data.animes.find(a => a.id === 3);
      const date = before.createdAt;
      const rowIds = (await pool.query('SELECT id, data FROM episodes WHERE anime_id = 3 ORDER BY id')).rows;
      const edited = await change(before, { ...before, title: 'Editado', episodes: before.episodes.map(e => e.id === 2 ? { ...e, duration: '24 min' } : e) });
      assert.equal(edited.status, 200);
      assert.deepEqual(edited.data.animes.find(a => a.id === 2), untouched);
      assert.equal(edited.data.animes.find(a => a.id === 3).createdAt, date);
      const updatedRows = (await pool.query('SELECT id, data FROM episodes WHERE anime_id = 3 ORDER BY id')).rows;
      assert.deepEqual(updatedRows.map(r => r.id), rowIds.map(r => r.id));
      assert.equal(updatedRows.find(r => r.data.id === 2).data.duration, '24 min');
      assert.equal((await change(before, { ...before, title: 'Obsoleto' })).status, 409);
      before = edited.data.animes.find(a => a.id === 3);
      const deleted = await change(before, { ...before, episodes: before.episodes.filter(e => e.id !== 2) });
      assert.equal(deleted.status, 200);
      before = deleted.data.animes.find(a => a.id === 3);
      assert.equal(before.episodes.length, 299);
      assert.equal(before.episodes.some(e => e.id === 2), false);
      const invalid = await change(before, { ...before, title: 'Não pode persistir', episodes: [...before.episodes, { id: 301, titleSlug: 'ep-301', number: 'invalid' }] });
      assert.equal(invalid.status, 500);
      assert.deepEqual((await request('/api/animes', { token: editor })).data.animes.find(a => a.id === 3), before);
      const removed = await change(before, null);
      assert.equal(removed.status, 200);
      assert.equal(removed.data.animes.some(a => a.id === 3), false);
      assert.deepEqual(removed.data.animes.find(a => a.id === 2), untouched);
      assert.equal((await pool.query('SELECT count(*)::int AS total FROM episodes WHERE anime_id = 3')).rows[0].total, 0);
    });
    await t.test('administrador não remove seu próprio acesso',async()=>{
      const me=(await request('/api/auth/me',{token:admin})).data.user;
      assert.equal((await request('/api/admin/users/'+me.id,{method:'PATCH',token:admin,body:{role:'editor',active:true}})).status,400);
    });
    await t.test('desativação revoga sessões e impede novo login',async()=>{
      assert.equal((await request('/api/admin/users/'+editorId,{method:'PATCH',token:admin,body:{role:'editor',active:false}})).status,200);
      assert.equal((await request('/api/auth/me',{token:editor})).status,401);
      assert.equal((await request('/api/auth/login',{method:'POST',body:{email:'editor@example.com',password:'editor-password-123'}})).status,401);
    });
    await t.test('nova senha reativa o acesso e a sessao expirada e recusada',async()=>{
      assert.equal((await request('/api/admin/users/'+editorId,{method:'PATCH',token:admin,body:{role:'editor',active:true,password:'nova-senha-editor-123'}})).status,200);
      assert.equal((await request('/api/auth/login',{method:'POST',body:{email:'editor@example.com',password:'editor-password-123'}})).status,401);
      const login=await request('/api/auth/login',{method:'POST',body:{email:'editor@example.com',password:'nova-senha-editor-123'}});
      assert.equal(login.status,200);
      await pool.query("UPDATE admin_sessions SET expires_at = NOW() - INTERVAL '1 second' WHERE token_hash = $1",[crypto.createHash('sha256').update(login.data.token).digest('hex')]);
      assert.equal((await request('/api/auth/me',{token:login.data.token})).status,401);
    });
    await t.test('logout revoga a sessão no banco',async()=>{
      assert.equal((await request('/api/auth/logout',{method:'POST',token:admin})).status,204);
      assert.equal((await request('/api/auth/me',{token:admin})).status,401);
    });
    await t.test('tentativas excessivas são bloqueadas',async()=>{
      for(let i=0;i<10;i++)assert.equal((await request('/api/auth/login',{method:'POST',body:{email:'missing@example.com',password:'wrong-password-123'}})).status,401);
      assert.equal((await request('/api/auth/login',{method:'POST',body:{email:'missing@example.com',password:'wrong-password-123'}})).status,429);
    });
  } finally {
    if(server) await new Promise(resolve => server.close(resolve));
    if(pool) await pool.end();
    // The random, owned test schema is the only target of cleanup.
    if(!/^gontv_test_[a-f0-9]{16}$/.test(schema)) throw new Error('Invalid test schema');
    await control.query(`DROP SCHEMA ${schema} CASCADE`);
    await control.end();
  }
});
