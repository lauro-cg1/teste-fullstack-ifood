const { Categoria } = require('../modelos/indice');

class CategoriaControlador {
  static async listarTodas(req, res, next) {
    try {
      const categorias = await Categoria.findAll({
        where: { ativo: true },
        order: [['nome', 'ASC']]
      });
      res.json({ sucesso: true, dados: categorias });
    } catch (erro) {
      next(erro);
    }
  }

  static async obterPorId(req, res, next) {
    try {
      const categoria = await Categoria.findByPk(req.params.id);
      if (!categoria) {
        return res.status(404).json({ sucesso: false, mensagem: 'Categoria não encontrada' });
      }
      res.json({ sucesso: true, dados: categoria });
    } catch (erro) {
      next(erro);
    }
  }

  static async criar(req, res, next) {
    try {
      const categoria = await Categoria.create(req.body);
      res.status(201).json({ sucesso: true, dados: categoria });
    } catch (erro) {
      next(erro);
    }
  }

  static async atualizar(req, res, next) {
    try {
      const categoria = await Categoria.findByPk(req.params.id);
      if (!categoria) {
        return res.status(404).json({ sucesso: false, mensagem: 'Categoria não encontrada' });
      }
      await categoria.update(req.body);
      res.json({ sucesso: true, dados: categoria });
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = CategoriaControlador;
