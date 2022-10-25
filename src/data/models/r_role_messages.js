"use strict";
/** @type {import('sequelize-cli').Migration} */
const {
	Model,
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class R_Role_Messages extends Model {
		/**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
		static associate(models) {
			// define association here
			R_Role_Messages.belongsTo(models.Guilds, {
				foreignKey: "guild_id",
				onDelete: "CASCADE",
			});

			R_Role_Messages.hasMany(models.R_Role_Reactions, {
				foreignKey: "message_id",
				onDelete: "CASCADE",
			});
		}
	}
	R_Role_Messages.init({
		id: {
			primaryKey: true,
			type: DataTypes.STRING,
			allowNull: false,
		},
		channel_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	}, {
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		sequelize,
		modelName: "R_Role_Messages",
	});
	return R_Role_Messages;
};