process.env.AMBIENTE = 'teste';
process.env.JWT_SEGREDO = 'segredo_teste_123';
process.env.JWT_EXPIRACAO = '1h';

const request = require('supertest');
const app = require('../src/app');
const { sequelize, Categoria } = require('../src/modelos/indice');

let token;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  const res = await request(app)
    .post('/api/autenticacao/cadastrar')
    .send({
      nome: 'Admin Teste',
      email: 'admin@teste.com',
      senha: '123456',
      telefone: '11999999999'
    });
  token = res.body.dados.token;

  await Categoria.bulkCreate([
    { nome: 'Lanches', imagem: 'lanches.png' },
    { nome: 'Pizza', imagem: 'pizza.png' },
    { nome: 'Japonesa', imagem: 'japonesa.png' }
  ]);
});

afterAll(async () => {
  await sequelize.close();
});

describe('GET /api/restaurantes', () => {
  let restauranteId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/restaurantes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Restaurante Teste',
        descricao: 'Um restaurante de teste',
        categoria_id: 1,
        endereco: 'Rua Teste, 100',
        taxa_entrega: 5.99,
        tempo_entrega_min: 20,
        tempo_entrega_max: 40,
        avaliacao: 4.5
      });
    restauranteId = res.body.dados.id;

    await request(app)
      .post('/api/restaurantes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Pizzaria Teste',
        descricao: 'Pizza de teste',
        categoria_id: 2,
        endereco: 'Rua Pizza, 200',
        taxa_entrega: 0,
        tempo_entrega_min: 30,
        tempo_entrega_max: 50
      });
  });

  it('deve listar todos os restaurantes', async () => {
    const res = await request(app).get('/api/restaurantes');

    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados.restaurantes.length).toBeGreaterThanOrEqual(1);
    expect(res.body.dados.paginacao).toBeDefined();
  });

  it('deve filtrar por categoria', async () => {
    const res = await request(app).get('/api/restaurantes?categoria_id=1');

    expect(res.status).toBe(200);
    res.body.dados.restaurantes.forEach(r => {
      expect(r.categoria_id).toBe(1);
    });
  });

  it('deve buscar restaurantes por nome', async () => {
    const res = await request(app).get('/api/restaurantes?busca=Pizzaria');

    expect(res.status).toBe(200);
    expect(res.body.dados.restaurantes.length).toBeGreaterThanOrEqual(1);
  });

  it('deve paginar resultados', async () => {
    const res = await request(app).get('/api/restaurantes?pagina=1&limite=1');

    expect(res.status).toBe(200);
    expect(res.body.dados.restaurantes.length).toBeLessThanOrEqual(1);
    expect(res.body.dados.paginacao.limite).toBe(1);
  });

  it('deve obter restaurante por ID', async () => {
    const res = await request(app).get(`/api/restaurantes/${restauranteId}`);

    expect(res.status).toBe(200);
    expect(res.body.dados.id).toBe(restauranteId);
    expect(res.body.dados.nome).toBe('Restaurante Teste');
  });

  it('deve retornar 404 para restaurante inexistente', async () => {
    const res = await request(app).get('/api/restaurantes/99999');

    expect(res.status).toBe(404);
  });

  it('deve atualizar restaurante', async () => {
    const res = await request(app)
      .put(`/api/restaurantes/${restauranteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Restaurante Atualizado' });

    expect(res.status).toBe(200);
    expect(res.body.dados.nome).toBe('Restaurante Atualizado');
  });

  it('deve remover restaurante (soft delete)', async () => {
    const novoRes = await request(app)
      .post('/api/restaurantes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Para Remover',
        categoria_id: 1,
        endereco: 'Rua Delete, 999'
      });

    const res = await request(app)
      .delete(`/api/restaurantes/${novoRes.body.dados.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});

describe('GET /api/categorias', () => {
  it('deve listar todas as categorias', async () => {
    const res = await request(app).get('/api/categorias');

    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados.length).toBeGreaterThanOrEqual(1);
  });

  it('deve obter categoria por ID', async () => {
    const res = await request(app).get('/api/categorias/1');

    expect(res.status).toBe(200);
    expect(res.body.dados.nome).toBe('Lanches');
  });
});
