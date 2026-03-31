const swaggerJsdoc = require('swagger-jsdoc');

const opcoes = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'iFood Clone API',
      version: '1.0.0',
      description: 'API RESTful do clone do iFood',
      contact: {
        name: 'Desenvolvedor',
        email: 'dev@ifoodclone.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nome: { type: 'string' },
            email: { type: 'string' },
            telefone: { type: 'string' },
            endereco: { type: 'string' }
          }
        },
        Restaurante: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nome: { type: 'string' },
            descricao: { type: 'string' },
            imagem: { type: 'string' },
            taxa_entrega: { type: 'number' },
            tempo_entrega_min: { type: 'integer' },
            tempo_entrega_max: { type: 'integer' },
            avaliacao: { type: 'number' },
            ativo: { type: 'boolean' }
          }
        },
        Categoria: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nome: { type: 'string' },
            imagem: { type: 'string' }
          }
        },
        Produto: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nome: { type: 'string' },
            descricao: { type: 'string' },
            preco: { type: 'number' },
            imagem: { type: 'string' },
            restaurante_id: { type: 'integer' }
          }
        },
        Pedido: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            usuario_id: { type: 'integer' },
            restaurante_id: { type: 'integer' },
            status: { type: 'string' },
            total: { type: 'number' },
            endereco_entrega: { type: 'string' }
          }
        },
        Erro: {
          type: 'object',
          properties: {
            sucesso: { type: 'boolean' },
            mensagem: { type: 'string' }
          }
        },
        LoginRequisicao: {
          type: 'object',
          required: ['email', 'senha'],
          properties: {
            email: { type: 'string' },
            senha: { type: 'string' }
          }
        },
        CadastroRequisicao: {
          type: 'object',
          required: ['nome', 'email', 'senha', 'telefone'],
          properties: {
            nome: { type: 'string' },
            email: { type: 'string' },
            senha: { type: 'string' },
            telefone: { type: 'string' },
            endereco: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./src/rotas/*.js']
};

const especificacaoSwagger = swaggerJsdoc(opcoes);

module.exports = especificacaoSwagger;
