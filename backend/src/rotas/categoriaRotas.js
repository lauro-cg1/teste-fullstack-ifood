const { Router } = require('express');
const CategoriaControlador = require('../controladores/CategoriaControlador');
const { autenticacao } = require('../middlewares/autenticacao');
const { validarIdParam } = require('../middlewares/validacao');

const roteador = Router();

/**
 * @swagger
 * /categorias:
 *   get:
 *     tags: [Categorias]
 *     summary: Listar todas as categorias
 *     responses:
 *       200:
 *         description: Lista de categorias
 */
roteador.get('/', CategoriaControlador.listarTodas);

/**
 * @swagger
 * /categorias/{id}:
 *   get:
 *     tags: [Categorias]
 *     summary: Obter categoria por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados da categoria
 */
roteador.get('/:id', validarIdParam, CategoriaControlador.obterPorId);

/**
 * @swagger
 * /categorias:
 *   post:
 *     tags: [Categorias]
 *     summary: Criar categoria
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Categoria criada
 */
roteador.post('/', autenticacao, CategoriaControlador.criar);

/**
 * @swagger
 * /categorias/{id}:
 *   put:
 *     tags: [Categorias]
 *     summary: Atualizar categoria
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categoria atualizada
 */
roteador.put('/:id', autenticacao, validarIdParam, CategoriaControlador.atualizar);

module.exports = roteador;
