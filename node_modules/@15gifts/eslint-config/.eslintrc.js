module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'standard'
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 10
  },
  env: {
    es6: true,
    browser: true,
    mocha: true,
    node: true,
    jest: true
  },
  settings: {
      react: {
          version: '16.0'
      },
      'import/resolver': {
          node: {
            paths: ['./src']
          }
      }
  },
  plugins: [
    'react',
    'react-hooks',
    'jsdoc',
    'jsx-a11y'
  ],
  rules: {
    'node/no-deprecated-api': 1,
    'comma-dangle' : [2, 'always-multiline'],
    'curly': [2, 'multi-line', 'consistent'],
    'react-hooks/rules-of-hooks': 'error',
    'no-unused-vars': [2, { 'ignoreRestSiblings': false }],
    'brace-style': ['error', 'stroustrup'],
  }
}
