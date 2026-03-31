const jwt = require('jsonwebtoken');

const SEGREDO = process.env.JWT_SEGREDO || 'segredo_padrao_desenvolvimento';
const EXPIRACAO = process.env.JWT_EXPIRACAO || '7d';

const gerarToken = (dados) => {
  return jwt.sign(dados, SEGREDO, { expiresIn: EXPIRACAO });
};

const verificarToken = (token) => {
  return jwt.verify(token, SEGREDO);
};

module.exports = { gerarToken, verificarToken };
