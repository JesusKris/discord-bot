const config = require("../appconfig.js");
const { handleError } = require("../modules/errorHandling.js");
const { getUserPermissions, hasPermission } = require("../modules/permissions.js");
const { shuffleArray, sleep } = require("../modules/utils.js");
const { getGuildSettings } = require("../modules/guildSettings.js");
const { getWarningEmbed } = require("../bot-responses/embeds/warning.js");
module.exports = async (client, message) => { // eslint-disable-line
	const { container } = client;

	if (message.author.bot) return;

	if (message.content.includes(`<@${client.user.id}>`)) {
		return message.channel.send(await getPingReply());
	}

	// If the member on a guild is invisible or not cached, fetch them.
	if (message.guild && !message.member) {
		await fetchMember(message);
	}

	const prefix = await getPrefix(message);
	if (!prefix) return;

	const commandAndInitialArgs = await getCommandAndInitialArgs(message.content, prefix);
	const cmd = await container.commands.get(commandAndInitialArgs.command);

	// if cmd does not exist
	if (!cmd) return;

	// guild only
	if (cmd && !message.guild && cmd.config.guildOnly) return;

	// if enabled
	if (!cmd.config.enabled) return;


	const args = await getCorrectArgs(cmd, commandAndInitialArgs.args);
	const guildSettings = await getGuildSettings(message);
	const userPermissions = await getUserPermissions(guildSettings, message);


	// if server owner
	if (cmd.config.setupRequired && !guildSettings && message.user.id === message.member.guild.ownerId) {
		return await sendWarningResponse(message, "You have not completed server setup yet.");
	}


	// user
	if (cmd.config.setupRequired && !guildSettings) {
		return await sendWarningResponse(message, "The server owner has not completed setup process yet.");
	}


	// if user has required permission level to run the command
	if (await hasPermission(userPermissions, cmd) || message.user.id === message.member.guild.ownerId) {
		return await cmd.run(client, message, args, userPermissions);
	}

	return await sendWarningResponse(message, "You don't have permissions to use this command.");
};

async function fetchMember(message) {
	try {
		await message.guild.members.fetch(message.author);
	}
	catch (error) {
		handleError(error);
	}
}

async function getPrefix(message) {

	return new RegExp(`^\\${config.client.prefix}`).exec(message.content);
}

