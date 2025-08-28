module.exports = {
  ...require('@ackee/styleguide-backend-config/eslint'),
  root: true,
  ignorePatterns: ['dist', 'src/openapi', 'docs', 'knexfile.ts'],
  parserOptions: {
    project: '.eslint.tsconfig.json',
  },
}
