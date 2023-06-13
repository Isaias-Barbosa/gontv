const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Rota para o cadastro de usuários
router.post('/', async (req, res) => {
  try {
    const { nome, nome_perfil, email, password, sexo } = req.body;

    // Verifique se o email já está em uso no banco de dados
    const emailExists = await req.db.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (emailExists.length > 0) {
      return res.status(400).json({ error: 'Email já está em uso' });
    }

    // Hash a senha antes de salvar no banco de dados
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insira o novo usuário no banco de dados
    await req.db.query(
      'INSERT INTO usuarios (nome, nome_perfil, email, senha, sexo, nivel_id) VALUES (?, ?, ?, ?, ?, 2)',
      [nome, nome_perfil, email, hashedPassword, sexo]
    );

    // Gere um token de autenticação para o novo usuário
    const token = jwt.sign({ email }, process.env.JWT_SECRET);

    res.status(200).json({ token, message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao cadastrar usuário' });
  }
});

module.exports = router;
