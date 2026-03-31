const { Pedido, ItemPedido, Produto, Restaurante, sequelize } = require('../modelos/indice');

class PedidoServico {
  static async criar(usuarioId, dados) {
    const transacao = await sequelize.transaction();

    try {
      const restaurante = await Restaurante.findByPk(dados.restaurante_id);
      if (!restaurante || !restaurante.ativo) {
        const erro = new Error('Restaurante não encontrado ou inativo');
        erro.statusCode = 404;
        throw erro;
      }

      let subtotal = 0;
      const itensProcessados = [];

      for (const item of dados.itens) {
        const produto = await Produto.findByPk(item.produto_id);

        if (!produto || !produto.disponivel || produto.restaurante_id !== dados.restaurante_id) {
          const erro = new Error(`Produto ${item.produto_id} não disponível neste restaurante`);
          erro.statusCode = 400;
          throw erro;
        }

        const precoUnitario = produto.preco_promocional || produto.preco;
        const subtotalItem = parseFloat(precoUnitario) * item.quantidade;
        subtotal += subtotalItem;

        itensProcessados.push({
          produto_id: item.produto_id,
          quantidade: item.quantidade,
          preco_unitario: precoUnitario,
          subtotal: subtotalItem,
          observacoes: item.observacoes || null
        });
      }

      const taxaEntrega = parseFloat(restaurante.taxa_entrega) || 0;
      const total = subtotal + taxaEntrega;

      if (restaurante.pedido_minimo && subtotal < parseFloat(restaurante.pedido_minimo)) {
        const erro = new Error(`Pedido mínimo é R$ ${restaurante.pedido_minimo}`);
        erro.statusCode = 400;
        throw erro;
      }

      const pedido = await Pedido.create({
        usuario_id: usuarioId,
        restaurante_id: dados.restaurante_id,
        subtotal,
        taxa_entrega: taxaEntrega,
        total,
        endereco_entrega: dados.endereco_entrega,
        forma_pagamento: dados.forma_pagamento,
        observacoes: dados.observacoes || null
      }, { transaction: transacao });

      const itensComPedidoId = itensProcessados.map(item => ({
        ...item,
        pedido_id: pedido.id
      }));

      await ItemPedido.bulkCreate(itensComPedidoId, { transaction: transacao });

      await transacao.commit();

      return PedidoServico.obterPorId(pedido.id);
    } catch (erro) {
      await transacao.rollback();
      throw erro;
    }
  }

  static async listarPorUsuario(usuarioId, filtros = {}) {
    const { pagina = 1, limite = 10, status } = filtros;
    const offset = (pagina - 1) * limite;

    const condicoes = { usuario_id: usuarioId };
    if (status) condicoes.status = status;

    const { rows: pedidos, count: total } = await Pedido.findAndCountAll({
      where: condicoes,
      include: [
        {
          model: Restaurante,
          as: 'restaurante',
          attributes: ['id', 'nome', 'imagem']
        },
        {
          model: ItemPedido,
          as: 'itens',
          include: [{ model: Produto, as: 'produto', attributes: ['id', 'nome', 'imagem'] }]
        }
      ],
      order: [['criado_em', 'DESC']],
      limit: parseInt(limite),
      offset: parseInt(offset)
    });

    return {
      pedidos,
      paginacao: {
        total,
        pagina: parseInt(pagina),
        limite: parseInt(limite),
        totalPaginas: Math.ceil(total / limite)
      }
    };
  }

  static async obterPorId(pedidoId) {
    const pedido = await Pedido.findByPk(pedidoId, {
      include: [
        {
          model: Restaurante,
          as: 'restaurante',
          attributes: ['id', 'nome', 'imagem', 'telefone']
        },
        {
          model: ItemPedido,
          as: 'itens',
          include: [{ model: Produto, as: 'produto', attributes: ['id', 'nome', 'imagem', 'preco'] }]
        }
      ]
    });

    if (!pedido) {
      const erro = new Error('Pedido não encontrado');
      erro.statusCode = 404;
      throw erro;
    }

    return pedido;
  }

  static async atualizarStatus(pedidoId, status) {
    const pedido = await Pedido.findByPk(pedidoId);

    if (!pedido) {
      const erro = new Error('Pedido não encontrado');
      erro.statusCode = 404;
      throw erro;
    }

    await pedido.update({ status });
    return PedidoServico.obterPorId(pedidoId);
  }

  static async listarTodos(filtros = {}) {
    const { pagina = 1, limite = 20, status } = filtros;
    const offset = (pagina - 1) * limite;

    const condicoes = {};
    if (status) condicoes.status = status;

    const { rows: pedidos, count: total } = await Pedido.findAndCountAll({
      where: condicoes,
      include: [
        { model: Restaurante, as: 'restaurante', attributes: ['id', 'nome', 'imagem'] },
        {
          model: ItemPedido,
          as: 'itens',
          include: [{ model: Produto, as: 'produto', attributes: ['id', 'nome'] }]
        }
      ],
      order: [['criado_em', 'DESC']],
      limit: parseInt(limite),
      offset: parseInt(offset)
    });

    return {
      pedidos,
      paginacao: {
        total,
        pagina: parseInt(pagina),
        limite: parseInt(limite),
        totalPaginas: Math.ceil(total / limite)
      }
    };
  }

  static async cancelar(pedidoId, usuarioId) {
    const pedido = await Pedido.findByPk(pedidoId);

    if (!pedido) {
      const erro = new Error('Pedido não encontrado');
      erro.statusCode = 404;
      throw erro;
    }

    if (pedido.usuario_id !== usuarioId) {
      const erro = new Error('Sem permissão para cancelar este pedido');
      erro.statusCode = 403;
      throw erro;
    }

    if (!['pendente', 'confirmado'].includes(pedido.status)) {
      const erro = new Error('Pedido não pode mais ser cancelado');
      erro.statusCode = 400;
      throw erro;
    }

    await pedido.update({ status: 'cancelado' });
    return PedidoServico.obterPorId(pedidoId);
  }
}

module.exports = PedidoServico;
