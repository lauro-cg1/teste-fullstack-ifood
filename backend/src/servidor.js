require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./modelos/indice');

const PORTA = process.env.PORT || process.env.PORTA || 3001;

const iniciar = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    await sequelize.sync({ alter: false });
    console.log('Modelos sincronizados com o banco de dados.');

    app.listen(PORTA, () => {
      console.log(`Servidor rodando na porta ${PORTA}`);
      console.log(`Documentação: http://localhost:${PORTA}/api/documentacao`);
      console.log(`Saúde: http://localhost:${PORTA}/api/saude`);
    });
  } catch (erro) {
    console.error('Erro ao iniciar o servidor:', erro);
    process.exit(1);
  }
};

iniciar();
