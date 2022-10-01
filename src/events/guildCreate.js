const { getStandardEmbed } = require("../bot-responses/embeds/standard.js");
const { handleError } = require("../modules/errorHandling.js");
const logger = require("../modules/logger.js");
const { bold, codeBlock } = require("discord.js");
const config = require("../appconfig.js")

module.exports = async (client, guild) => {
	logger.guild(`${guild.name}, (id:${guild.id}) added the client.`);

	try {
		await sendIntroductionsToOwner(client, guild);
	}
	catch (error) {
		handleError(client, error);
	}

};

async function sendIntroductionsToOwner(client, guild) {
	try {

		const user = await guild.members.fetch(guild.ownerId);
		await user.send({ embeds: [await getStandardEmbed("A bird whispers:", await getIntroductionDescription(), null, await getIntroductionFields())] });

	}
	catch (error) {
		handleError(error);
	}
}

async function getIntroductionDescription() {

	try {
		return `"Hey! My name is Robert. To awaken ${bold(config.client.name)}, you must first use ${bold("/setup")} command.\n\nMore about the setup command:`;
	}
	catch (error) {
		handleError(error);
	}
}

async function getIntroductionFields() {
	try {
		const fields = [
			{
				name: "type",
				value: "Main server choice will have all the features available for use. Choosing sprint on the other hand will restrict the use of the verification feature."
			},
			{
				name: "admin-role",
				value: "Admin role is the role needed to perform most features with the bot. Be careful with selecting this as this role will hold a lot of power."
			},
			{
				name: "student-role && batch-role",
				value: "Both of these roles are needed to perform verification for students when they want to join a main server. Batch role will be an indicator of what batch they are in kood/Jõhvi."
			},
			{
				name: "quest-role",
				value: "Guest role is needed to perform verfication for guests when they want to join a main server."
			},
			{
				name: "notification-channel",
				value: "This channel is needed to recieve notifications about a member joining/leaving/kicked/banned."
			},
			{
				name: "greetings-channel",
				value: "This channel is needed to send a greeting notification when a new student completes the verification step."
			}
		];

		return fields

	}
	catch (error) {

	}
}