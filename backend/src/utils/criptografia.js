const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

const criptografar = async (texto) => {
  const sal = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(texto, sal);
};

const comparar = async (texto, hash) => {
  return bcrypt.compare(texto, hash);
};

module.exports = { criptografar, comparar };
