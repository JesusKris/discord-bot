const { handleError } = require('../modules/error-handling.js');


module.exports = async (client, error) => {
	handleError(null, JSON.stringify(error));
};
