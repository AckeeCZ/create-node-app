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
  -d, --dir           Destination directory         [string] [default: "./node-app"]
  -D, --debug         Enables debug logs                  [boolean] [default: false]
  -n, --project-name  Google Cloud project name       [string] [default: "node-app"]
  -f, --force         Overwrite existing destination if it's not empty
                                                          [boolean] [default: false]
      --api           Selects API
                                               [string] [choices: "graphql", "rest"]
      --database      Selects database as database
                                                 [string] [choices: "postgres-knex"]
      --pipeline      Selects pipeline
                                               [string] [choices: "cloudrun-gitlab"]
      --version       Show version number                                  [boolean]
      --help          Show help                                            [boolean]
```

## Setup options

- API layer
  - [RESTful](starter/api/rest/)
  - [GraphQL](starter/api/graphql/)
- Database
  - [PostgreSQL](starter/infra/postgresql-knex/) using [Knex](https://github.com/knex/knex)
- Pipelines
  - [GitLab CloudRun](starter/pipeline/cloudrun-gitlab/)
