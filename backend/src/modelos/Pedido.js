const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pedido = sequelize.define('Pedido', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    restaurante_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pendente', 'confirmado', 'preparando', 'saiu_entrega', 'entregue', 'cancelado'),
      defaultValue: 'pendente'
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    taxa_entrega: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    endereco_entrega: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    forma_pagamento: {
      type: DataTypes.ENUM('cartao_credito', 'cartao_debito', 'pix', 'dinheiro'),
      allowNull: false
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'pedidos',
    timestamps: true,
    underscored: true
  });

  return Pedido;
};
