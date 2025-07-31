# Cloudrun Starter

Node.js project scaffolded with create-node-app Cloudrun

## 🎉 Initialize new project

Run `create-node-app cloudrun` to init your project. By default project is created in `../node-app` folder.

You can pass `destination` argument into the command as well.
Example:

- `create-node-app cloudrun /Users/foo/Documents/bar`

## 🧑‍💻 Development

Project follows port-adapters folder structure. Three main layers can be found in [src folder](src):

- [domain](src/domain) containing all domain services and ports for external services,
- [adapters](src/adapters) containing implementations of ports,
- and [view](src/view) containing entrypoints to the application (rest, cli).

The main entrypoint of the application is defined in the [src/index.ts](index.ts) file. The applicaiton dependencies are defined
and maintained in the [container.ts](src/container.ts) file which loads configuration from [config.ts](src/config.ts) using [configuru library](https://github.com/AckeeCZ/configuru).

Tests are divided in the two parts:

- integration tests should be maintained in the [test folder](src/test/)
- unit tests should be kept close to the targeted file and hold the same name as the tested file but with `test.ts` suffix

## 👷 Continuous Integration

### Environment variables

If you didn't provided GCloud project parameter, make sure you replace all the variable values containing `node-app` in `ci-branch-config` files.

The following variables must be set for each branch in `ci-branch-config` directory.

- `GCP_PROJECT_ID` - GCP project identifier
- `ENVIRONMENT` - e.g. `development`

Optional variables:

- `ALLOCATED_MEMORY` - Memory allocated at Cloudrun, default is 384Mi
- `CLOUD_RUN_SERVICE_ACCOUNT` - CloudRun service account
- `ENV_SECRETS` - Secret variables of the deployment, format is: `KEY=[NAME OF SECRET IN SECRET MANAGER:VERSION],...`
- `ENV_VARS` - Environment variables of the deployment, format is: `KEY=VALUE,...`
- `GCP_SA_KEY` - We use different service accounts for different environments. So we have to overwrite `GCP_SA_KEY` variable e.g.`GCP_SA_KEY=$SECRET_GCP_SA_KEY_DEVELOPMENT` Variable `SECRET_GCP_SA_KEY_<environment>` should be set in `GitLab CI secret variables`
- `GCP_SECRET_NAME` - Name of secret in Google Secret Manager
- `MAX_INSTANCES` - Maximum instance count in Cloudrun, default is 8
- `MIN_INSTANCES` - Minimum instance count in Cloudrun, default is 0
- `SECRET_PATH` - CloudRun volume where secrets will be injected e.g. `/config/secrets.json` can't be the same path ass app work dir e.g. `/usr/src/app` deploy will fail cause secret protection. But have to be identical with ENV `CFG_JSON_PATH` in Dockerfile
- `SKIP_AUDIT` - Skip NPM Audit, defaults to `false`
- `SKIP_LINT` - Skip lint, defaults to `false`
- `SKIP_TESTS` - Skip tests, defaults to `false`
- `SQL_INSTANCE_NAME` - SQL instance name
- `VPC_CONNECTOR_NAME` - serverless connector name, has to be in the same region
- `DOCKER_REGISTRY_TYPE` - whenever to push Docker image into Container Registry or Artifacts Registry, default is
  `container`
- `DOCKER_REGISTRY_URL` - hostname of Docker Registry, defaults to `eu.gcr.io`
- `ANY_ADDITIONAL_CLOUDRUN_ARGS` - any argument required by Cloud Run, eg `--concurrency=1000 --clear-labels ...`

Common variables:

- `GCP_TEST_SECRET_PROJECT_ID` - GCP project identifier for test secrets
- `GCP_SECRET_TEST_NAME` - Name of test secret in Google Secret Manager

## 📄 Additional Resources

- [Google Cloudrun docs](https://cloud.google.com/run/docs)
