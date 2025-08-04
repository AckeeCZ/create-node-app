const { omit } = require('lodash')
const defaultConfig = {
  ...require('@ackee/styleguide-backend-config/eslint'),
}

module.exports = {
  root: true,
  ignorePatterns: ['dist', 'docs', 'src/generated'],
  overrides: [
    {
      ...omit(defaultConfig, ['ignorePatterns']),
      files: ['*.ts', '*.js'],
      parserOptions: {
        project: '.eslint.tsconfig.json',
      },
      rules: {
        ...defaultConfig['rules'],
        '@typescript-eslint/strict-boolean-expressions': 0,
        '@typescript-eslint/no-misused-promises': 'warn',
      },
    },
    {
      files: ['**/*.graphql'],
      extends: 'plugin:@graphql-eslint/schema-recommended',
      parserOptions: {
        graphQLConfig: {
          schema: './src/view/graphql/schema/*.graphql',
        },
      },
      rules: {
        '@graphql-eslint/strict-id-in-types': 0,
        '@graphql-eslint/require-description': [
          'warn',
          {
            types: true,
            DirectiveDefinition: true,
          },
        ],
        '@graphql-eslint/no-unreachable-types': 'warn',
      },
    },
  ],
}
