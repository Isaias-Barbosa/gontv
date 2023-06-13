const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');



router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body; // Dados atualizados do usuário

  const db = req.db; // Obtenha a instância do banco de dados 'db' do objeto 'req'

  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Acesso não autorizado' });
  }

  try {
    // Criptografe a nova senha, se for fornecida
    if (updatedUser.senha) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(updatedUser.senha, saltRounds);
      updatedUser.senha = hashedPassword;
    }

    // Atualize o usuário no banco de dados
    const sql =
      'UPDATE usuarios SET nome = ?, nome_perfil = ?, email = ?, senha = ?, nivel_id = ? WHERE id = ?';
    const values = [
      updatedUser.nome,
      updatedUser.nome_perfil,
      updatedUser.email,
      updatedUser.senha,
      updatedUser.nivel_id,
      userId,
    ];

    db.query(sql, values, (error, result) => {
      if (error) {
        return res.status(500).json({ error: 'Erro no servidor' });
      }

      // Verifique se o usuário foi atualizado com sucesso no banco de dados
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Envie uma resposta de sucesso
      res.status(200).json({ message: 'Usuário atualizado com sucesso' });
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

module.exports = router;