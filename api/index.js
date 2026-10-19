// One Vercel Function shares the existing Express routes; no listening socket.
module.exports = require('../server/index').app;
