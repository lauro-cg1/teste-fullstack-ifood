const { body, param, query, validationResult } = require('express-validator');

const verificarValidacao = (req, res, next) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'Dados inválidos',
      erros: erros.array().map(e => ({ campo: e.path, mensagem: e.msg }))
    });
  }
  next();
};

const validarCadastro = [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório').isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('email').trim().isEmail().withMessage('Email inválido').normalizeEmail(),
  body('senha').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
  body('telefone').trim().notEmpty().withMessage('Telefone é obrigatório'),
  body('endereco').optional().trim(),
  verificarValidacao
];

const validarLogin = [
  body('email').trim().isEmail().withMessage('Email inválido').normalizeEmail(),
  body('senha').notEmpty().withMessage('Senha é obrigatória'),
  verificarValidacao
];

const validarRestaurante = [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('endereco').trim().notEmpty().withMessage('Endereço é obrigatório'),
  body('categoria_id').isInt({ min: 1 }).withMessage('Categoria inválida'),
  body('taxa_entrega').optional().isDecimal().withMessage('Taxa de entrega inválida'),
  body('tempo_entrega_min').optional().isInt({ min: 1 }).withMessage('Tempo mínimo inválido'),
  body('tempo_entrega_max').optional().isInt({ min: 1 }).withMessage('Tempo máximo inválido'),
  verificarValidacao
];

const validarProduto = [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('preco').isDecimal({ decimal_digits: '0,2' }).withMessage('Preço inválido'),
  body('restaurante_id').isInt({ min: 1 }).withMessage('Restaurante inválido'),
  body('categoria_produto').optional().trim(),
  verificarValidacao
];

const validarPedido = [
  body('restaurante_id').isInt({ min: 1 }).withMessage('Restaurante inválido'),
  body('endereco_entrega').trim().notEmpty().withMessage('Endereço de entrega é obrigatório'),
  body('forma_pagamento').isIn(['cartao_credito', 'cartao_debito', 'pix', 'dinheiro']).withMessage('Forma de pagamento inválida'),
  body('itens').isArray({ min: 1 }).withMessage('Pedido deve ter ao menos um item'),
  body('itens.*.produto_id').isInt({ min: 1 }).withMessage('Produto inválido'),
  body('itens.*.quantidade').isInt({ min: 1 }).withMessage('Quantidade inválida'),
  verificarValidacao
];

const validarIdParam = [
  param('id').isInt({ min: 1 }).withMessage('ID inválido'),
  verificarValidacao
];

module.exports = {
  verificarValidacao,
  validarCadastro,
  validarLogin,
  validarRestaurante,
  validarProduto,
  validarPedido,
  validarIdParam
};
