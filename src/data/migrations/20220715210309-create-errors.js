'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Errors', {
			id: {
				allowNull: false,
				autoIncrement: false,
				primaryKey: true,
				type: Sequelize.STRING,
			},
			name: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			trace: {
				allowNull: false,
				type: Sequelize.TEXT,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE(6),
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Errors');
	},
};