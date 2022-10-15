const { channelMention, roleMention, MessageMentions: { EveryonePattern } } = require("discord.js");
const config = require("../appconfig.js");
const { getStandardEmbed } = require("../bot-responses/embeds/standard.js");
const { getWarningEmbed } = require("../bot-responses/embeds/warning.js");
const db = require("../data/models/index.js");
const { handleError } = require("../modules/errorHandling.js");
const { getGuildSettings } = require("../modules/guildSettings.js");
const { verifyEmoji, verifyMessageLink, verifyChannel } = require("../modules/inputVerification");

exports.run = async (client, interaction, permissions) => { // eslint-disable-line

	await interaction.deferReply({ ephemeral: true, content: "Thinking..." });

	if (interaction.options.getSubcommand() == "create") {

		try {
			const title = interaction.options.getString("title");
			const description = interaction.options.getString("description");
			const channel = await interaction.options.getChannel("channel");


			if (!await verifyChannel(interaction, channel)) {
				return await interaction.editReply({ embeds: [await getWarningEmbed(null, "The selected channel is not valid.")], ephemeral: true });
			}

			const message_id = await sendReactMessageAndGetId(title, description, channel);

			await saveReactMessage(interaction, message_id, title, description, channel);

			await sendResponse(interaction, channel, "create");

			await filterDeletedMessagesFromDb(interaction)

		}
		catch (error) {
			handleError(error);
		}
	}


	if (interaction.options.getSubcommand() == "add") {
		try {
			const message_link = await interaction.options.getString("message-link");
			const input_emoji = await interaction.options.getString("emoji");
			const role = await interaction.options.getRole("role");


			// perform input verifications
			const { isVerifiedEmoji, emoji } = await verifyEmoji(interaction, input_emoji);
			if (!isVerifiedEmoji) {
				return await interaction.editReply({ embeds: [await getWarningEmbed(null, "The emoji you provided could not be validated or is not from this server. Please choose an emoji from this server or one default emoji.")], ephemeral: true });
			}

			const { isVerifiedMessage, message } = await verifyMessageLink(interaction, message_link);
			if (!isVerifiedMessage) {
				return await interaction.editReply({ embeds: [await getWarningEmbed(null, "The message link you provided could not be validated or is not from this server. Please ensure that you link a message from this server.")], ephemeral: true });
			}

			if (!await isReactRoleMessage(message)) {
				return await interaction.editReply({ embeds: [await getWarningEmbed(null, "The selected message is not a react-roles message. Look for embeds marked with 'react-role message'.")], ephemeral: true });
			}

			if (await checkForBotRole(role)) {
				return await interaction.editReply({ embeds: [await getWarningEmbed(null, "The selected role is a bot role which can't be used in a react-role message.")], ephemeral: true });
			}

			// exluding admin_role|batch_role|student_role|guest_role -> main|sprint
			const guildSettings = await getGuildSettings(interaction);
			if (!await checkForVerificationRole(role, guildSettings)) {
				if (guildSettings.is_main) {
					return await interaction.editReply({ embeds: [await getWarningEmbed(null, "You can't use admin|batch|student|guest role as a reaction role.")], ephemeral: true });
				}

				if (!guildSettings.is_main) {
					return await interaction.editReply({ embeds: [await getWarningEmbed(null, "You can't use admin role as a reaction role.")], ephemeral: true });
				}
			}


			// perform  availabity checks
			if (await isEveryoneRole(role)) {
				return await interaction.editReply({ embeds: [await getWarningEmbed(null, "Everyone role can't be used in a react-role message.")], ephemeral: true });

			}

			if (await isAvailableRole(role)) {
				return await interaction.editReply({ embeds: [await getWarningEmbed(null, "The selected role is already being used in a react-role message in this server.")], ephemeral: true });
			}

			if (await isAvailableEmoji(emoji, message)) {
				return await interaction.editReply({ embeds: [await getWarningEmbed(null, "The selected emoji is already being used in that message.")], ephemeral: true });
			}

			await saveReaction(message, emoji, role);

			await applyTextToReactMessage(message);

			await applyReactionsToMessage(message);

			return await sendResponse(interaction, null, "add");

		}
		catch (error) {
			handleError(error);
		}

	}


	if (interaction.options.getSubcommand() == "remove") {
		try {
			const message_link = await interaction.options.getString("message-link");
			const input_emoji = await interaction.options.getString("emoji");


			// perform input verifications
			const { isVerifiedEmoji, emoji } = await verifyEmoji(interaction, input_emoji);
			if (!isVerifiedEmoji) {
				return await interaction.editReply({ embeds: [await getWarningEmbed(null, "The emoji you provided could not be validated or is not from this server. Please choose an emoji from this server or one default emoji.")], ephemeral: true });
			}

			const { isVerifiedMessage, message } = await verifyMessageLink(interaction, message_link);
			if (!isVerifiedMessage) {
				return await interaction.editReply({ embeds: [await getWarningEmbed(null, "The message link you provided could not be validated or is not from this server. Please ensure that you link a message from this server.")], ephemeral: true });
			}

			if (!await isReactRoleMessage(message)) {
				return await interaction.editReply({ embeds: [await getWarningEmbed(null, "The selected message is not a react-roles message. Look for embeds marked with 'react-role message'.")], ephemeral: true });
			}


			// perform  availabity checks
			if (!await isAvailableEmoji(emoji, message)) {
				return await interaction.editReply({ embeds: [await getWarningEmbed(null, "The selected emoji is not being used in that message.")], ephemeral: true });
			}


			await deleteRoleFromMembers(interaction, message, emoji);

			await deleteReaction(message, emoji);

			await applyTextToReactMessage(message);

			await removeReactionsFromMessage(message, emoji);

			return await sendResponse(interaction, null, "remove");

		}
		catch (error) {
			handleError(error);
		}
	}
};

