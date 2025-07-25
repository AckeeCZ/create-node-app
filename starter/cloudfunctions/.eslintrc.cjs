module.exports = {
  ...require('@ackee/styleguide-backend-config/eslint'),
  root: true,
  ignorePatterns: ['lib'],
  parserOptions: {
    project: '.eslint.tsconfig.json',
  },
}
