'use strict';
const {
	Model, // eslint-disable-line
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
			type: DataTypes.STRING,
		},
		admin_role: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		dev_role: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		log_channel: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		join_channel: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		leave_channel: {
			allowNull: false,
			type: DataTypes.STRING,
		},
	}, {
		sequelize,
		modelName: 'Guilds',
	});
	return Guilds;
};