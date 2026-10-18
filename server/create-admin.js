require('dotenv').config();
const { Pool } = require('pg');
const { createAuth, bootstrapAdmin } = require('./auth');
async function main() {
  if (!process.env.DATABASE_URL) throw new Error('Defina DATABASE_URL.');
  const pool = new Pool({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:true},connectionTimeoutMillis:15000});
  try {
    const created = await bootstrapAdmin(pool,createAuth(pool),{name:process.env.ADMIN_NAME,email:process.env.ADMIN_EMAIL,password:process.env.ADMIN_PASSWORD});
    console.log(created ? 'Administrador inicial criado.' : 'Já existe um administrador. Use a tela de Usuários para criar outros acessos.');
  } finally { await pool.end(); }
}
main().catch(error=>{console.error(error.message);process.exitCode=1});
