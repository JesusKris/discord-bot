exports.getLogEmbed = async (title = null, description = null, fields = [], footer = {}) => {
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

	if (fields.length != 0) {
		logEmbed.fields = fields;
	}

	if (footer.length != 0) {
		logEmbed.footer = footer;
	}
	return logEmbed;
};