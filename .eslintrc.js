module.exports = {
  'parser': '@typescript-eslint/parser',
  'plugins': ['@typescript-eslint'],
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  'rules': {
    'semi': 'off',
    'quotes': ['error', 'single'],
    '@typescript-eslint/semi': ['error', 'never'],
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: {
        delimiter: 'none',
        requireLast: true,
      },
      singleline: {
        delimiter: 'semi',
        requireLast: false,
      },
    }],
    'camelcase': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        'selector': 'default',
        'format': ['camelCase']
      },

      {
        'selector': 'variable',
        'format': ['camelCase', 'UPPER_CASE']
      },
      {
        'selector': 'parameter',
        'format': ['camelCase'],
        'leadingUnderscore': 'allow'
      },

      {
        'selector': 'memberLike',
        'modifiers': ['private'],
        'format': ['camelCase'],
        // 'leadingUnderscore': 'require'
      },

      {
        'selector': 'typeLike',
        'format': ['PascalCase']
      }
    ],
    'object-curly-spacing': ['warn', 'always'],
    'no-console': 'error',
    'no-debugger': 'error',
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // variable declaration
    'one-var': ['error', 'never'],
    'no-var': ['error'],
    // allow async-await
    'generator-star-spacing': 0,
    // allow comma-dangle
    'comma-dangle': ['error', 'only-multiline'],

    'indent': ['error', 2, { ignoredNodes: ['TemplateLiteral'], SwitchCase: 1 }],
    'template-curly-spacing': 'off'
  },
}
