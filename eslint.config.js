import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'

export default [
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                console: 'readonly',
                process: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                Buffer: 'readonly',
                setTimeout: 'readonly',
                setInterval: 'readonly',
                clearTimeout: 'readonly',
                clearInterval: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': tseslint,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            'indent': ['error', 4],
            '@typescript-eslint/no-explicit-any': 0,
            '@typescript-eslint/no-non-null-assertion': 0,
            'no-console': 'off',
            'no-fallthrough': 0,
            'no-useless-escape': 0,
            'arrow-body-style': 'off',
            'array-bracket-spacing': [2, 'always'],
            'object-curly-spacing': [2, 'always'],
            'quotes': [2, 'single', { 'avoidEscape': true }],
            'semi': ['error', 'never'],
            'space-before-function-paren': [2, 'never'],
            'switch-colon-spacing': [2, { 'after': true, 'before': false }],
            'no-multiple-empty-lines': ['error', { 'max': 2, 'maxBOF': 1 }],
        },
    },
]


