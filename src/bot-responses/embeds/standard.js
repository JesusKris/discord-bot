exports.getStandardEmbed = async (title = null, description = null, fields = [], footer = {}) => {
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

	if (footer.length != 0) {
		standardEmbed.footer = footer;
	}

	return standardEmbed;
};