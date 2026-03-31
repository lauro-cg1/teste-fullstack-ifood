require('dotenv').config();
const { sequelize } = require('../modelos/indice');

const migrar = async () => {
  try {
    console.log('Iniciando migração...');
    await sequelize.sync({ alter: true });
    console.log('Migração concluída com sucesso!');
    process.exit(0);
  } catch (erro) {
    console.error('Erro na migração:', erro);
    process.exit(1);
  }
};

migrar();
