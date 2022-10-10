"use strict";
/** @type {import('sequelize-cli').Migration} */
const {
	Model, // eslint-disable-line
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Guilds extends Model {
		/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
		static associate(models) {
			// define association here

			Guilds.hasMany(models.R_Role_Messages, {
				foreignKey: "guild_id"
			})
			Guilds.hasMany(models.R_Role_Reactions, {
				foreignKey: "guild_id"
			})
		}
	}
	Guilds.init({
		id: {
			primaryKey: true,
			allowNull: false,
			type: DataTypes.STRING,
		},
		is_main_server: {
			allowNull: false,
			type: DataTypes.BOOLEAN,
		},
		notification_channel: {
			allowNull: true,
			type: DataTypes.STRING,
		},
		greetings_channel: {
			allowNull: true,
			type: DataTypes.STRING,
		},
		admin_role: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		guest_role: {
			allowNull: true,
			type: DataTypes.STRING,
		},
		student_role: {
			allowNull: true,
			type: DataTypes.STRING,
		},
		batch_role: {
			allowNull: true,
			type: DataTypes.STRING,
		},
		master_password: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		student_password: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		guest_password: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	}, {
		timestamps: true,
		createdAt: true,
		updatedAt: true,
		sequelize,
		modelName: "Guilds",
	});
	return Guilds;
};