<div align="center">

![](logo.png)

</div>

# Create Node App

CLI to help you set up a Node.js TypeScript project. The setup includes:

- code style tools (prettier, lint)
- testing (using mocha)
- infrastructure files of your choice (PostgreSQL etc.)
- CI pipeline templates (based on Ackee GitLab CI/CD pipelines)

## Usage

Run directly from GitHub repo via npx:

```
Usage: npm exec --ignore-scripts -- github:AckeeCZ/create-node-app [OPTIONS]

Options:
  --dir, -d PATH              Specifies directory path for app (default: node-app)
  --project-name, -n NAME     Google Cloud project name (default: same as directory)
  --force, -f                 Overwrite existing destination directory if it's not empty
  --debug -D                  Enables debug logging
  --help, -h                  Show this help message
```

## Setup options

- API layer
  - [RESTful](starter/api/rest/)
  - [GraphQL](starter/api/graphql/)
- Infrastructure
  - [PostgreSQL](starter/infra/postgresql-knex/) using [Knex](https://github.com/knex/knex)
- Pipelines
  - [GitLab CloudRun](starter/pipeline/cloudrun-gitlab/)
