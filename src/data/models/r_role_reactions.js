'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class R_Role_Reactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      R_Role_Reactions.belongsTo(models.R_Role_Messages, {
        foreignKey: "message_id",
        onDelete: 'CASCADE'
      })
      R_Role_Reactions.belongsTo(models.Guilds, {
        foreignKey: "guild_id",
        onDelete: 'CASCADE'
      })
    }
  }
  R_Role_Reactions.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emoji: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: true,
    createdAt: true,
    updatedAt: false,
    sequelize,
    modelName: 'R_Role_Reactions',
  });
  return R_Role_Reactions;
};