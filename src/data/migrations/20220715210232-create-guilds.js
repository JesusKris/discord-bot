'use strict';
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Guilds', {
			id: {
				allowNull: false,
				autoIncrement: false,
				primaryKey: true,
				type: Sequelize.STRING,
			},
			setup_status: {
				allowNull: false,
				type: Sequelize.BOOLEAN,
			},
			admin_role: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			dev_role: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			log_channel: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			join_channel: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			leave_channel: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) { // eslint-disable-line
		await queryInterface.dropTable('Guilds');
	},
};