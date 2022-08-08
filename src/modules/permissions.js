const config = require('../appconfig.js');

exports.getUserPermissions = async (guildSettings, reference) => {
	const userLevels = [await this.defaultPermission()];
	try {
		if (guildSettings != null) {
			if (reference.member.roles.cache.has(guildSettings.admin_role)) {
				userLevels.push(config.client.commands.permissions.admin);
			}
			if (reference.member.roles.cache.has(guildSettings.dev_role)) {
				userLevels.push(config.client.commands.permissions.developer);
			}
		}
		return userLevels;
	}
	catch {
		handleError(null, error);
	}

};


exports.defaultPermission = async () => {
	return config.client.commands.permissions.user;
};