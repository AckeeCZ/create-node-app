"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_cloud_functions_1 = require("apollo-server-cloud-functions");
// Construct a schema, using GraphQL schema language
const typeDefs = (0, apollo_server_cloud_functions_1.gql) `
  type Query {
    hello: String
  }
`;
// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        hello: () => 'Hello world!',
    },
};
// Because `NODE_ENV` is a reserved environment variable in Google Cloud
// Functions and it defaults to "production", you need to set the
// `introspection` option to `true` for a UI like Apollo Sandbox or GraphQL
// Playground to work correctly.
const server = new apollo_server_cloud_functions_1.ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
});
exports.default = server.createHandler();
//# sourceMappingURL=index.js.map