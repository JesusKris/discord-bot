const { handleError } = require("../modules/errorHandling.js");

module.exports = async (client, error) => {

	handleError(client, JSON.stringify(error));

};
