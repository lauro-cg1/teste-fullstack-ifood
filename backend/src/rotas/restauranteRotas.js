const { Router } = require('express');
const RestauranteControlador = require('../controladores/RestauranteControlador');
const { autenticacao } = require('../middlewares/autenticacao');
const { validarRestaurante, validarIdParam } = require('../middlewares/validacao');

const roteador = Router();

/**
 * @swagger
 * /restaurantes:
 *   get:
 *     tags: [Restaurantes]
 *     summary: Listar todos os restaurantes
 *     parameters:
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *       - in: query
 *         name: categoria_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: busca
 *         schema:
 *           type: string
 *       - in: query
 *         name: ordenar
 *         schema:
 *           type: string
 *           enum: [entrega, tempo, avaliacao]
 *     responses:
 *       200:
 *         description: Lista de restaurantes
 */
roteador.get('/', RestauranteControlador.listarTodos);

/**
 * @swagger
 * /restaurantes/{id}:
 *   get:
 *     tags: [Restaurantes]
 *     summary: Obter restaurante por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do restaurante
 *       404:
 *         description: Restaurante não encontrado
 */
roteador.get('/:id', validarIdParam, RestauranteControlador.obterPorId);

/**
 * @swagger
 * /restaurantes:
 *   post:
 *     tags: [Restaurantes]
 *     summary: Criar restaurante
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurante'
 *     responses:
 *       201:
 *         description: Restaurante criado
 */
roteador.post('/', autenticacao, validarRestaurante, RestauranteControlador.criar);

/**
 * @swagger
 * /restaurantes/{id}:
 *   put:
 *     tags: [Restaurantes]
 *     summary: Atualizar restaurante
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restaurante atualizado
 */
roteador.put('/:id', autenticacao, validarIdParam, RestauranteControlador.atualizar);

/**
 * @swagger
 * /restaurantes/{id}:
 *   delete:
 *     tags: [Restaurantes]
 *     summary: Remover restaurante
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restaurante removido
 */
roteador.delete('/:id', autenticacao, validarIdParam, RestauranteControlador.remover);

module.exports = roteador;
