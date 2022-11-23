const { handleError } = require("../modules/errorHandling");
const config = require("../appconfig.js");
const { getGuildSettings } = require("../modules/guildSettings");
const { getWarningEmbed } = require("../bot-responses/embeds/warning");
const { getLogEmbed } = require("../bot-responses/embeds/log");
const { bold, userMention } = require("discord.js");
const { getStandardEmbed } = require("../bot-responses/embeds/standard");
const { shuffleArray } = require("../modules/utils");

exports.run = async (client, interaction, permissions) => { // eslint-disable-line
	try {

		await interaction.deferReply({ ephemeral: true, content: "Thinking..." });

		const settings = await getGuildSettings(interaction);
		if (!settings.is_main) {
			return await interaction.editReply({ embeds: [await getWarningEmbed(null, "Verification is disabled in a sprint server.")], ephemeral: true });
		}

		const member = await interaction.guild.members.fetch(interaction.user.id);

		const isVerified = await checkVerification(settings, member);
		if (isVerified) {
			return await interaction.editReply({ embeds: [await getWarningEmbed(null, "You are already verified.")], ephemeral: true });
		}


		const isCorrectPassword = await checkPassword(interaction, settings);
		if (!isCorrectPassword) {
			return await interaction.editReply({ embeds: [await getWarningEmbed(null, "Incorrect code provided. Please try again.")], ephemeral: true });
		}


		if (interaction.options.getSubcommand() === "student") {
			const name = await interaction.options.getString("full-name");
			const gitea = await interaction.options.getString("gitea-name");

			const nickname = `${name} / ${gitea}`;
			if (nickname.length > 32) {
				return await interaction.editReply({ embeds: [await getStandardEmbed("Oops!", "It looks like your full name and gitea username combined is longer than 32 characters. That's too much for discord.. Please only enter your first name instead.")], ephemeral: true });
			}

			await sendDmConfirmation(interaction, member);
			await formatUsername(interaction, member, "student");
			await grantRoles(settings, member, "student");

			if (settings.greetings_channel) {
				await sendGreetings(settings, member);
			}
		}

		if (interaction.options.getSubcommand() === "guest") {
			const name = await interaction.options.getString("full-name");

			const nickname = `${name}`;
			if (nickname.length > 32) {
				return await interaction.editReply({ embeds: [await getStandardEmbed("Oops!", "It looks like your full name is longer than 32 characters. That's too much for discord.. Please try to shorten it.")], ephemeral: true });
			}

			await sendDmConfirmation(interaction, member);
			await formatUsername(interaction, member, "guest");
			await grantRoles(settings, member, "guest");
		}

		return await interaction.editReply({ embeds: [await getStandardEmbed(null, "Successfully verified.")], ephemeral: true });

	}
	catch (error) {
		handleError(error);
	}
};

exports.config = {
	enabled: true,
	name: "verify",
	setupRequired: true,
	requiredPermission: config.client.commands.permissions.user,
	guildOnly: true,
	description: "Users can verify themselves in server with a code provided by kood/",
	args: "<student> <guest>",
	// Needed for legacy commands
	// maxArgs: 0,
};

async function checkVerification(settings, member) {

	if (member.roles.cache.has(settings.admin_role) || member.roles.cache.has(settings.guest_role) || member.roles.cache.has(settings.student_role)) {
		return true;
	}
	return false;
}

async function checkPassword(interaction, settings) {

	const password = await interaction.options.getString("code");
	if (interaction.options.getSubcommand() === "student") {
		if (password == settings.master_password || password == settings.student_password) {
			return true;
		}

		return false;
	}

	if (interaction.options.getSubcommand() === "guest") {
		if (password == settings.master_password || password == settings.guest_password) {
			return true;
		}

		return false;
	}
}

async function sendDmConfirmation(interaction, member) {
	try {
		await member.send({ embeds: [await getLogEmbed(`Successfully verified in ${bold(interaction.guild.name)}.`)] });
	}
	catch (error) {}
}

async function formatUsername(interaction, member, type) {
	try {
		if (interaction.guild.ownerId == member.id) {
			return;
		}

		const name = await interaction.options.getString("full-name");

		if (type == "student") {
			const gitea = await interaction.options.getString("gitea-name");
			return await member.setNickname(`${name} / ${gitea}`);
		}


		if (type == "guest") {
			return await member.setNickname(name);
		}

	}
	catch (error) {
		handleError(error);
	}
}

async function grantRoles(settings, member, type) {

	if (type == "student") {
		try {
			await member.roles.add(settings.student_role);
			return await member.roles.add(settings.batch_role);
		}
		catch { } // eslint-disable-line
	}

	if (type == "guest") {
		try {
			return await member.roles.add(settings.guest_role);
		}
		catch { } // eslint-disable-line
	}
}

async function sendGreetings(settings, member) {
	try {
		const channel = await member.guild.channels.cache.get(settings.greetings_channel);

		// channel deleted
		if (!channel) return;

		await channel.send(await getGreetingMessage(member));

	}
	catch (error) {
		handleError(error);
	}
}

async function getGreetingMessage(member) {
	const greetings = [
		`Hope you are ready for the ride 🎢 ${userMention(member.id)}!`,
		`Hello world. 👋 Whoops sorry I mean Hello ${userMention(member.id)}!`,
		`${userMention(member.id)}'s journey at kood/Jõhvi has kicked off! 🚀`,
		`Eat, sleep, code, repeat. 💻 ${userMention(member.id)} get ready to start your journey at kood/Jõhvi!`,
	];

	const randomNr = Math.floor(Math.random() * greetings.length);
	const shuffledArray = await shuffleArray(greetings);

	return shuffledArray[randomNr];
}