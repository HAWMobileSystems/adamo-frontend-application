const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',

  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
    // project: path.resolve(__dirname, './tsconfig.eslint.json'),
    // sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    //'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],
};
//  // extends: [
//  //   'eslint:recommended',
//     //'plugin:@typescript-eslint/recommended',
//     //'plugin:@typescript-eslint/recommended-requiring-type-checking',
//     //'prettier/@typescript-eslint',  // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
//     //'plugin:prettier/recommended',
//  // ],
//   parserOptions: {
//     'project': path.resolve(__dirname, './tsconfig.eslint.json'),
//     'sourceType': 'module',
//   },
//   //plugins: ['@typescript-eslint'],
//   rules: {
//     //   "@typescript-eslint/rule-name": "error"
//   },
// };
