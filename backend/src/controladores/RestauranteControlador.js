const RestauranteServico = require('../servicos/RestauranteServico');

class RestauranteControlador {
  static async listarTodos(req, res, next) {
    try {
      const resultado = await RestauranteServico.listarTodos(req.query);
      res.json({ sucesso: true, dados: resultado });
    } catch (erro) {
      next(erro);
    }
  }

  static async obterPorId(req, res, next) {
    try {
      const restaurante = await RestauranteServico.obterPorId(req.params.id);
      res.json({ sucesso: true, dados: restaurante });
    } catch (erro) {
      next(erro);
    }
  }

  static async criar(req, res, next) {
    try {
      const restaurante = await RestauranteServico.criar(req.body);
      res.status(201).json({ sucesso: true, dados: restaurante });
    } catch (erro) {
      next(erro);
    }
  }

  static async atualizar(req, res, next) {
    try {
      const restaurante = await RestauranteServico.atualizar(req.params.id, req.body);
      res.json({ sucesso: true, dados: restaurante });
    } catch (erro) {
      next(erro);
    }
  }

  static async remover(req, res, next) {
    try {
      const resultado = await RestauranteServico.remover(req.params.id);
      res.json({ sucesso: true, dados: resultado });
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = RestauranteControlador;
