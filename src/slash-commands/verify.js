const { handleError } = require("../modules/errorHandling");
const config = require("../appconfig.js");
const { getGuildSettings } = require("../modules/guildSettings");
const { getWarningEmbed } = require("../bot-responses/embeds/warning");
const { getLogEmbed } = require("../bot-responses/embeds/log");
const { bold, userMention } = require("discord.js");
const { getStandardEmbed } = require("../bot-responses/embeds/standard");
const { shuffleArray } = require("../modules/utils");

exports.run = async (client, interaction, permissions) => {
	try {
		const settings = await getGuildSettings(interaction);
		if (!settings.is_main_server) {
			return await interaction.reply({ embeds: [await getWarningEmbed(null, "Verification is disabled in a sprint server!")] });
		}

		const member = await interaction.guild.members.fetch(interaction.user.id);

		const isVerified = await checkVerification(interaction, settings, member);
		if (isVerified) {
			return await interaction.reply({ embeds: [await getWarningEmbed(null, "You are already verified!")] });
		}


		const isCorrectPassword = await checkPassword(interaction, settings);
		if (!isCorrectPassword) {
			return await interaction.reply({ embeds: [await getWarningEmbed(null, "Incorrect code provided. Please try again!")] });
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

		return await interaction.reply({ embeds: [await getStandardEmbed(null, "Successfully verified!")], ephemeral: true });

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

async function checkVerification(interaction, settings, member) {

	try {

		if (member.roles.cache.has(settings.admin_role) || member.roles.cache.has(settings.guest_role) || member.roles.cache.has(settings.student_role)) {
			return true;
		}
		return false;

	}
	catch (error) {
		handleError(error);
	}

}

async function checkPassword(interaction, settings) {

	try {
		const password = await interaction.options.getString("code");
		if (password == settings.master_password || password == settings.guest_password || password == settings.student_password) {
			return true;
		}
		console.log(interaction.guild);
		return false;
	}
	catch (error) {
		handleError(error);
	}


}

async function sendDmConfirmation(interaction, member) {

	try {

		member.send({ embeds: [await getLogEmbed(`Successfully verified in ${bold(interaction.guild.name)}!`)] });

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

		switch (type) {
			case "student":
				const gitea = await interaction.options.getString("gitea-name");

				return await member.setNickname(`${name} / ${gitea}`);
			case "guest":
				return await member.setNickname(name);
		}

	}
	catch (error) {
		handleError(error);
	}

}

async function grantRoles(settings, member, type) {
	try {

		switch (type) {
			case "student":
				await member.roles.add(settings.student_role);
				await member.roles.add(settings.batch_role);
				return;
			case "guest":
				return await member.roles.add(settings.guest_role);

		}
	}
	catch (error) {
		handleError(error);
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