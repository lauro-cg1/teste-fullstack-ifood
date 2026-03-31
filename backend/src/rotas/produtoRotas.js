const { Router } = require('express');
const ProdutoControlador = require('../controladores/ProdutoControlador');
const { autenticacao } = require('../middlewares/autenticacao');
const { validarProduto, validarIdParam } = require('../middlewares/validacao');

const roteador = Router();

/**
 * @swagger
 * /produtos/buscar:
 *   get:
 *     tags: [Produtos]
 *     summary: Buscar produtos
 *     parameters:
 *       - in: query
 *         name: busca
 *         schema:
 *           type: string
 *       - in: query
 *         name: pagina
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limite
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produtos encontrados
 */
roteador.get('/buscar', ProdutoControlador.buscar);

/**
 * @swagger
 * /produtos/restaurante/{restauranteId}:
 *   get:
 *     tags: [Produtos]
 *     summary: Listar produtos de um restaurante
 *     parameters:
 *       - in: path
 *         name: restauranteId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de produtos do restaurante
 */
roteador.get('/restaurante/:restauranteId', ProdutoControlador.listarPorRestaurante);

/**
 * @swagger
 * /produtos/{id}:
 *   get:
 *     tags: [Produtos]
 *     summary: Obter produto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do produto
 */
roteador.get('/:id', validarIdParam, ProdutoControlador.obterPorId);

/**
 * @swagger
 * /produtos:
 *   post:
 *     tags: [Produtos]
 *     summary: Criar produto
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Produto criado
 */
roteador.post('/', autenticacao, validarProduto, ProdutoControlador.criar);

/**
 * @swagger
 * /produtos/{id}:
 *   put:
 *     tags: [Produtos]
 *     summary: Atualizar produto
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Produto atualizado
 */
roteador.put('/:id', autenticacao, validarIdParam, ProdutoControlador.atualizar);

/**
 * @swagger
 * /produtos/{id}:
 *   delete:
 *     tags: [Produtos]
 *     summary: Remover produto
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Produto removido
 */
roteador.delete('/:id', autenticacao, validarIdParam, ProdutoControlador.remover);

module.exports = roteador;
