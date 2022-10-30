'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Poll_Messages extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here

			Poll_Messages.belongsTo(models.Guilds, {
				foreignKey: "guild_id",
				onDelete: "CASCADE",
			});

			Poll_Messages.hasMany(models.Poll_Reactions, {
				foreignKey: "message_id",
				onDelete: "CASCADE",
			});


		}
	}
	Poll_Messages.init({
		id: {
			primaryKey: true,
			type: DataTypes.STRING,
			allowNull: false,
		},
		channel_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		creator: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		votes_limit: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		sequelize,
		modelName: "Poll_Messages",
	});
	return Poll_Messages;
};