# Cloud Functions + GraphQL Starter

Node.js project scaffolded with Cloud functions + GraphQL

## 🎉 Initialize project

Run `create-node-app cloudfunctions` to init your project. By default project is created in `../node-app` folder.

You can pass `destination` argument into the command as well.
Example:

- `create-node-app cloudfunctions /Users/foo/Documents/bar `

## 👷 Continuous Integration

### Environment variables

Make sure you replace all the variable values containing `REPLACEME` in `ci-branch-config` files.

The following variables must be set for each branch in `ci-branch-config` directory.

- `VAULT_SECRET_PATH` - Path to Vault secrets
- `GCP_PROJECT_ID` - GCP project identifier
- `VAULT_SECRET_TEST_PATH` - Path in vault leading to test credentials, this setting should be set in `common.env`

Optional variables:

- `SKIP_TESTS` - Skip tests, default is `false`
- `SKIP_AUDIT` - Skip tests, default is `false`

### GitLab CI secret variables

The following variables must be set in `Settings -> CI/CD -> Variables` on
GitLab project or its parent group:

- `SECRET_GCP_SA_KEY` - GCP service account key used for deployment
- `SECRET_VAULT_ADDR` - URL to Hashicorp Vault instance
- `SECRET_VAULT_TOKEN` - Token used for obtaining secrets from Hashicorp Vault instance, most probably project token

## 📄 Additional Resources

- [Google Cloudrun docs](https://cloud.google.com/run/docs)
