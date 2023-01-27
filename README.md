# Create Node App

CLI to setup Node.js TypeScript project. Set up project includes
- code style tools (prettier, lint)
- testing (using jest)
- infrastructure files of your choice (Docker, Cloud Functions, etc.)
- GitLab CI and npm ci-* scripts (for Ackee CI/CD pipelines)

Run directly via npx:

```
Usage: npx github:AckeeCZ/create-node-app STARTER [DIRECTORY]

STARTER        Which template to setup
DIRECTORY      Destination directory where to set the starter up (default: ./node-app)

Starters available:
    cloudrun        Cloud Run + express
    cloudfunctions  Cloud Functions + graphql
```

Supported starter templates:

- [Cloud Run](./starter/cloudrun/README.md)
- [Cloud Functions](./starter/cloudfunctions/README.md)
