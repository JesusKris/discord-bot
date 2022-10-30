'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Poll_Messages', {
      guild_id: {
        type: Sequelize.STRING,
        onDelete: "CASCADE",
        references: {
          model: "Guilds",
          key: "id",
          as: "guild_id",
        },
      },
      id: {
        primaryKey: true,
        type: Sequelize.STRING,
        allowNull: false,
      },
      channel_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      creator: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      votes_limit: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Poll_Messages');
  }
};