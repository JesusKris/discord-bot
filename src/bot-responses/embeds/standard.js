exports.getStandardEmbed = async (title = null, description = null, fields = []) => {
	const standardEmbed = {
		color: 0xDCF900,
		timestamp: new Date(),
	};
	if (title != null) {
		standardEmbed.title = title;
	}

	if (description != null) {
		standardEmbed.description = description;
	}

	if (fields.length != 0) {
		standardEmbed.fields = fields;
	}
	return standardEmbed;
};