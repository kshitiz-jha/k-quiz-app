module.exports = {
	env: {
		node: true,
		commonjs: true,
		es2022: true,
	},
	extends: 'eslint:recommended',
	parserOptions: {
		ecmaVersion: 'latest',
	},
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single', { avoidEscape: true }],
		semi: ['error', 'always'],
		'comma-dangle': ['error', 'always-multiline'],
		'prefer-const': ['error', {
			'destructuring': 'all',
			'ignoreReadBeforeAssign': false,
		}],
		eqeqeq: ['error', 'always'],
		'no-nested-ternary': 'error',
		'no-param-reassign': 'error',
		'no-console': 'error',
	},
};
