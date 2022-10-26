exports.getStandardEmbed = async (title = null, description = null, thumbnail = null, fields = null, image = null, footer = null) => {
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

	if (thumbnail != null) {
		standardEmbed.thumbnail = thumbnail;
	}

	if (fields != null) {
		standardEmbed.fields = fields;
	}

	if (image != null) {
		standardEmbed.image = image;
	}

	if (footer != null) {
		standardEmbed.footer = footer;
	}

	return standardEmbed;
};