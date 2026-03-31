const { Sequelize } = require('sequelize');
const configuracaoBD = require('../config/bancoDeDados');

const sequelize = new Sequelize(configuracaoBD);

const Usuario = require('./Usuario')(sequelize);
const Categoria = require('./Categoria')(sequelize);
const Restaurante = require('./Restaurante')(sequelize);
const Produto = require('./Produto')(sequelize);
const Pedido = require('./Pedido')(sequelize);
const ItemPedido = require('./ItemPedido')(sequelize);

Categoria.hasMany(Restaurante, { foreignKey: 'categoria_id', as: 'restaurantes' });
Restaurante.belongsTo(Categoria, { foreignKey: 'categoria_id', as: 'categoria' });

Restaurante.hasMany(Produto, { foreignKey: 'restaurante_id', as: 'produtos' });
Produto.belongsTo(Restaurante, { foreignKey: 'restaurante_id', as: 'restaurante' });

Usuario.hasMany(Pedido, { foreignKey: 'usuario_id', as: 'pedidos' });
Pedido.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

Restaurante.hasMany(Pedido, { foreignKey: 'restaurante_id', as: 'pedidos' });
Pedido.belongsTo(Restaurante, { foreignKey: 'restaurante_id', as: 'restaurante' });

Pedido.hasMany(ItemPedido, { foreignKey: 'pedido_id', as: 'itens' });
ItemPedido.belongsTo(Pedido, { foreignKey: 'pedido_id', as: 'pedido' });

Produto.hasMany(ItemPedido, { foreignKey: 'produto_id', as: 'itensPedido' });
ItemPedido.belongsTo(Produto, { foreignKey: 'produto_id', as: 'produto' });

module.exports = {
  sequelize,
  Usuario,
  Categoria,
  Restaurante,
  Produto,
  Pedido,
  ItemPedido
};
