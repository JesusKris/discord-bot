"use strict";
const {
	Model,
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Errors extends Model {
		/**
	 * Helper method for defining associations.
	 * This method is not a part of Sequelize lifecycle.
	 * The `models/index` file will call this method automatically.
	 */
		static associate(models) {
			// define association here
		}
	}
	Errors.init({
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			autoIncrement: false,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		trace: {
			type: DataTypes.TEXT,
			allowNull: false,
		},

	}, {
		timestamps: true,
		createdAt: true,
		updatedAt: false,
		sequelize,
		modelName: "Errors",
	});
	return Errors;
};