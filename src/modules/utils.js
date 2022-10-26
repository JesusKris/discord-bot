exports.sleep = ms => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

exports.shuffleArray = async (array) => {
	return array.sort(() => Math.random() - 0.5);
};

exports.getRawId = async (input) => {
	return input.replace(/\D/g, "");
};


exports.getRawEmoji = async (emoji) => {
	if (!emoji.id) {
		return emoji.name;
	}
	return emoji.id;
};
