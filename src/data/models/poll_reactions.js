'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Poll_Reactions extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here

			Poll_Reactions.belongsTo(models.Guilds, {
				foreignKey: "guild_id",
				onDelete: "CASCADE",
			});

			Poll_Reactions.belongsTo(models.Poll_Messages, {
				foreignKey: "message_id",
				onDelete: "CASCADE",
			});
		}
	}
	Poll_Reactions.init({
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER,
		},
		option: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		emoji: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		count: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		timestamps: true,
		createdAt: "created_at",
		updatedAt: false,
		sequelize,
		modelName: "Poll_Reactions",
	});
	return Poll_Reactions;
};