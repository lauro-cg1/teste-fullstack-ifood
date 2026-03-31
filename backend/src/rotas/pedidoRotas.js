const { Router } = require('express');
const PedidoControlador = require('../controladores/PedidoControlador');
const { autenticacao, apenasAdmin } = require('../middlewares/autenticacao');
const { validarPedido, validarIdParam } = require('../middlewares/validacao');

const roteador = Router();

/**
 * @swagger
 * /pedidos:
 *   post:
 *     tags: [Pedidos]
 *     summary: Criar novo pedido
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurante_id
 *               - endereco_entrega
 *               - forma_pagamento
 *               - itens
 *             properties:
 *               restaurante_id:
 *                 type: integer
 *               endereco_entrega:
 *                 type: string
 *               forma_pagamento:
 *                 type: string
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produto_id:
 *                       type: integer
 *                     quantidade:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Pedido criado
 */
roteador.post('/', autenticacao, validarPedido, PedidoControlador.criar);

/**
 * @swagger
 * /pedidos/meus:
 *   get:
 *     tags: [Pedidos]
 *     summary: Listar pedidos do usuário logado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
roteador.get('/', autenticacao, apenasAdmin, PedidoControlador.listarTodos);

roteador.get('/meus', autenticacao, PedidoControlador.listarMeus);

/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     tags: [Pedidos]
 *     summary: Obter pedido por ID
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
 *         description: Dados do pedido
 */
roteador.get('/:id', autenticacao, validarIdParam, PedidoControlador.obterPorId);

/**
 * @swagger
 * /pedidos/{id}/status:
 *   patch:
 *     tags: [Pedidos]
 *     summary: Atualizar status do pedido
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
 *         description: Status atualizado
 */
roteador.patch('/:id/status', autenticacao, validarIdParam, PedidoControlador.atualizarStatus);

/**
 * @swagger
 * /pedidos/{id}/cancelar:
 *   patch:
 *     tags: [Pedidos]
 *     summary: Cancelar pedido
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
 *         description: Pedido cancelado
 */
roteador.patch('/:id/cancelar', autenticacao, validarIdParam, PedidoControlador.cancelar);

module.exports = roteador;
