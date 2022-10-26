"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Guilds", {
			id: {
				primaryKey: true,
				allowNull: false,
				type: Sequelize.STRING,
			},
			is_main: {
				allowNull: false,
				type: Sequelize.BOOLEAN,
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
				allowNull: false,
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
			master_password: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			student_password: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			guest_password: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) { // eslint-disable-line
		await queryInterface.dropTable("Guilds");
	},
};