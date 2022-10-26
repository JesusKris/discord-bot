const { handleError } = require("../modules/errorHandling.js");

module.exports = async (client, warn) => {
	handleError(JSON.stringify(warn));
};
