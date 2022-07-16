const { cyan, red, gray, yellow, green, magenta, blue } = require('colorette');
const { Timestamp } = require('@sapphire/time-utilities');

exports.log = (content, type = 'log') => {
	const timestamp = `[${cyan(new Timestamp('YYYY-MM-DD HH:mm:ss.sss'))}]:`;

	switch (type) {
	case 'log': return console.log(`${timestamp} ${gray(type.toUpperCase())} ${content}`);
	case 'warn': return console.log(`${timestamp} ${yellow(type.toUpperCase())} ${content} ⚠️`);
	case 'error': return console.log(`${timestamp} ${red(type.toUpperCase())} ${content} ❌`);
	case 'ready': return console.log(`${timestamp} ${green(type.toUpperCase())} ${content} ✔️`);
	case 'guild' : return console.log(`${timestamp} ${magenta(type.toUpperCase())} ${content} 👋`);
	case 'debug': return console.log(`${timestamp} ${blue(type.toUpperCase())} ${content}`);
	default: throw new TypeError('Logger type must be either log, warn, error, ready, guild or debug.');
	}
};

exports.error = (...args) => this.log(...args, 'error');

exports.warn = (...args) => this.log(...args, 'warn');

exports.ready = (...args) => this.log(...args, 'ready');

exports.guild = (...args) => this.log(...args, 'guild');

exports.debug = (...args) => this.log(...args, 'debug');
