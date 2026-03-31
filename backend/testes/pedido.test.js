process.env.AMBIENTE = 'teste';
process.env.JWT_SEGREDO = 'segredo_teste_123';
process.env.JWT_EXPIRACAO = '1h';

const request = require('supertest');
const app = require('../src/app');
const { sequelize, Categoria } = require('../src/modelos/indice');

let token;
let restauranteId;
let produtoId;
let pedidoId;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const resUsuario = await request(app)
    .post('/api/autenticacao/cadastrar')
    .send({
      nome: 'Pedido Teste',
      email: 'pedido@teste.com',
      senha: '123456',
      telefone: '11999999999',
      endereco: 'Rua Entrega, 500'
    });
  token = resUsuario.body.dados.token;

  await Categoria.create({ nome: 'Lanches', imagem: 'lanches.png' });

  const resRestaurante = await request(app)
    .post('/api/restaurantes')
    .set('Authorization', `Bearer ${token}`)
    .send({
      nome: 'Restaurante Pedido',
      categoria_id: 1,
      endereco: 'Rua Pedido, 100',
      taxa_entrega: 5.99
    });
  restauranteId = resRestaurante.body.dados.id;

  const resProduto = await request(app)
    .post('/api/produtos')
    .set('Authorization', `Bearer ${token}`)
    .send({
      nome: 'Hambúrguer Teste',
      descricao: 'Delicioso hambúrguer',
      preco: 25.90,
      restaurante_id: restauranteId,
      categoria_produto: 'Sanduíches'
    });
  produtoId = resProduto.body.dados.id;
});

afterAll(async () => {
  await sequelize.close();
});

describe('POST /api/pedidos', () => {
  it('deve criar um novo pedido', async () => {
    const res = await request(app)
      .post('/api/pedidos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        restaurante_id: restauranteId,
        endereco_entrega: 'Rua Entrega, 500',
        forma_pagamento: 'pix',
        itens: [
          { produto_id: produtoId, quantidade: 2 }
        ]
      });

    expect(res.status).toBe(201);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados.status).toBe('pendente');
    expect(parseFloat(res.body.dados.subtotal)).toBe(51.80);
    pedidoId = res.body.dados.id;
  });

  it('deve rejeitar pedido sem autenticação', async () => {
    const res = await request(app)
      .post('/api/pedidos')
      .send({
        restaurante_id: restauranteId,
        endereco_entrega: 'Rua Teste',
        forma_pagamento: 'pix',
        itens: [{ produto_id: produtoId, quantidade: 1 }]
      });

    expect(res.status).toBe(401);
  });

  it('deve rejeitar pedido sem itens', async () => {
    const res = await request(app)
      .post('/api/pedidos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        restaurante_id: restauranteId,
        endereco_entrega: 'Rua Teste',
        forma_pagamento: 'pix',
        itens: []
      });

    expect(res.status).toBe(400);
  });

  it('deve rejeitar forma de pagamento inválida', async () => {
    const res = await request(app)
      .post('/api/pedidos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        restaurante_id: restauranteId,
        endereco_entrega: 'Rua Teste',
        forma_pagamento: 'bitcoin',
        itens: [{ produto_id: produtoId, quantidade: 1 }]
      });

    expect(res.status).toBe(400);
  });
});

describe('GET /api/pedidos/meus', () => {
  it('deve listar pedidos do usuário', async () => {
    const res = await request(app)
      .get('/api/pedidos/meus')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.dados.pedidos.length).toBeGreaterThanOrEqual(1);
  });
});

describe('GET /api/pedidos/:id', () => {
  it('deve obter pedido por ID', async () => {
    const res = await request(app)
      .get(`/api/pedidos/${pedidoId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.dados.id).toBe(pedidoId);
    expect(res.body.dados.itens).toBeDefined();
  });
});

describe('PATCH /api/pedidos/:id/cancelar', () => {
  it('deve cancelar o pedido', async () => {
    const res = await request(app)
      .patch(`/api/pedidos/${pedidoId}/cancelar`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.dados.status).toBe('cancelado');
  });

  it('não deve cancelar pedido já cancelado', async () => {
    const res = await request(app)
      .patch(`/api/pedidos/${pedidoId}/cancelar`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
  });
});

describe('GET /api/produtos', () => {
  it('deve listar produtos do restaurante', async () => {
    const res = await request(app)
      .get(`/api/produtos/restaurante/${restauranteId}`);

    expect(res.status).toBe(200);
    expect(res.body.dados.length).toBeGreaterThanOrEqual(1);
  });

  it('deve buscar produtos por nome', async () => {
    const res = await request(app)
      .get('/api/produtos/buscar?busca=Hamburguer');

    expect(res.status).toBe(200);
  });
});

describe('GET /api/saude', () => {
  it('deve retornar status da API', async () => {
    const res = await request(app).get('/api/saude');

    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.versao).toBe('1.0.0');
  });
});
