const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const db = req.db; // Obtenha a variável 'db' do objeto 'req'
  const { isAdmin } = req.user;

  const sql = 'SELECT COUNT(*) as count FROM usuarios WHERE nivel_id = 1';
  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Erro no servidor' });
    }

    const count = results[0].count;

    res.json({ isAdmin: isAdmin && count > 0 });
  });
});

module.exports = router;
