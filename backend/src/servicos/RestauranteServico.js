const { Restaurante, Categoria, Produto } = require('../modelos/indice');
const { Op } = require('sequelize');

class RestauranteServico {
  static async listarTodos(filtros = {}) {
    const { pagina = 1, limite = 12, categoria_id, busca, ordenar } = filtros;
    const offset = (pagina - 1) * limite;

    const condicoes = { ativo: true };

    if (categoria_id) {
      condicoes.categoria_id = categoria_id;
    }

    if (busca) {
      condicoes.nome = { [Op.like]: `%${busca}%` };
    }

    let ordem = [['avaliacao', 'DESC']];
    if (ordenar === 'entrega') ordem = [['taxa_entrega', 'ASC']];
    if (ordenar === 'tempo') ordem = [['tempo_entrega_min', 'ASC']];
    if (ordenar === 'avaliacao') ordem = [['avaliacao', 'DESC']];

    const { rows: restaurantes, count: total } = await Restaurante.findAndCountAll({
      where: condicoes,
      include: [{ model: Categoria, as: 'categoria', attributes: ['id', 'nome', 'imagem'] }],
      order: ordem,
      limit: parseInt(limite),
      offset: parseInt(offset)
    });

    return {
      restaurantes,
      paginacao: {
        total,
        pagina: parseInt(pagina),
        limite: parseInt(limite),
        totalPaginas: Math.ceil(total / limite)
      }
    };
  }

  static async obterPorId(id) {
    const restaurante = await Restaurante.findByPk(id, {
      include: [
        { model: Categoria, as: 'categoria', attributes: ['id', 'nome'] },
        {
          model: Produto,
          as: 'produtos',
          where: { disponivel: true },
          required: false,
          order: [['categoria_produto', 'ASC'], ['nome', 'ASC']]
        }
      ]
    });

    if (!restaurante) {
      const erro = new Error('Restaurante não encontrado');
      erro.statusCode = 404;
      throw erro;
    }

    return restaurante;
  }

  static async criar(dados) {
    return Restaurante.create(dados);
  }

  static async atualizar(id, dados) {
    const restaurante = await Restaurante.findByPk(id);

    if (!restaurante) {
      const erro = new Error('Restaurante não encontrado');
      erro.statusCode = 404;
      throw erro;
    }

    await restaurante.update(dados);
    return restaurante;
  }

  static async remover(id) {
    const restaurante = await Restaurante.findByPk(id);

    if (!restaurante) {
      const erro = new Error('Restaurante não encontrado');
      erro.statusCode = 404;
      throw erro;
    }

    await restaurante.update({ ativo: false });
    return { mensagem: 'Restaurante removido com sucesso' };
  }
}

module.exports = RestauranteServico;
