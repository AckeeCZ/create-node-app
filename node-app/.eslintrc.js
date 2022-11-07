module.exports = {
  ...require('@ackee/styleguide-backend-config/eslint'),
  ignorePatterns: ['lib'],
  parserOptions: {
    project: '.eslint.tsconfig.json',
  },
}
