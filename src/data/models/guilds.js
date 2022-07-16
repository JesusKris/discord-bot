'use strict';
const {
	Model,
} = require('sequelize');
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
			type: DataTypes.INTEGER,
		},
		setup_status: {
			type: DataTypes.BOOLEAN,

		},
	}, {
		sequelize,
		modelName: 'Guilds',
	});
	return Guilds;
};