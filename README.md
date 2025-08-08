<div align="center">

![](logo.png)

</div>

# Create Node App

CLI to help you set up Node.js TypeScript project. Set up project includes

- code style tools (prettier, lint)
- testing (using jest)
- infrastructure files of your choice (Docker, etc.)
- GitLab CI and npm ci-\* scripts (for Ackee CI/CD pipelines)

## Usage

Run directly from GitHub repo via npx:

```
Usage: npm exec --ignore-scripts -- github:AckeeCZ/create-node-app STARTER [OPTIONS] [DIRECTORY]

STARTER        Which template to setup (required)

Options:
  --dir, -d DIR       Destination directory (default: ./node-app)
  --project-name, -n NAME     Google Cloud project name (default: directory basename)
  --force, -f         Overwrite existing destination directory if it's not empty
  --help, -h          Show this help message

Starters available:
    cloudrun            Cloud Run + express
    cloudrun-graphql    Cloud Run + graphql
```

Supported starter templates:

- [Cloud Run](./starter/cloudrun/README.md)
- [GraphQL Cloud Run](./starter/cloudrun-graphql/README.md)
