process.env.AMBIENTE = 'teste';
process.env.JWT_SEGREDO = 'segredo_teste_123';
process.env.JWT_EXPIRACAO = '1h';

const request = require('supertest');
const app = require('../src/app');
const { sequelize, Usuario } = require('../src/modelos/indice');

let token;

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('POST /api/autenticacao/cadastrar', () => {
  it('deve cadastrar um novo usuário', async () => {
    const res = await request(app)
      .post('/api/autenticacao/cadastrar')
      .send({
        nome: 'Teste Usuario',
        email: 'teste@email.com',
        senha: '123456',
        telefone: '11999999999',
        endereco: 'Rua Teste, 123'
      });

    expect(res.status).toBe(201);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados.token).toBeDefined();
    expect(res.body.dados.usuario.nome).toBe('Teste Usuario');
    expect(res.body.dados.usuario.senha).toBeUndefined();
    token = res.body.dados.token;
  });

  it('deve rejeitar cadastro com email duplicado', async () => {
    const res = await request(app)
      .post('/api/autenticacao/cadastrar')
      .send({
        nome: 'Outro Usuario',
        email: 'teste@email.com',
        senha: '123456',
        telefone: '11988888888'
      });

    expect(res.status).toBe(409);
    expect(res.body.sucesso).toBe(false);
  });

  it('deve rejeitar cadastro sem dados obrigatórios', async () => {
    const res = await request(app)
      .post('/api/autenticacao/cadastrar')
      .send({ email: 'invalido' });

    expect(res.status).toBe(400);
    expect(res.body.sucesso).toBe(false);
  });

  it('deve rejeitar cadastro com email inválido', async () => {
    const res = await request(app)
      .post('/api/autenticacao/cadastrar')
      .send({
        nome: 'Teste',
        email: 'email_invalido',
        senha: '123456',
        telefone: '11999999999'
      });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/autenticacao/entrar', () => {
  it('deve fazer login com credenciais corretas', async () => {
    const res = await request(app)
      .post('/api/autenticacao/entrar')
      .send({
        email: 'teste@email.com',
        senha: '123456'
      });

    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados.token).toBeDefined();
    token = res.body.dados.token;
  });

  it('deve rejeitar login com senha incorreta', async () => {
    const res = await request(app)
      .post('/api/autenticacao/entrar')
      .send({
        email: 'teste@email.com',
        senha: 'senha_errada'
      });

    expect(res.status).toBe(401);
    expect(res.body.sucesso).toBe(false);
  });

  it('deve rejeitar login com email inexistente', async () => {
    const res = await request(app)
      .post('/api/autenticacao/entrar')
      .send({
        email: 'naoexiste@email.com',
        senha: '123456'
      });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/autenticacao/perfil', () => {
  it('deve retornar perfil do usuário autenticado', async () => {
    const res = await request(app)
      .get('/api/autenticacao/perfil')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados.email).toBe('teste@email.com');
  });

  it('deve rejeitar acesso sem token', async () => {
    const res = await request(app)
      .get('/api/autenticacao/perfil');

    expect(res.status).toBe(401);
  });

  it('deve rejeitar token inválido', async () => {
    const res = await request(app)
      .get('/api/autenticacao/perfil')
      .set('Authorization', 'Bearer token_invalido');

    expect(res.status).toBe(401);
  });
});

describe('PUT /api/autenticacao/perfil', () => {
  it('deve atualizar perfil do usuário', async () => {
    const res = await request(app)
      .put('/api/autenticacao/perfil')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Nome Atualizado' });

    expect(res.status).toBe(200);
    expect(res.body.dados.nome).toBe('Nome Atualizado');
  });
});
