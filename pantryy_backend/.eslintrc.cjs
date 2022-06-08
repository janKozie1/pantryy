module.exports = {
  env: {
    browser: true,
    es2021: true,
    "jest/globals": true
  },
  extends: [
    'eslint:recommended',
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ["**/dist/**/*.*"],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'jest',
  ],
  rules: {
    "semi": ["error", "always"],
    "quotes": ["error", "single"],
    "import/extensions": "off",
    "max-len": ["error", { "code": 130, "tabWidth": 2, "ignoreRegExpLiterals": true, "ignoreStrings": true }],
    "no-control-regex": "off"
  },
};