async function getCommandAndInitialArgs(content, prefix) {
	// if starts with prefix

	const args = content.slice(prefix[0].length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	return { command, args };
}

async function getCorrectArgs(command, args) {
	const realArgs = [];
	while (args.length) {
		if (realArgs.length === (command.config.maxArgs - 1) && args.length > 1) {
			realArgs.push(args.join(" "));
			args = [];
		}
		else {
			realArgs.push(args.shift());
		}
	}
	return realArgs;
}

async function getPingReply() {

	const pingResponses = {
		choices: [
			"You didn't survive PrintRune to just give up now, right!?",
			"Programmer - A machine that turns coffee into code.",
			"Algorithm - Word used by programmers when they do not want to explain what they did.",
			"Hardware - The part of a computer that you can kick.",
			"Software developers like to solve problems. If there are no problems handily available they will create their own problems!",
			"Debugging: Removing the needles from the haystack.",
			"Software - The part of a computer that you can't hit.",
			"Real programmers count from 0",
			"A good programmer is someone who looks both ways before crossing a one-way street.",
			"99 little bugs in the code, 99 bugs in the code, 1 bug fixed, compile again, 153 little bugs in the code",
			"A programmer was arrested for writing unreadable code. He refused to comment.",
			"Why do programmers like dark mode? Because light attracts bugs.",
			"Why don't programmers like nature? There's too many bugs.",
			"Why did the programmer's girlfriend leave him? He had problems committing.",
			"What you call it when computer programmers make fun of each other? Cyber boolean.",
			"Spiders are excellent programmers. They're just so great at debugging.",
			"What language is most commonly used by programmers? Vulgar.",
			"What does a programmer's ghost say? Bool!",
			"Programmer: “Honey, you're my number one…” Wife: “Oh, really!? Well who's your number zero, you cheat!”",
			"Why are you wasting your time?",
			"Stop bothering me ugh..",
			"Do you need something?",
			"You got this!",
			"Seems like you miss PrintRune..",
			"Have you taken a break today?",
			"I like you!",
			"Take a break jheez..!",
			"Go outside",
			"Knock-knock!",
			"Give me a hug :(",
			"I'm not in the mood for talking…",
			"I'm pleased to meet you.",
			"I can't sleep.",
			"“Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.” - Albert Einstein",
			"“An optimist is someone who falls off the Empire State Building, and after 50 floors says, 'So far so good!'” - Anonymous",
			"“It's so much easier to suggest solutions when you don't know too much about the problem.” - Malcolm Forbes",
			"“You can't believe everything you hear — but you can repeat it.” - Anonymous",
			"“You are only young once. After that you have to think up some other excuse.” - Billy Arthur",
			"“True terror is to wake up one morning and discover that your high school class is running the country.” - Kurt Vonnegut",
			"“In real life, I assure you, there is no such thing as algebra.” - Fran Lebowitz",
			"“People say money is not the key to happiness, but I have always figured if you have enough money, you can have a key made.” - Joan Rivers",
			"“Anybody who tells you money can't buy happiness never had any.” - Samuel L. Jackson",
			"“Do what you can, with what you have, where you are.” - Theodore Roosevelt",
			"“You miss 100% of the shots you don't take.” - Wayne Gretzky",
			"“A person who never made a mistake never tried anything new.” - Albert Einstein",
			"“Success is not final; failure is not fatal: It is the courage to continue that counts.” - Winston S. Churchill",
			"“You define your own life. Don't let other people write your script.” - Oprah Winfrey",
			"“Wake up determined, go to bed satisfied.” - Dwayne \"The Rock\" Johnson",
			"“Any fool can write code that a computer can understand. Good programmers write code that humans can understand.” - Martin Fowler",
			"“First, solve the problem. Then, write the code.” - John Johnson",
			"“Without requirements or design, programming is the art of adding bugs to an empty text file.”",
			"“If you optimize everything, you will always be unhappy.” - Donald Knuth",
			"“Debugging becomes significantly easier if you first admit that you are the problem.” - William Laeder",
			"“The trouble with programmers is that you can never tell what a programmer is doing until it's too late.” - Seymour Cray",
			"“Everybody in this country should learn to program a computer because it teaches you how to think.” - Steve Jobs",
			"“Developer is an organism that turns coffee into code.”",
			"“If debugging is the process of removing software bugs, then programming must be the process of putting them in.” - Edsger Dijkstra",
			"“Computers are good at following instructions, but not at reading your mind.” - Donald Knuth",
			"“Computers are fast; programmers keep it slow.”",
			"“Programming is like sex: One mistake and you have to support it for the rest of your life.”",
			"“One man's crappy software is another man's full-time job.”",
			"“Deleted code is debugged code.”",
			"“It's not a bug — it's an undocumented feature.”",
			"“It works on my machine.”",
			"“There are only two kinds of programming languages out there. The ones people complain about and the ones no one uses.”",
			"“To understand what recursion is, you must first understand recursion.”",
			"“I have not failed. I've just found 10,000 ways that won't work.”",
			"“When all else fails … reboot.”",
			"“I am who I am today because of the choices I made yesterday.” - Eleanor Roosevelt,",
			"“Sometimes, you have to give up. Sometimes, knowing when to give up, when to try something else, is genius. Giving up doesn't mean stopping. Don't ever stop.” - Phil Knight",
			"“If you really look closely, most overnight successes took a long time.” - Steve Jobs,",
			"“Impossible is just an opinion.” - Paulo Coelho",
			"“It's hard to beat a person who never gives up.” - Babe Ruth",
			"“If something is important enough, even if the odds are against you, you should still do it.” - Elon Musk",
			"“Never be limited by other people's limited imaginations.” - Dr. Mae Jemison",
			"“You're not obligated to win. You're obligated to keep trying to do the best you can every day.” - Marian Wright Edelman",
			"“Hard work beats talent when talent fails to work hard.”",
		],
	};

	const randomNr = Math.floor(Math.random() * pingResponses.choices.length);
	const shuffledArray = await shuffleArray(pingResponses.choices);
	return shuffledArray[randomNr];
}


async function sendWarningResponse(messageObject, message) {
	try {
		const warning = await messageObject.channel.send({ embeds: [await getWarningEmbed(null, message)] });

		await sleep(2500);

		await warning.delete();

		await messageObject.delete();

	}
	catch (error) {
		handleError(error);
	}
}