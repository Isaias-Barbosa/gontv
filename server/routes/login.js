const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


router.post('/', (req, res) => {
  const { email, password } = req.body;
  const db = req.db; // Obtenha a variável 'db' do objeto 'req'

  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(sql, [email], async (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Erro no servidor' });
    } else {
      if (results.length > 0) {
        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.senha);

        if (passwordMatch) {
        const secretKey = process.env.JWT_SECRET;
        const token = jwt.sign(
            { id: user.id, email: user.email, isAdmin: user.nivel_id === 1},
            secretKey
          );
          res.json({ token, user });
        } else {
          return res.status(401).json({ error: 'Credenciais inválidas' });
        }
      } else {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
    }
  });
});

module.exports = router;



