/* eslint-env node */
module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    
    // EXTEND AIRBNB (The strict rules)
    extends: [
      'airbnb',
      'airbnb-typescript',
      'airbnb/hooks',
      'plugin:@typescript-eslint/recommended',
    ],
    
    // PARSER SETTINGS
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      project: './tsconfig.json', // <--- Points to your TS settings
    },
    
    plugins: ['react-refresh'],
    
    // CUSTOM RULES (To stop it from being TOO annoying)
    rules: {
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/require-default-props': 'off', // TS handles this
      'react/jsx-props-no-spreading': 'off', // Spreading props is common in UI libs
      'import/prefer-default-export': 'off', // Named exports are better
      'react/function-component-definition': 'off', // Arrow functions are fine
      
      // Formatting Overrides (Optional)
      'max-len': ['error', { code: 120 }], // Allow wider code lines
    },
  };