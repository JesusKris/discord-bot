"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Guilds", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			guild_id: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			is_main_server: {
				allowNull: false,
				type: Sequelize.BOOLEAN
			},
			notification_channel: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			greetings_channel: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			admin_role: {
				allowNull:false,
				type: Sequelize.STRING,
			},
			guest_role: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			student_role: {
				allowNull: true,
				type: Sequelize.STRING,
			},
			batch_role: {
				allowNull: true,
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
		await queryInterface.dropTable("Guilds");
	},
};