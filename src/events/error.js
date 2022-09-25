const { handleError } = require("../modules/errorHandling.js");

module.exports = async (client, error) => {

	handleError(JSON.stringify(error));

};
