"use strict";
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
		}
	}
	Guilds.init({
		id: {
			allowNull: false,
			autoIncrement: false,
			primaryKey: true,
			type: DataTypes.STRING,
		},
		setup_status: {
			allowNull: false,
			type: DataTypes.BOOLEAN,
		},
		admin_role: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		notificationChannel: {
			allowNull: false,
			type: DataTypes.STRING,
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