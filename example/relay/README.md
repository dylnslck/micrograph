# Example Relay Micrograph application

Example [Relay](https://facebook.github.io/relay/docs/graphql-relay-specification.html) Micrograph application using [nedb](https://github.com/louischatriot/nedb) as the persistence layer. This example uses [graphql-relay-js](https://github.com/graphql/graphql-relay-js) for configuring connection args, connection types, and edge types.

## Run
Use a build tool like `babel` to transpile this folder. Or more simply run `babel-node index.js`. Explore the docs in Graphiql and you'll see that each type in the schema is configured with connection types automatically.
