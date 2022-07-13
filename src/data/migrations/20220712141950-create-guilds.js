'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Guilds', {
      id: {
        primaryKey: true,
        unique: true,
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      owner_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      prefix: {
        allowNull: false,
        type: Sequelize.STRING
      },
      setup_status: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Guilds');
  }
};