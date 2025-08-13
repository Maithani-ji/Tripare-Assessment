import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginReactNative from 'eslint-plugin-react-native';
import pluginPrettier from 'eslint-plugin-prettier';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['node_modules', 'dist', 'build'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      react: pluginReact,
      'react-native': pluginReactNative,
      prettier: pluginPrettier,
      '@typescript-eslint': tseslint,
    },
    rules: {
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'no-console': 'warn',
      'react/react-in-jsx-scope': 'off', // RN doesn't need React in scope
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