exports.config = {
	enabled: true,
	name: "react-roles",
	setupRequired: true,
	requiredPermission: config.client.commands.permissions.admin,
	guildOnly: true,
	description: "Create a react-roles message. Add a react-role to a message. Delete a react-role from a message",
	args: "<create> <add> <delete>",
	// Needed for legacy commands
	// maxArgs: 0,
};

async function sendReactMessageAndGetId(title, description, channel) {

	const message = await channel.send({ embeds: [await getStandardEmbed(title, description, null, null, null, { text: "react-role message" })] });

	return message.id;
}

async function saveReactMessage(interaction, message_id, title, description, channel) {
	try {
		await db.sequelize.models.R_Role_Messages.create({
			guild_id: interaction.guild.id,
			id: message_id,
			channel_id: channel.id,
			title: title,
			description: description,
			type: await interaction.options.getString("type"),
			created_at: new Date(),
			updated_at: new Date(),
		});
	}
	catch (error) {
		handleError(error);
	}
}

async function sendResponse(interaction, channel, type) {
	try {
		let message;
		switch (type) {
			case "create":
				message = `Successfully created the react-role message in ${channelMention(channel.id)}.`;
				break;
			case "add":
				message = "Successfully added a reaction role to a message.";
				break;
			case "remove":
				message = "Successfully removed a reaction role from a message.";
				break;
		}

		await interaction.editReply({ embeds: [await getStandardEmbed(null, message)], ephemeral: true });
	}
	catch (error) {
		handleError(error);
	}
}

async function isReactRoleMessage(message) {
	try {
		const result = await db.sequelize.models.R_Role_Messages.findByPk(message.id, {
			attributes: ["id"]
		});

		return result;

	}
	catch (error) {
		handleError(error);
	}
}

async function isAvailableRole(role) {
	try {
		const result = await db.sequelize.models.R_Role_Reactions.findOne({
			where: {
				role: role.id,
			},
			attributes: ["id"]
		});

		return result;
	}
	catch (error) {
		handleError(error);
	}
}

async function isAvailableEmoji(emoji, message) {
	try {
		const result = await db.sequelize.models.R_Role_Reactions.findOne({
			where: {
				message_id: message.id,
				emoji: emoji,
			},
			attributes: ["id"]
		});

		return result;
	}
	catch (error) {
		handleError(error);
	}
}


async function saveReaction(message, emoji, role) {
	try {
		await db.sequelize.models.R_Role_Reactions.create({
			guild_id: message.guildId,
			message_id: message.id,
			role: role.id,
			emoji: emoji,
			created_at: new Date(),
		});
	}
	catch (error) {
		handleError(error);
	}
}


