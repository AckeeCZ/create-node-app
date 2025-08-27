# Create-Node-App Project
Node.js application bootstrapped with [create-node-app](https://github.com/AckeeCZ/create-node-app) 

## 🏗️ Architecture
All domain logic should live inside the [domain folder](src/domain) and should be accessed only via [container](src/container.ts). Each external dependency should be referenced by its own port inside the [domain/port](src/domain/ports) folder. These ports are also part of the container and can be implemented by any external dependency inside the [adapters](src/adapters/) folder. 

The application should be accessed through the [view](src/view/) layer of the application. All UI and interfaces should be defined there. The main entrypoint is defined in the [index.ts](src/index.ts) file.

Each domain service should always accept [RequestContext](src/context.ts) as the first parameter. Part of the context is also the container with all of the application dependencies.

## 👷 Development
Application configuration is handled by [Configuru](https://github.com/AckeeCZ/configuru). All env options that can be changed or need to be set up are described in [.env.jsonc](.env.jsonc). 

The whole codebase is checked and improved using lint and prettier, run `lint:fix` and `prettier:fix` before committing changes to git.

```bash
npm run lint:fix
npm run prettier:fix
```

## ✅ Tests
Test are written using [mocha](https://github.com/mochajs/mocha). They are maintained in two ways:
 - **unit tests** should be next to the tested file with `test.ts` suffix,
 - **integration tests** should be located inside the [test](src/test/) folder.

Use mocked container during integration tests.

If you need any prerequisites during tests, use the [setup.ts](src/test/setup.ts) file.

To run tests use the test command:
```bash
npm run test
```

## 🚀 Quick start
1. Build the code
```bash
npm run build
```
2. Start the entrypoint / server
```bash
npm run start
``` 
