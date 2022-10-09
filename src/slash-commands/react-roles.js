const { channelMention, roleMention, formatEmoji, parseEmoji } = require("discord.js");
const config = require("../appconfig.js");
const { getStandardEmbed } = require("../bot-responses/embeds/standard.js");
const { getWarningEmbed } = require("../bot-responses/embeds/warning.js");
const db = require("../data/models/index.js");
const { handleError } = require("../modules/errorHandling.js");

exports.run = async (client, interaction, permissions) => {

	if (interaction.options.getSubcommand() == "create") {

		try {
			const title = interaction.options.getString("title")
			const description = interaction.options.getString("description")
			const channel = await interaction.options.getChannel('channel')

			const message_id = await sendReactMessageAndGetId(interaction, title, description, channel)

			await saveReactMessage(interaction, message_id, title, description)

			await sendResponse(interaction, channel, "create")

		}
		catch (error) {
			handleError(error)
		}
	}

	if (interaction.options.getSubcommand() == "add") {
		try {
			const message_link = await interaction.options.getString("message-link");
			const input_emoji = await interaction.options.getString("emoji");
			const role = await interaction.options.getRole("role")


			//perform input verifications
			const { isVerifiedEmoji, emoji } = await verifyEmoji(interaction, input_emoji)
			if (!isVerifiedEmoji) {
				return await interaction.reply({ embeds: [await getWarningEmbed(null, `The emoji you provided could not be validated or is not from this server. Please choose an emoji from this server or one default emoji.`)], ephemeral: true, });
			}

			const { isVerifiedMessage, message } = await verifyMessageLink(interaction, message_link)
			if (!isVerifiedMessage) {
				return await interaction.reply({ embeds: [await getWarningEmbed(null, `The message link you provided could not be validated or is not from this server. Please ensure that you link a message from this server.`)], ephemeral: true, });
			}

			if (!await isReactRoleMessage(message)) {
				return await interaction.reply({ embeds: [await getWarningEmbed(null, `The selected message is not a react-roles message. Look for embeds marked with 'react-role message'.`)], ephemeral: true, });
			}


			//perform  availabity checks
			if (!await isAvailableRole(role)) {
				return await interaction.reply({ embeds: [await getWarningEmbed(null, `The selected role is already being used in a react-role message in this server.`)], ephemeral: true, });
			}

			if (!await isAvailableEmoji(emoji, message)) {
				return await interaction.reply({ embeds: [await getWarningEmbed(null, `The selected emoji is already being used in that message.`)], ephemeral: true, });
			}

			await saveReaction(message, emoji, role)

			await applyTextToReactMessage(message)

			await applyReactionsToMessage(message)

			await sendResponse(interaction, null, "add")

		}
		catch (error) {
			handleError(error)
		}

	}


	if (interaction.options.getSubcommand() == "remove") {
		try {

			console.log("👀" == "🥜")
			const message_link = await interaction.options.getString("message-link");
			const input_emoji = await interaction.options.getString("emoji");

			const { isVerifiedEmoji, emoji } = await verifyEmoji(interaction, input_emoji)
			if (!isVerifiedEmoji) {
				return await interaction.reply({ embeds: [await getWarningEmbed(null, `The emoji you provided could not be validated or is not from this server. Please choose an emoji from this server or one default emoji.`)], ephemeral: true, });
			}

			const { isVerifiedMessage, message } = await verifyMessageLink(interaction, message_link)
			if (!isVerifiedMessage) {
				return await interaction.reply({ embeds: [await getWarningEmbed(null, `The message link you provided could not be validated or is not from this server. Please ensure that you link a message from this server.`)], ephemeral: true, });
			}

			if (!await isReactRoleMessage(message)) {
				return await interaction.reply({ embeds: [await getWarningEmbed(null, `The selected message is not a react-roles message. Look for embeds marked with 'react-role message'.`)], ephemeral: true, });
			}

			if (await isAvailableEmoji(emoji, message)) {
				return await interaction.reply({ embeds: [await getWarningEmbed(null, `The selected emoji is not being used in that message.`)], ephemeral: true, });
			}


			//remove roles from every user who has reacted with that specific emoji

			await deleteRoleFromMembers(interaction, message, emoji)

			async function deleteRoleFromMembers(interaction, message, emoji) {
				try {

					const reactionRole = await db.sequelize.models.R_Role_Reactions.findOne({
						where: {
							message_id: message.id,
							emoji: emoji
						},
						raw: true,
						attributes: ['role']
					})

					const role = await interaction.guild.roles.cache.get(reactionRole.role);

					await interaction.guild.roles.create({
						name: role.name,
						color: role.color,
						hoist: role.hoist,
						position: role.position,
						permissions: role.permissions,
						mentionable: role.mentionable

					})

					role.delete()

				}
				catch (error) {
					handleError(error)
				}
			}


			await deleteReaction(message, emoji)

			async function deleteReaction(message, emoji) {
				try {
					await db.sequelize.models.R_Role_Reactions.destroy({
						where: {
							message_id: message.id,
							emoji: emoji,
						}
					})
				}
				catch (error) {
					handleError(error)
				}
			}

			await applyTextToReactMessage(message)

			await removeReactionsFromMessage(message, emoji)

			async function removeReactionsFromMessage(message, emoji) {
				try {
					message.reactions.cache.get(emoji).remove()
				}
				catch (error) {
					handleError(error)
				}

			}





			await sendResponse(interaction, null, "remove")


		}
		catch (error) {
			handleError(error)
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

async function sendReactMessageAndGetId(interaction, title, description, channel) {
	try {
		const message = await channel.send({ embeds: [await getStandardEmbed(title, description, null, null, null, { text: "react-role message" })] })

		return message.id
	}
	catch (error) {
		handleError(error)
	}
}

async function saveReactMessage(interaction, message_id, title, description) {
	try {
		await db.sequelize.models.R_Role_Messages.create({
			guild_id: interaction.guild.id,
			id: message_id,
			title: title,
			description: description,
			type: await interaction.options.getString("type"),
			createdAt: new Date(),
			updatedAt: new Date(),
		})
	}
	catch (error) {
		handleError(error)
	}
}

async function sendResponse(interaction, channel, type) {
	try {
		let message
		switch (type) {
			case "create":
				message = `Successfully created the react-role message in ${channelMention(channel.id)}`
				break
			case "add":
				message = `Successfully added reaction role to a message.`
				break
			case "remove":
				message = `Successfully removed reaction role from a message.`
				break
		}

		await interaction.reply({ embeds: [await getStandardEmbed(null, message)], ephemeral: true, });
	}
	catch (error) {
		handleError(error)
	}
}

async function verifyEmoji(interaction, emoji) {
	try {
		const unicodeEmojiOrId = /([0-9]+|\u00a9+|\u00ae+|[\u2000-\u3300]+|\ud83c[\ud000-\udfff]+|\ud83d[\ud000-\udfff]+|\ud83e[\ud000-\udfff]+)/g

		//if contains ID to costum emoji or unicode emoji
		if (!emoji.match(unicodeEmojiOrId)) {
			return { isVerifiedEmoji: false, emoji: null }
		}

		const firstMatch = emoji.match(unicodeEmojiOrId)[0]

		//if costum, check availability 
		if (firstMatch.match(/[0-9]+/g)) {
			if (!await interaction.guild.emojis.resolve(firstMatch)) {
				return { isVerifiedEmoji: false, emoji: null }
			}
		}

		return { isVerifiedEmoji: true, emoji: firstMatch }

	}
	catch (error) {
		handleError(error)
	}
}

async function verifyMessageLink(interaction, message_link) {
	try {
		//example link
		//https://discordapp.com/channels/1023167499365366746/1026826999911626185/1028283654394368000

		const matchedIds = message_link.match(/[0-9]+/g)

		//if no matches
		if (!matchedIds) {
			return { isVerifiedMessage: false, message: null }
		}

		//!3 ids -> guild|channel|message
		if (matchedIds.length < 3) {
			return { isVerifiedMessage: false, message: null }
		}


		const channelId = matchedIds[1]
		const messageId = matchedIds[2]


		let channel
		let message
		//trying to fetch a channel with id, catching if not valid
		//trying to fetch a message with id, catching if not valid
		try {
			channel = await interaction.guild.channels.fetch(channelId)
			message = await channel.messages.fetch(messageId)
		}
		catch { }

		if (!channel) {
			return { isVerifiedMessage: false, message: null }
		}

		if (!message) {
			return { isVerifiedMessage: false, message: null }
		}

		return { isVerifiedMessage: true, message }

	}
	catch (error) {
		handleError(error)
	}
}

async function isReactRoleMessage(message) {
	try {
		const result = await db.sequelize.models.R_Role_Messages.findByPk(message.id)

		if (!result) {
			return false
		}
		return true

	}
	catch (error) {
		handleError(error)
	}
}

async function isAvailableRole(role) {
	try {
		const result = await db.sequelize.models.R_Role_Reactions.findOne({
			where: {
				role: role.id
			}
		})

		if (result) {
			return false
		}

		return true


	}
	catch (error) {
		handleError(error)
	}
}

async function isAvailableEmoji(emoji, message) {
	try {
		const result = await db.sequelize.models.R_Role_Reactions.findOne({
			where: {
				message_id: message.id,
				emoji: emoji
			},
			raw: true
		})

		if (result) {
			return false
		}

		return true


	}
	catch (error) {
		handleError(error)
	}
}


async function saveReaction(message, emoji, role) {
	try {
		await db.sequelize.models.R_Role_Reactions.create({
			message_id: message.id,
			role: role.id,
			emoji: emoji,
			createdAt: new Date(),
		})
	}
	catch (error) {
		handleError(error)
	}
}


async function applyTextToReactMessage(message) {
	try {

		const reactMessageData = await db.sequelize.models.R_Role_Messages.findOne({
			where: {
				id: message.id
			},
			raw: true,
			attributes: ['title', 'description']

		})

		const reactionRoles = await db.sequelize.models.R_Role_Reactions.findAll({
			where: {
				message_id: message.id
			},
			raw: true,
			order: [['createdAt', 'ASC']],
			attributes: ['role', 'emoji']
		})

		let finalDescription = reactMessageData.description + "\n\n"

		reactionRoles.forEach((reactionRole) => {
			if (reactionRole.emoji.match(/[0-9]+/g)) {
				finalDescription += `<:_:${reactionRole.emoji}> - ${roleMention(reactionRole.role)}\n`
			} else {
				finalDescription += `${reactionRole.emoji} - ${roleMention(reactionRole.role)}\n`
			}
		});

		message.edit({ embeds: [await getStandardEmbed(reactMessageData.title, finalDescription, null, null, null, { text: "react-role message" })] })

	}
	catch (error) {
		handleError(error)
	}
}

async function applyReactionsToMessage(message) {
	try {
		const reactionRoles = await db.sequelize.models.R_Role_Reactions.findAll({
			where: {
				message_id: message.id
			},
			raw: true,
			order: [['createdAt', 'ASC']],
			attributes: ['role', 'emoji']
		})


		reactionRoles.forEach((reactionRole) => {
			message.react(reactionRole.emoji)
		});

	}
	catch (error) {
		handleError(error)
	}
}