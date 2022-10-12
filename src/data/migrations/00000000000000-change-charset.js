"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) { // eslint-disable-line
		queryInterface.sequelize.query(
			`ALTER DATABASE ${queryInterface.sequelize.config.database}
      CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;`,
		);
	},

	async down(queryInterface, Sequelize) {// eslint-disable-line
		queryInterface.sequelize.query(
			`ALTER DATABASE ${queryInterface.sequelize.config.database}
      CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci;`,
		);
	},
};
