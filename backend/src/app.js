const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const especificacaoSwagger = require('./config/swagger');
const tratarErros = require('./middlewares/tratarErros');

const autenticacaoRotas = require('./rotas/autenticacaoRotas');
const restauranteRotas = require('./rotas/restauranteRotas');
const categoriaRotas = require('./rotas/categoriaRotas');
const produtoRotas = require('./rotas/produtoRotas');
const pedidoRotas = require('./rotas/pedidoRotas');

const app = express();

app.use(helmet());

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    process.env.CORS_ORIGEM
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const limitador = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    sucesso: false,
    mensagem: 'Muitas requisições, tente novamente em 15 minutos'
  }
});

app.use('/api/', limitador);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/documentacao', swaggerUi.serve, swaggerUi.setup(especificacaoSwagger, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'iFood Clone - API Docs'
}));

app.use('/api/autenticacao', autenticacaoRotas);
app.use('/api/restaurantes', restauranteRotas);
app.use('/api/categorias', categoriaRotas);
app.use('/api/produtos', produtoRotas);
app.use('/api/pedidos', pedidoRotas);

app.get('/api/saude', (req, res) => {
  res.json({
    sucesso: true,
    mensagem: 'API do iFood Clone funcionando!',
    versao: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    sucesso: false,
    mensagem: 'Rota não encontrada'
  });
});

app.use(tratarErros);

module.exports = app;
