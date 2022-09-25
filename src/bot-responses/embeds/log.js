exports.getLogEmbed = async (title = null, description = null, thumbnail = null, fields = null, image = null, footer = null) => {
	const logEmbed = {
		color: 0x45CFFF,
		timestamp: new Date(),
	};

	if (title != null) {
		logEmbed.title = title;
	}

	if (description != null) {
		logEmbed.description = description;
	}

	if (thumbnail != null) {
		logEmbed.thumbnail = thumbnail;
	}

	if (fields != null) {
		logEmbed.fields = fields;
	}

	if (image != null) {
		logEmbed.image = image;
	}

	if (footer != null) {
		logEmbed.footer = footer;
	}

	return logEmbed;
};