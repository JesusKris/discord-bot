exports.getWarningEmbed = async (title = null, description = null, fields = []) => {
	const warningEmbed = {
		color: 0xFF9D5A,
		timestamp: new Date(),
	};
	if (title != null) {
		warningEmbed.title = title;
	}

	if (description != null) {
		warningEmbed.description = description;
	}

	if (fields.length != 0) {
		warningEmbed.fields = fields;
	}
	return warningEmbed;
};