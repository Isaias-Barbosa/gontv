require('dotenv').config();

const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function createBin() {
  const masterKey = process.env.JSONBIN_MASTER_KEY;
  if (!masterKey) {
    throw new Error('Defina JSONBIN_MASTER_KEY no arquivo .env antes de criar o Bin.');
  }

  const catalogPath = path.resolve(__dirname, '..', 'data', 'catalog.json');
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const response = await axios.post('https://api.jsonbin.io/v3/b', catalog, {
    headers: {
      'X-Master-Key': masterKey,
      'X-Bin-Name': 'gontv-anime-catalog',
      'X-Bin-Private': 'true',
      'Content-Type': 'application/json',
    },
  });

  console.log(`Bin privado criado. Adicione JSONBIN_BIN_ID=${response.data.metadata.id} ao .env e reinicie a API.`);
}

createBin().catch((error) => {
  console.error('Falha ao criar Bin no Jsonbin:', error.response?.data || error.message);
  process.exitCode = 1;
});
