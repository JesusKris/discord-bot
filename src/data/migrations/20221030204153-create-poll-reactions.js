"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Poll_Reactions", {
			guild_id: {
				type: Sequelize.STRING,
				onDelete: "CASCADE",
				references: {
					model: "Guilds",
					key: "id",
					as: "guild_id",
				},
			},
			message_id: {
				type: Sequelize.STRING,
				onDelete: "CASCADE",
				references: {
					model: "Poll_Messages",
					key: "id",
					as: "message_id",
				},
			},
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			option: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			emoji: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			count: {
				type: Sequelize.INTEGER,
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
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Poll_Reactions");
	},
};