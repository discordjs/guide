const path = require('path');

module.exports = {
	'extends': path.join(__dirname, '..', '.eslintrc.js'),
	rules: {
		'no-undef': 'off',
		'no-unused-vars': 'off',
	},
};
