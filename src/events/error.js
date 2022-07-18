const { handleError } = require('../modules/errorHandling.js');

module.exports = async (client, error) => {

	handleError(null, JSON.stringify(error));

};
