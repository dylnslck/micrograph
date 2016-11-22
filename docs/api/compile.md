# API
### `.compile(schema, queries, mutations, [middleware])`

Micrograph's main export is `compile`. `compile` transforms:

1. A `cohere` schema
2. A queries mapping
3. A mutations mapping
4. Middleware

into a `GraphQLSchema` that can be plugged into your favorite GraphQL server ([express-graphql](https://github.com/graphql/express-graphql), [graphql-server](https://github.com/apollostack/graphql-server), et al).

```javascript
// compiled.js
import { compile } from 'micrograph';
import schema from './schema';
import queries from './queries';
import mutations from './mutations';
import middleware from './middleware';

export default compile(schema, queries, mutations, middleware);
```

Then somewhere in your application:

```javascript
import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './compiled';

const app = express();
app.use('/graphql', graphqlHTTP({ schema });
app.listen(4000);
```
