const { Produto, Restaurante } = require('../modelos/indice');
const { Op } = require('sequelize');

class ProdutoControlador {
  static async listarPorRestaurante(req, res, next) {
    try {
      const produtos = await Produto.findAll({
        where: {
          restaurante_id: req.params.restauranteId,
          disponivel: true
        },
        order: [['categoria_produto', 'ASC'], ['nome', 'ASC']]
      });
      res.json({ sucesso: true, dados: produtos });
    } catch (erro) {
      next(erro);
    }
  }

  static async buscar(req, res, next) {
    try {
      const { busca, pagina = 1, limite = 20 } = req.query;
      const offset = (pagina - 1) * limite;

      const condicoes = { disponivel: true };
      if (busca) {
        condicoes.nome = { [Op.like]: `%${busca}%` };
      }

      const { rows: produtos, count: total } = await Produto.findAndCountAll({
        where: condicoes,
        include: [{
          model: Restaurante,
          as: 'restaurante',
          attributes: ['id', 'nome', 'imagem', 'taxa_entrega', 'tempo_entrega_min']
        }],
        limit: parseInt(limite),
        offset: parseInt(offset)
      });

      res.json({
        sucesso: true,
        dados: {
          produtos,
          paginacao: {
            total,
            pagina: parseInt(pagina),
            limite: parseInt(limite),
            totalPaginas: Math.ceil(total / limite)
          }
        }
      });
    } catch (erro) {
      next(erro);
    }
  }

  static async obterPorId(req, res, next) {
    try {
      const produto = await Produto.findByPk(req.params.id, {
        include: [{
          model: Restaurante,
          as: 'restaurante',
          attributes: ['id', 'nome', 'imagem']
        }]
      });

      if (!produto) {
        return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado' });
      }

      res.json({ sucesso: true, dados: produto });
    } catch (erro) {
      next(erro);
    }
  }

  static async criar(req, res, next) {
    try {
      const produto = await Produto.create(req.body);
      res.status(201).json({ sucesso: true, dados: produto });
    } catch (erro) {
      next(erro);
    }
  }

  static async atualizar(req, res, next) {
    try {
      const produto = await Produto.findByPk(req.params.id);
      if (!produto) {
        return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado' });
      }
      await produto.update(req.body);
      res.json({ sucesso: true, dados: produto });
    } catch (erro) {
      next(erro);
    }
  }

  static async remover(req, res, next) {
    try {
      const produto = await Produto.findByPk(req.params.id);
      if (!produto) {
        return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado' });
      }
      await produto.update({ disponivel: false });
      res.json({ sucesso: true, mensagem: 'Produto removido com sucesso' });
    } catch (erro) {
      next(erro);
    }
  }
}

module.exports = ProdutoControlador;
