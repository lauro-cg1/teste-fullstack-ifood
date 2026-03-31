const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Restaurante = sequelize.define('Restaurante', {
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
    imagem: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    imagem_capa: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    endereco: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    telefone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    taxa_entrega: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    tempo_entrega_min: {
      type: DataTypes.INTEGER,
      defaultValue: 30
    },
    tempo_entrega_max: {
      type: DataTypes.INTEGER,
      defaultValue: 60
    },
    avaliacao: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0.0,
      validate: {
        min: 0,
        max: 5
      }
    },
    total_avaliacoes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    pedido_minimo: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
    },
    horario_abertura: {
      type: DataTypes.STRING(5),
      defaultValue: '08:00'
    },
    horario_fechamento: {
      type: DataTypes.STRING(5),
      defaultValue: '23:00'
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'restaurantes',
    timestamps: true,
    underscored: true
  });

  return Restaurante;
};