async function applyTextToReactMessage(message) {
	try {

		const reactMessageData = await db.sequelize.models.R_Role_Messages.findByPk(message.id, {
			raw: true,
			attributes: ["title", "description"],
		});

		const reactionRoles = await getReactionRoles(message.id);

		let finalDescription = reactMessageData.description + "\n\n";

		for (const reaction of reactionRoles) {

			if (reaction.emoji.match(/[0-9]+/g)) {
				finalDescription += `<:_:${reaction.emoji}> - ${roleMention(reaction.role)}\n`;
				continue
			}

			finalDescription += `${reaction.emoji} - ${roleMention(reaction.role)}\n`;

		}

		await message.edit({ embeds: [await getStandardEmbed(reactMessageData.title, finalDescription, null, null, null, { text: "react-role message" })] });

	}
	catch (error) {
		handleError(error);
	}
}

async function applyReactionsToMessage(message) {
	try {
		const reactionRoles = await getReactionRoles(message.id);

		for (const reaction of reactionRoles) {
			message.react(reaction.emoji);
		}

	}
	catch (error) {
		handleError(error);
	}
}

async function getReactionRoles(messageId) {
	try {
		const reactionRoles = await db.sequelize.models.R_Role_Reactions.findAll({
			where: {
				message_id: messageId,
			},
			raw: true,
			order: [["created_at", "ASC"]],
			attributes: ["role", "emoji"],
		});

		return reactionRoles;
	}
	catch (error) {
		handleError(error);
	}
}


async function deleteRoleFromMembers(interaction, message, emoji) {
	try {

		const reactionRole = await db.sequelize.models.R_Role_Reactions.findOne({
			where: {
				message_id: message.id,
				emoji: emoji,
			},
			raw: true,
			attributes: ["role"],
		});


		// Deleting the role from members by first creating an exact copy
		// of the role and then deleting the original role from the server
		// this makes the whole process a lot less harmful towards the
		// discord API

		const role = await interaction.guild.roles.cache.get(reactionRole.role);

		//if role deleted
		if (!role) return;

		await interaction.guild.roles.create({
			name: role.name,
			color: role.color,
			hoist: role.hoist,
			position: role.position,
			permissions: role.permissions,
			mentionable: role.mentionable,

		});


		try {
			await role.delete();
		}
		catch { }


	}
	catch (error) {
		handleError(error);
	}
}


async function deleteReaction(message, emoji) {
	try {
		await db.sequelize.models.R_Role_Reactions.destroy({
			where: {
				message_id: message.id,
				emoji: emoji,
			},
		});
	}
	catch (error) {
		handleError(error);
	}
}

async function removeReactionsFromMessage(message, emoji) {
	try {
		await message.reactions.cache.get(emoji).remove();
	}
	catch (error) {
		handleError(error);
	}

}


async function checkForVerificationRole(role, settings) {
	try {
		if (settings.is_main) {
			if (settings.admin_role == role.id || settings.batch_role == role.id || settings.guest_role == role.id || settings.student_role == role.id) {
				return false;
			}
			return true;
		}

		if (!settings.is_main) {
			if (settings.admin_role == role.id) {
				return false;
			}
			return true;
		}

	}
	catch (error) {
		handleError(error);
	}
}

async function isEveryoneRole(role) {
	if (role.name.match(EveryonePattern)) {
		return true;
	}
	return false;
}



async function checkForBotRole(role) {
	try {
		if (role.managed) {
			return true
		}
		return false
	}
	catch (error) {
		handleError(error)
	}
}


async function filterDeletedMessagesFromDb(interaction) {
	try {
		const reactChannels = await db.sequelize.models.R_Role_Messages.findAll({
			attributes: ["channel_id"],
			where: {
				guild_id: interaction.guild.id
			},
			raw: true
		})

		for await (const channel of reactChannels) {

			let ch
			try {
				ch = await interaction.guild.channels.fetch(channel.channel_id)

			}
			catch { }

			if (!ch) {
				await db.sequelize.models.R_Role_Messages.destroy({
					where: {
						channel_id: channel.channel_id
					}
				})
			}
		}

	}
	catch (error) {
		handleError(error)
	}
}