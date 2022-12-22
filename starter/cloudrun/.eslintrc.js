module.exports = {
  ...require('@ackee/styleguide-backend-config/eslint'),
  ignorePatterns: ['dist', 'src/openapi', 'docs'],
  parserOptions: {
    project: '.eslint.tsconfig.json',
  },
}
