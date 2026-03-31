const PedidoServico = require('../servicos/PedidoServico');

class PedidoControlador {
  static async criar(req, res, next) {
    try {
      const pedido = await PedidoServico.criar(req.usuario.id, req.body);
      res.status(201).json({ sucesso: true, dados: pedido });
    } catch (erro) {
      next(erro);
    }
  }

  static async listarTodos(req, res, next) {
    try {
      const resultado = await PedidoServico.listarTodos(req.query);
      res.json({ sucesso: true, dados: resultado });
    } catch (erro) {
      next(erro);
    }
  }

  static async listarMeus(req, res, next) {
    try {
      const resultado = await PedidoServico.listarPorUsuario(req.usuario.id, req.query);
      res.json({ sucesso: true, dados: resultado });
    } catch (erro) {
      next(erro);
    }
  }

  static async obterPorId(req, res, next) {
    try {
      const pedido = await PedidoServico.obterPorId(req.params.id);

      if (!req.usuario.admin && pedido.usuario_id !== req.usuario.id) {
        return res.status(403).json({ sucesso: false, mensagem: 'Sem permissão' });
      }

      res.json({ sucesso: true, dados: pedido });
    } catch (erro) {
      next(erro);
    }
  }

  static async atualizarStatus(req, res, next) {
    try {
      const pedido = await PedidoServico.atualizarStatus(req.params.id, req.body.status);
      res.json({ sucesso: true, dados: pedido });
    } catch (erro) {
      next(erro);
    }
  }

  static async cancelar(req, res, next) {
    try {
      const pedido = await PedidoServico.cancelar(req.params.id, req.usuario.id);
      res.json({ sucesso: true, dados: pedido });
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = PedidoControlador;
