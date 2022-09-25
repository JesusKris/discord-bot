exports.getWarningEmbed = async (title = null, description = null, thumbnail = null, fields = null, image = null, footer = null) => {
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

	if (thumbnail != null) {
		warningEmbed.thumbnail = thumbnail;
	}

	if (fields != null) {
		warningEmbed.fields = fields;
	}

	if (image != null) {
		warningEmbed.image = image;
	}

	if (footer != null) {
		warningEmbed.footer = footer;
	}

	return warningEmbed;
};