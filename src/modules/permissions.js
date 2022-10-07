const config = require("../appconfig.js");

exports.getUserPermissions = async (guildSettings, reference) => {
	const userLevels = [await this.defaultPermission()];
	try {
		if (guildSettings != null) {
			if (reference.member.roles.cache.has(guildSettings.admin_role)) {
				userLevels.push(config.client.commands.permissions.admin);
			}
		}
		if (reference.user.id === reference.member.guild.ownerId) {
			userLevels.push(config.client.commands.permissions.guildOwner);
		}
		return userLevels;
	}
	catch {
		handleError(error);
	}

};


exports.defaultPermission = async () => {
	return config.client.commands.permissions.user;
};


exports.hasPermission = async (userPermissions, cmd) => {
	if (userPermissions.includes(cmd.config.requiredPermission)) {
		return true;
	}
	return false;
};