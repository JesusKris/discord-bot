const db = require("../data/models/index.js");
const { handleError } = require("../modules/errorHandling.js");
const logger = require("./logger.js");


exports.pingDB = async () => {
	logger.log("Pinging database for connection pool..");
	try {
		await db.sequelize.authenticate();
		logger.ready("Succesfully received back a connection pool..");
	}
	catch (error) {
		handleError(error);
	}
};