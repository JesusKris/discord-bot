exports.getWarningEmbed = async (title = null, description = null, fields = [], footer = {}, thumbnail = null, image = {}) => {
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

	if (thumbnail != null) {
		warningEmbed.thumbnail = thumbnail
	}

	if (image.length != 0) {
		warningEmbed.image = image
	}

	if (footer.length != 0) {
		warningEmbed.footer = footer;
	}

	return warningEmbed;
};