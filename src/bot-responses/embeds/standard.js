exports.getStandardEmbed = async (title = null, description = null, fields = [], footer = {}, thumbnail = null, image = null) => {
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

	if (thumbnail != null) {
		standardEmbed.thumbnail = thumbnail
	}

	if (image != null) {
		standardEmbed.image = image
	}

	if (footer.length != 0) {
		standardEmbed.footer = footer;
	}

	return standardEmbed;
};