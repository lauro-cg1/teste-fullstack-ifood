require('dotenv').config();

const obterVariavel = (nomePt, nomeEn) => process.env[nomePt] || process.env[nomeEn];

const obterBooleano = (valor, padrao = false) => {
  if (typeof valor !== 'string') {
    return padrao;
  }

  const normalizado = valor.trim().toLowerCase();

  if (['1', 'true', 'sim', 'yes', 'y', 'on'].includes(normalizado)) {
    return true;
  }

  if (['0', 'false', 'nao', 'não', 'no', 'n', 'off'].includes(normalizado)) {
    return false;
  }

  return padrao;
};

const obterUrlBanco = () => process.env.DATABASE_URL || process.env.JAWSDB_URL;

const obterCredenciaisPorUrl = (urlBanco) => {
  try {
    const url = new URL(urlBanco);

    return {
      host: url.hostname,
      port: parseInt(url.port, 10) || 3306,
      database: decodeURIComponent(url.pathname.replace(/^\//, '')),
      username: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password)
    };
  } catch (erro) {
    console.error('URL de banco inválida em DATABASE_URL/JAWSDB_URL.');
    process.exit(1);
  }
};

const criarDialectOptions = () => {
  const usarSsl = obterBooleano(obterVariavel('BD_SSL', 'DB_SSL'), true);

  if (!usarSsl) {
    return undefined;
  }

  return {
    ssl: {
      require: true,
      rejectUnauthorized: obterBooleano(obterVariavel('BD_SSL_VALIDAR_CERT', 'DB_SSL_VALIDATE_CERT'), false)
    }
  };
};

const obterAmbienteAtual = () => {
  const ambiente = (process.env.AMBIENTE || process.env.NODE_ENV || 'desenvolvimento').toLowerCase();

  if (ambiente === 'producao' || ambiente === 'production') {
    return 'producao';
  }

  if (ambiente === 'teste' || ambiente === 'test') {
    return 'teste';
  }

  return 'desenvolvimento';
};

const ambientes = {
  desenvolvimento: {
    dialect: 'mysql',
    host: obterVariavel('BD_HOST', 'DB_HOST') || 'localhost',
    port: parseInt(obterVariavel('BD_PORTA', 'DB_PORT'), 10) || 3306,
    database: obterVariavel('BD_NOME', 'DB_NAME') || 'ifood_clone',
    username: obterVariavel('BD_USUARIO', 'DB_USER') || 'root',
    password: obterVariavel('BD_SENHA', 'DB_PASSWORD') || '',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'criado_em',
      updatedAt: 'atualizado_em'
    }
  },
  teste: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'criado_em',
      updatedAt: 'atualizado_em'
    }
  },
  producao: {
    dialect: 'mysql',
    ...(obterUrlBanco()
      ? obterCredenciaisPorUrl(obterUrlBanco())
      : {
          host: obterVariavel('BD_HOST', 'DB_HOST'),
          port: parseInt(obterVariavel('BD_PORTA', 'DB_PORT'), 10) || 3306,
          database: obterVariavel('BD_NOME', 'DB_NAME'),
          username: obterVariavel('BD_USUARIO', 'DB_USER'),
          password: obterVariavel('BD_SENHA', 'DB_PASSWORD')
        }),
    logging: false,
    pool: {
      max: 20,
      min: 5,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'criado_em',
      updatedAt: 'atualizado_em'
    },
    dialectOptions: criarDialectOptions()
  }
};

const ambienteAtual = obterAmbienteAtual();

module.exports = ambientes[ambienteAtual];
