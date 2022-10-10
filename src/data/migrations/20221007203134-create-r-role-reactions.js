'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('R_Role_Reactions', {
      guild_id: {
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        references: {
          model: "Guilds",
          key: "id",
          as: "guild_id"
        }
      },
      message_id: {
        type: Sequelize.STRING,
        onDelete: 'CASCADE',
        references: {
          model: "R_Role_Messages",
          key: "id",
          as: "message_id"
        }
      },
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      emoji: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('R_Role_Reactions');
  }
};