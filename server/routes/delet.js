const express = require('express');
const router = express.Router();

router.delete('/:id', (req, res) => {
  const userId = req.params.id;

  const db = req.db; // Obtenha a instância do banco de dados 'db' do objeto 'req'

  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Acesso não autorizado' });
  }

  // Exclua o usuário do banco de dados
  const sql = 'DELETE FROM usuarios WHERE id = ?';
  const values = [userId];
  
  db.query(sql, values, (error, result) => {
    if (error) {
      return res.status(500).json({ error: 'Erro no servidor' });
    }

    // Verifique se o usuário foi excluído com sucesso do banco de dados
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Envie uma resposta de sucesso
    res.status(200).json({ message: 'Usuário excluído com sucesso' });
  });
});

module.exports = router;
