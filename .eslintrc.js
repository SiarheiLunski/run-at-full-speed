module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    'semi': 'error',
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    '@typescript-eslint/no-empty-function': 0
  }
};
