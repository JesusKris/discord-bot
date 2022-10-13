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
		const settings = await getGuildSettings(interaction);
		if (!settings.is_main) {
			return await interaction.reply({ embeds: [await getWarningEmbed(null, "Verification is disabled in a sprint server.")], ephemeral: true });
		}

		const member = await interaction.guild.members.fetch(interaction.user.id);

		const isVerified = await checkVerification(settings, member);
		if (isVerified) {
			return await interaction.reply({ embeds: [await getWarningEmbed(null, "You are already verified.")], ephemeral: true });
		}


		const isCorrectPassword = await checkPassword(interaction, settings);
		if (!isCorrectPassword) {
			return await interaction.reply({ embeds: [await getWarningEmbed(null, "Incorrect code provided. Please try again.")], ephemeral: true });
		}


		if (interaction.options.getSubcommand() === "student") {
			await sendDmConfirmation(interaction, member);
			await formatUsername(interaction, member, "student");
			await grantRoles(settings, member, "student");

			if (settings.greetings_channel) {
				await sendGreetings(settings, member);
			}
		}

		if (interaction.options.getSubcommand() === "guest") {
			await sendDmConfirmation(interaction, member);
			await formatUsername(interaction, member, "guest");
			await grantRoles(settings, member, "guest");
		}

		return interaction.reply({ embeds: [await getStandardEmbed(null, "Successfully verified.")], ephemeral: true });

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
	description: "Verify yourself in the server with a code provided by kood/",
	args: "",
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
	if (password == settings.master_password || password == settings.guest_password || password == settings.student_password) {
		return true;
	}

	return false;
}

async function sendDmConfirmation(interaction, member) {
	try {

		member.send({ embeds: [await getLogEmbed(`Successfully verified in ${bold(interaction.guild.name)}.`)] });

	}
	catch (error) {
		handleError(error);
	}

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

	if (type == "stduent") {
		await member.roles.add(settings.student_role);
		return await member.roles.add(settings.batch_role);
	}


	if (type == "guest") {
		return await member.roles.add(settings.guest_role);
	}
}

async function sendGreetings(settings, member) {
	try {

		const channel = await member.guild.channels.cache.get(settings.greetings_channel);

		channel.send(await getGreetingMessage(member));

	}
	catch (error) {
		handleError(error);
	}

}

async function getGreetingMessage(member) {
	const greetings = [
		`Everybody welcome ${userMention(member.id)} to kood/Jõhvi!`,
		`Another student has entered the arena! ${userMention(member.id)} good luck!`,
	];

	const randomNr = Math.floor(Math.random() * greetings.length);
	const shuffledArray = await shuffleArray(greetings);

	return shuffledArray[randomNr];

}