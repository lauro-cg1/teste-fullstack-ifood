const { Router } = require('express');
const AutenticacaoControlador = require('../controladores/AutenticacaoControlador');
const { autenticacao } = require('../middlewares/autenticacao');
const { validarCadastro, validarLogin } = require('../middlewares/validacao');

const roteador = Router();

/**
 * @swagger
 * /autenticacao/cadastrar:
 *   post:
 *     tags: [Autenticação]
 *     summary: Cadastrar novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CadastroRequisicao'
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *       409:
 *         description: Email já cadastrado
 */
roteador.post('/cadastrar', validarCadastro, AutenticacaoControlador.cadastrar);

/**
 * @swagger
 * /autenticacao/entrar:
 *   post:
 *     tags: [Autenticação]
 *     summary: Fazer login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequisicao'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
roteador.post('/entrar', validarLogin, AutenticacaoControlador.entrar);

/**
 * @swagger
 * /autenticacao/perfil:
 *   get:
 *     tags: [Autenticação]
 *     summary: Obter perfil do usuário logado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do perfil
 *       401:
 *         description: Não autenticado
 */
roteador.get('/perfil', autenticacao, AutenticacaoControlador.perfil);

/**
 * @swagger
 * /autenticacao/perfil:
 *   put:
 *     tags: [Autenticação]
 *     summary: Atualizar perfil do usuário
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil atualizado
 */
roteador.put('/perfil', autenticacao, AutenticacaoControlador.atualizarPerfil);

module.exports = roteador;
