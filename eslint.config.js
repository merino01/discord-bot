/* eslint-disable */
import globals from "globals"
import pluginJs from "@eslint/js"

export default [
	{ languageOptions: { globals: globals.node } },
	pluginJs.configs.recommended,
	{
		"rules": {
			"indent": ["error", "tab"],
			"quotes": ["error", "double"],
			"semi": ["error", "never"],
			"no-unused-vars": "warn",
			"eol-last": ["error", "always"],
			"no-multiple-empty-lines": ["error", { "max": 1 }],
			"object-curly-spacing": ["error", "always"],
			"space-before-function-paren": ["error", "always"],
			"comma-dangle": ["error", "never"],
			"arrow-body-style": ["error", "as-needed"],
			"arrow-parens": ["error", "always"],
			"arrow-spacing": ["error", { "before": true, "after": true }],
			"prefer-arrow-callback": ["error", { "allowNamedFunctions": false }],
			"implicit-arrow-linebreak": ["error", "beside"],
			"no-confusing-arrow": ["error", { "allowParens": true }],
			"no-var": "error",
			"prefer-const": "error",
			"no-use-before-define": ["error", { "functions": false, "classes": true, "variables": false }],
			"eqeqeq": ["error", "always"],
			"curly": ["error", "all"],
			"no-implicit-coercion": ["error", { "allow": [] }],
			"no-trailing-spaces": "error",
			"max-len": ["error", { "code": 100, "ignoreComments": true, "ignoreUrls": true }],
			"no-unused-expressions": ["error", { "allowShortCircuit": true, "allowTernary": true }],
			"no-shadow": "error",
			"complexity": ["error", 10],
			"max-params": ["error", 3],
			"no-useless-return": "error",
			"prefer-spread": "error",
			"max-lines-per-function": ["error", 80],
			"brace-style": ["error", "1tbs", { "allowSingleLine": true }],
			"object-shorthand": ["error", "always"]
		}
	}
]
