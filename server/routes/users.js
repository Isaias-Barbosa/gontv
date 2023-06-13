const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const db = req.db; // Obtenha a variável 'db' do objeto 'req'

  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Acesso não autorizado' });
  }

  const sql = 'SELECT id, nome, nome_perfil, email, sexo, nivel_id FROM usuarios';
  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Erro no servidor' });
    }

    const users = results.map((user) => {
      return {
        id: user.id,
        nome: user.nome,
        nome_perfil: user.nome_perfil,
        email: user.email,
        sexo: user.sexo,
        nivel_id: user.nivel_id,
      };
    });

    res.json(users);
  });
});

module.exports = router;
