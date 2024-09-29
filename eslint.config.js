import globals from 'globals';
import pluginJs from '@eslint/js';
import mocha from 'eslint-plugin-mocha'; // Ensure eslint-plugin-mocha is installed

export default [
  {
    ignores: ['node_modules/', 'dist/', 'coverage/', '*.min.js'], // Add your ignore patterns here
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha, // Add Mocha globals
      },
    },
  },
  pluginJs.configs.recommended,
  {
    plugins: {
      mocha: mocha, // Ensure eslint-plugin-mocha is installed
    },
    rules: {
      // Add custom rules here
      'linebreak-style': ['error', 'unix'],
      'mocha/no-exclusive-tests': 'error', // Example custom rule
    },
  },
];
