require("dotenv").config({ path: "../.env" });
module.exports = {

	sequelize: {
		username: process.env.MARIADB_USER,
		password: process.env.MARIADB_PASSWORD,
		database: process.env.MARIADB_DATABASE,
		host: process.env.MARIADB_HOST,
		dialect: process.env.DB_DIALECT,
		logging: false,
	},
	client: {
		// ./engine.js
		healthcheck: process.env.PORT,
		name: process.env.BOT_NAME,
		token: process.env.BOT_TOKEN,
		prefix: process.env.PREFIX,
		intents: JSON.parse(process.env.BOT_INTENTS),
		Id: process.env.ID,
		test_guild: process.env.TEST_GUILD,


		// ./events/ready.js
		activityStatus: {
			choices: [
				"Oh Snap!",
				"BIM!",
				"Googling...",
				"PrintRune <3",
				"You got this!",
				"kood/Jõhvi",
				"🚀",
				"No pressure!",
				"@Jõhvi"
			],
			timer: 30000,
		},

		// ./events/messageCreate.js
		pingResponses: {
			choices: [
				"You didn't survive PrintRune to just give up now, right!?",
				"Why are you wasting your time?",
				"Stop bothering me ugh..",
				"Do you need something?",
				"You got this!",
				"Seems like you miss PrintRune..",
				"Kadi is my favorite team member",
				"Have you taken a break today?",
				"I like you!",
				"Take a break jheez..!",
				"Go outside",
				"Knock-knock!",
				"Give me a hug :(",
				"I'm not in the mood for talking…",
				"I'm pleased to meet you.",
				"I can't sleep.",
				"“Think of how stupid the average person is and realize half of them are stupider than that.” - George Carlin",
				"“Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.” - Albert Einstein",
				"“I'm not offended by blonde jokes because I know I'm not dumb…and I also know that I'm not blonde.” - Dolly Parton",
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
		},

		commands: {
			// ./modules/permissions.js
			permissions: {
				user: "user",
				admin: "admin",
				guildOwner: "owner",
			},
			// time after interaction consideres inactivity
			defaultAwaitTimer: 3 * 60 * 1000,
		},
	},


	// ./modules/error-handling.js
	errorLogs: {
		// time ago when error logs are considered expired
		// current date - days * hours * minutes * seconds * milliseconds
		expired: (new Date() - 7 * 24 * 60 * 60 * 1000),
	},

	statusChecks: {
		// ./events/ready.js
		// hours * minutes * seconds * milliseconds
		databaseTimer: 3 * 60 * 60 * 1000,
	},
};