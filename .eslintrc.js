module.exports = {
	extends: 'aqua/vue',
	plugins: ['markdown'],
	rules: {
		'arrow-body-style': 'off',
		'comma-dangle': ['error', 'always-multiline'],
		'radix': ['error', 'as-needed'],
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-negated-condition': 'off',
		'operator-linebreak': ['error', 'before'],
		'quote-props': ['error', 'as-needed'],
		'vue/max-attributes-per-line': ['error', {
			singleline: 4,
			multiline: {
				max: 1,
				allowFirstline: false,
			},
		}],
		'vue/html-self-closing': ['error', {
			html: {
				void: 'always',
				normal: 'never',
				component: 'always',
			},
		}],
		'vue/require-default-prop': 'off',
		'vue/require-prop-types': 'off',
	},
};
