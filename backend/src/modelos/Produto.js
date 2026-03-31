const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Produto = sequelize.define('Produto', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    preco_promocional: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    imagem: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    restaurante_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categoria_produto: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    disponivel: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    destaque: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'produtos',
    timestamps: true,
    underscored: true
  });

  return Produto;
};
