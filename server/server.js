const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../config/.env' });

const port = process.env.PORT || 3006;
const host = process.env.HOST || 'localhost';

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: host,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const secretKey = process.env.JWT_SECRET;

// Middleware para verificar o token de autenticação
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    req.user = decoded;
    next();
  });
};

// Adicione a variável 'db' ao objeto 'req'
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Rotas para autenticação
const loginRoute = require('./routes/login');
app.use('/api/login', loginRoute);

// Rotas protegidas que requerem autenticação
const adminRoute = require('./routes/admin');
app.use('/api/admin', verifyToken, adminRoute);

// Rota para buscar os usuários do banco de dados
const usersRoute = require('./routes/users');
app.use('/api/users', verifyToken, usersRoute); 

// Rota para cadastrar novos usuarios.
const registerRoute = require('./routes/register');
app.use('/api/register', registerRoute);

const editRouter = require('./routes/edit'); // Importe o arquivo edit.js
app.use('/api/users', editRouter); // Use a rota '/api/users' para o roteador editRouter

const DeletRouter = require('./routes/delet'); // Importe o arquivo edit.js
app.use('/api/users', DeletRouter); // Use a rota '/api/users' para o roteador editRouter

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});